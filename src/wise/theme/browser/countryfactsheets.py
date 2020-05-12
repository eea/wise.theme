import json
import logging
from collections import namedtuple
from decimal import Decimal
from urllib2 import HTTPError

import requests
from lxml.etree import fromstring
from zope.component import getUtility
from zope.i18n.locales import locales
from zope.interface import alsoProvides
from zope.schema.interfaces import IVocabularyFactory

from plone.app.textfield.value import RichTextValue
from plone.dexterity.utils import createContentInContainer as create
from plone.memoize import ram
from plone.protect.interfaces import IDisableCSRFProtection
from Products.Five.browser import BrowserView
from wise.msfd import db, sql
from wise.msfd.data import _get_report_filename_art7_2018, get_xml_report_data
from wise.theme.browser.utils import parse_csv

logger = logging.getLogger('wise.theme')

Stat = namedtuple('Stat', ['Country', 'Subregion', 'Area_km2', 'Type'])
ConvWebsite = namedtuple('ConvWebsite', ['RSC', 'Web'])
CountryConv = namedtuple('CountryConv', ['Country', 'RSCs'])
MSFDWebsites = namedtuple('MSFDWebsites', ['Country', 'URL', 'Observations'])
Website = namedtuple('Website', ['name', 'href'])

STATS = parse_csv('data/Marine_waters_statistics.csv', Stat)
CONVENTION_WEBSITES = parse_csv('data/convention_websites.csv', ConvWebsite)
COUNTRY_CONVENTIONS = parse_csv('data/country_conventions.csv', CountryConv)
MSFD_WEBSITES = parse_csv('data/MSFD_websites.csv', MSFDWebsites)
MSFD_COUNTRIES = parse_csv('data/MSFD_countries.csv', dict)
MSFD_COUNTRY_STATS = parse_csv('data/MSFD_countries_stats.csv', dict)


# https://marine.discomap.eea.europa.eu/arcgis/rest/services/Marine/EU_Marine_waters/MapServer
# "https://test.discomap.eea.europa.eu/arcgis/rest/services"
# MAP_SERVICE = "Marine_waters_v4"
MAP_SERVER = "https://marine.discomap.eea.europa.eu/arcgis/rest/services"
MAP_USER = "Marine"
MAP_SERVICE = "EU_Marine_waters"
MAP_LAYER = 0

GET_EXTENT_PARAMS = {
    'datumTransformation': '',
    'f': 'pjson',
    'featureEncoding': 'esriDefault',
    'gdbVersion': '',
    'geometry': '',
    'geometryPrecision': '',
    'geometryType': 'esriGeometryEnvelope',
    'groupByFieldsForStatistics': '',
    'having': '',
    'historicMoment': '',
    'inSR': '',
    'maxAllowableOffset': '',
    'objectIds': '',
    'orderByFields': '',
    'outFields': '',
    'outSR': '',
    'outStatistics': '',
    'parameterValues': '',
    'quantizationParameters': '',
    'queryByDistance': '',
    'rangeValues': '',
    'relationParam': '',
    'resultOffset': '',
    'resultRecordCount': '',
    'returnCountOnly': 'false',
    'returnDistinctValues': 'false',
    'returnExtentOnly': 'true',
    'returnGeometry': 'true',
    'returnIdsOnly': 'false',
    'returnM': 'false',
    'returnTrueCurves': 'false',
    'returnZ': 'false',
    'spatialRel': 'esriSpatialRelIntersects',
    'text': '',
    'time': '',
    'where': 'Country%3D%27COUNTRYMARKER%27'
}


"""
https://test.discomap.eea.europa.eu/arcgis/rest/services/Marine/Marine_waters_v4/MapServer/0/query?where=COUNTRY+%3D+%27DK%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentsOnly=true&datumTransformation=&parameterValues=&rangeValues=&f=pjson
"""

GET_EXTENT_URL = ("""
{server}/{user}/{service}/MapServer/{layer}/query?{query}
""").strip().format(server=MAP_SERVER, user=MAP_USER, service=MAP_SERVICE,
                    layer=MAP_LAYER,
                    query="&".join(
                        ["%s=%s" % (k, v)
                            for k, v in GET_EXTENT_PARAMS.items()]))


GET_LAYER_TYPES_URL = ("""
{server}/{user}/{service}/MapServer/{layer}/query?where=Country+%3D+%27COUNTRYMARKER%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=Type&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson
""").strip().format(server=MAP_SERVER, user=MAP_USER, service=MAP_SERVICE,
                    layer=MAP_LAYER)


class CountryFactsheetView(BrowserView):
    """ Country factsheet view
    """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    regions = {
        "BAL": "Baltic Sea",
        "ATL": "North-East Atlantic Ocean",
        "ANS": "NE Atlantic: Greater North Sea, incl. Kattegat & "
        "English Channel",
        "ACS": "NE Atlantic: Celtic Seas",
        "ABI": "NE Atlantic: Bay of Biscay & Iberian Coast",
        "AMA": "NE Atlantic: Macaronesia",
        "MED": "Mediterranean Sea",
        "MWE": "Western Mediterranean Sea",
        "MAD": "Mediterranean: Adriatic Sea",
        "MIC": "Mediterranean: Ionian Sea & Central Mediterranean Sea",
        "MAL": "Mediterranean: Aegean - Levantine Sea",
        "BLK": "Black Sea",
    }

    def legend(self):
        return [(k, v)
                for (k, v) in self._api_legend().items()
                if k in self.layer_types()]

    @ram.cache(lambda fun, self: self.context.country)
    def _api_legend(self):
        url = "{server}/{user}/{service}/MapServer/legend?f=pjson".format(
            server=MAP_SERVER, user=MAP_USER, service=MAP_SERVICE
        )
        logger.info("Legend API call: %s", url)
        resp = requests.get(url)
        j = resp.json()
        layer = [l for l in j['layers'] if l['layerId'] == MAP_LAYER][0]
        res = {}
        for item in layer['legend']:
            res[item['label']] = "data:image/png;base64," + item['imageData']

        return res

    def format_nr(self, nr):
        target_language = 'en'
        locale = locales.getLocale(target_language)
        formatter = locale.numbers.getFormatter('decimal')

        return formatter.format(Decimal(str(nr)))

    def get_subregion_title(self, region_id):
        return self.regions.get(region_id, region_id)

    def water_stats(self):
        code = self.context.country
        res = []

        for stat in STATS:
            if stat.Country == code:
                res.append([self.regions[stat.Subregion], stat.Area_km2])

        return res

    def water_stats_total(self):
        return sum([Decimal(b[1]) for b in self.water_stats()])

    def msfd_website(self):
        for line in MSFD_WEBSITES:
            if line.Country == self.context.country:
                return line

    def conventions(self):
        res = []

        for line in COUNTRY_CONVENTIONS:
            if line.Country == self.context.country:
                convs = line.RSCs.split(';')

                for conv_name in convs:
                    for cw in CONVENTION_WEBSITES:
                        if cw.RSC == conv_name:
                            res.append(cw)

        return res

    def get_authorities_2018(self, fname):
        res = set()
        report_data = get_xml_report_data(fname)
        # furl = get_report_file_url(fname)
        etree = fromstring(report_data)
        NSMAP = {"w": "http://water.eionet.europa.eu/schemas/dir200856ec"}
        auth_nodes = etree.xpath('//w:CompetentAuthority', namespaces=NSMAP)

        for node in auth_nodes:
            name = node.xpath('w:CompetentAuthorityName/text()',
                              namespaces=NSMAP)[0]
            href = node.xpath('w:URL/text()', namespaces=NSMAP)[0]

            if not (href.startswith('http') or href.startswith('https')):
                href = "https://{}".format(href)

            res.add(Website(name, href))

        return res

    @db.use_db_session('2012')
    def get_authorities_2012(self):
        res = set()

        count, recs = db.get_competent_auth_data(
            sql.t_MS_CompetentAuthorities.c.C_CD == self.context.country)

        for rec in recs:
            url = rec.URL_CA

            if not (url.startswith('http') or url.startswith('https')):
                url = "https://{}".format(url)
            res.add(Website(rec.CompetentAuthorityName, url))

        return res

    @ram.cache(lambda fun, self: self.context.country)
    def authorities(self):
        logger.info("Get authorities: %s", self.context.country)
        code = self.context.country
        try:
            fname = _get_report_filename_art7_2018(code, None, None, None)
            res = self.get_authorities_2018(fname)
            raise IndexError
        except IndexError:
            res = self.get_authorities_2012()
        except HTTPError:
            logger.exception("HTTPError in getting report for %s",
                             self.context.country)

            return []

        return res

    @ram.cache(lambda fun, self: self.context.country)
    def country_name(self):
        util = getUtility(IVocabularyFactory, name="wise_search_member_states")
        vocab = util(self.context)

        for term in vocab:
            if term.value == self.context.country:
                return term.title

        return ''

    @ram.cache(lambda fun, self: self.context.country)
    def layer_types(self):
        """
        """
        url = GET_LAYER_TYPES_URL.replace('COUNTRYMARKER',
                                          self.context.country)
        resp = requests.get(url.strip())

        try:
            res = resp.json()
        except:
            logger.exception("Error in parsing response in url: %s", url)
            return []

        return set([b['attributes']['Type'] for b in res['features']])

        # response is like:
        #
        # {
        #  "displayFieldName": "Country",
        #  "fieldAliases": {
        #   "Type": "Type"
        #  },
        #  "fields": [
        #   {
        #    "name": "Type",
        #    "type": "esriFieldTypeString",
        #    "alias": "Type",
        #    "length": 100
        #   }
        #  ],
        #  "features": [
        #   {
        #    "attributes": {
        #     "Type": "Marine waters"
        #    }
        #   },
        #   {
        #    "attributes": {
        #     "Type": "Marine waters"
        #    }
        #   },
        #   {
        #    "attributes": {
        #     "Type": "Marine waters"
        #    }
        #   },
        #   {
        #    "attributes": {
        #     "Type": "Land"
        #    }
        #   }
        #  ]


class CountryMap(BrowserView):
    layerUrl = "/".join([MAP_SERVER, MAP_USER, MAP_SERVICE]) + '/MapServer'
    # "https://trial.discomap.eea.europa.eu/arcgis/rest/services/"\
    #     "Marine/Marine_waters_v4/MapServer"

    def title(self):
        return "Country map for {}".format(self.context.country)

    @ram.cache(lambda fun, self: self.context.country)
    def get_extent(self):
        """ Get the extent for the context country
        """
        url = GET_EXTENT_URL.replace('COUNTRYMARKER', self.context.country)
        resp = requests.get(url)
        res = resp.json()

        logger.error('Got response in query extent %r', res)
        return json.dumps(res)


class BootstrapCountrySection(BrowserView):
    """ Automatically create and bootstrap the countries
    """

    def countries(self):
        res = {}

        for rec in MSFD_COUNTRIES:
            res[rec['Country']] = rec

        for rec in MSFD_COUNTRY_STATS:
            res[rec['Country']].update(rec)

        util = getUtility(IVocabularyFactory, name="wise_search_member_states")
        vocab = util(self.context)

        for term in vocab:
            res[term.token]['title'] = term.title

        return res

    def __call__(self):
        parent = self.context

        # info is like:
        # {'% of the total country area': '10',
        # 'Country': 'BE',
        # 'Ecological and chemical status of transitional, coastal and territorial waters': 'https://tableau.discomap.eea.europa.eu/t/Wateronline/views/WISE_SOW_Status_Marine_Country_profile/SWB_Status_Category_Country?P_Country=Belgium',
        # 'Marine surface per capita': '0.03',
        # 'Status of bathing waters in transitional and coastal sites': 'https://tableau.discomap.eea.europa.eu/t/Wateronline/views/BathingWaterQuality_Marine_Country_profile/Country?P_Country=Belgium',
        # 'Status of marine species and habitats': 'https://tableau.discomap.eea.europa.eu/t/Wateronline/views/NatureDirectives_Marine_status_Pie/Pie?Country_param=BE',
        # 'Status of the marine environment': 'https://tableau.discomap.eea.europa.eu/#/site/Wateronline/views/GESassessments_CountryProfiles/CountryProfiles?Country=Belgium',
        # 'title': u'Belgium'
        dashboards = [
            ['Status of the marine environment',
                """COUNTRY has assessed the environmental status of a number of
                features per descriptor under the 2018 update of MSFD Article
                8, which were reported electronically to the European
                Commission. The following dashboard shows the marine waters'
                area where, for those features, the Good Environmental Status
                has been achieved, not yet achieved or is unknown or not
                assessed."""],
            ['Status of marine species and habitats', """The conservation
            status of the habitats and species listed in the Habitats Directive
            annexes has to be assessed and reported to the European Commission
            under Article 17 every 6 years. The assessment is based on
            information about the status and trends of species populations and
            of habitats at the level of the biogeographical or marine region.
            In the following dashboard, the assessments reported by COUNTRY are
            presented, where they can be displayed as status or status and
            trend."""],
            ['Ecological and chemical status of transitional, coastal and '
             'territorial waters',
             """The ecological status of the water bodies is based on biological
            quality elements and supported by physico-chemical and
            hydromorphological quality elements. On the other hand, the good
            chemical status is achieved when no concentrations of priority
            substances exceed the relevant EQS established in the Environmental
            Quality Standards Directive. The results reported by COUNTRY on the
            first and second River Basin Management Plans are presented in the
            dashboard below."""],
            ['Status of bathing waters in transitional and coastal sites',
             """The bathing waters sites are monitored under the Bathing Water
            Directive in regards to the values of two microbiological
            parameters (Intestinal enterococci and Escherichia coli) and the
            results are reported on a yearly basis to the European Commission.
            Where a bathing water is classified as 'poor', Member States should
            take measures such as banning bathing or advising against it,
            providing information to the public, and taking suitable corrective
            actions. The dashboard displays the results reported by COUNTRY,
            where in 2018 most of the bathing waters were excellent or good."""
             ],
        ]
        codes = {
            'PL': 'Poland',
            'MT': 'Malta',
            'RO': 'Romania',
        }
        for code, info in sorted(self.countries().items(), key=lambda x: x[0]):
            if not info.get('title'):
                info['title'] = codes[info['Country']]

            logger.info('Creating country: %s', code)

            country_title = info['title']
            country = create(parent,
                             'country_factsheet',
                             id=country_title,
                             title=country_title)
            country.country = code
            country.marine_water_per_country = float(
                info['% of the total country area'])
            country.marine_water_per_capita = float(
                info['Marine surface per capita'])
            country.basemap_layer = 'osm'

            for (ds, text) in dashboards:
                fs = create(country,
                            'country_factsheet_section',
                            id=ds,
                            title=ds)

                fs.dashboard_height = '850px'
                if ds == 'Status of marine species and habitats':
                    fs.dashboard_height = '630px'
                # if ds == 'Status of the marine environment':
                #     fs.dashboard_height = '630px'

                if 'http' in info[ds]:
                    fs.tableau_url = info[ds]
                    fs.text_above_dashboard = RichTextValue(
                        text.replace('\n', ' ').replace(
                            'COUNTRY', info['title']),
                        'text/plain', 'text/html')
                else:
                    fs.text = RichTextValue(
                        info[ds].decode('utf-8'), 'text/plain', 'text/html')

        logger.info('done')

        alsoProvides(self.request, IDisableCSRFProtection)
        return 'ok'
