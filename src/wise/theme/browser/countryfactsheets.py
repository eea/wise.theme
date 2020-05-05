import csv
import json
import logging
from collections import namedtuple
from decimal import Decimal
from urllib2 import HTTPError

import requests
from lxml.etree import fromstring
from pkg_resources import resource_filename
from zope.component import getUtility
from zope.i18n.locales import locales
from zope.schema.interfaces import IVocabularyFactory

from plone.memoize import ram
from Products.Five.browser import BrowserView
from wise.msfd import db, sql
from wise.msfd.data import _get_report_filename_art7_2018, get_xml_report_data

logger = logging.getLogger('wise.theme')

Stat = namedtuple('Stat', ['Country', 'Subregion', 'Area_km2', 'Type'])
ConvWebsite = namedtuple('ConvWebsite', ['RSC', 'Web'])
CountryConv = namedtuple('CountryConv', ['Country', 'RSCs'])
MSFDWebsites = namedtuple('MSFDWebsites', ['Country', 'URL', 'Observations'])
Website = namedtuple('Website', ['name', 'href'])

MAP_SERVER = "https://test.discomap.eea.europa.eu/arcgis/rest/services"
MAP_USER = "Marine"
MAP_SERVICE = "Marine_waters_v4"
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


# MARINE_WATERS_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADNJREFUOI1jYaAyYKGZgfv+v/hPqWFOjBKMtHPhqIGjBo4aOGrg0DDQiVGCEcVAmAClAADQeQUJaPdGswAAAABJRU5ErkJggg==
# """)
# TERRITORIAL_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADBJREFUOI1jYaAyYKGdgc9W/qfYNKlwRhq6cNTAUQNHDRw1cGgYKBXOiGogVIBSAAAt/gQ1i+f+5QAAAABJRU5ErkJggg==
# """)
# CONTINENTAL_SHELF_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAIdJREFUOI3t1MENgCAMBdA2YRA29MIYJIQN2aReRBAKSqs3e9NvHt+IGHh5zHfgRqTWIqJpb9SXLpVFvL1mXR7ahrOH7zCLmN+QBZexajpQg3WgFmMbajAWlGAuEbFfWYpNG2qwKfjvw0c521CCDbeNFBs29AHYczGvDtDnZ3YcfQWM499pZXbHQIiyFUf9UgAAAABJRU5ErkJggg==
# """)
# EXTENDED_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAINJREFUOI3t1MENgCAMBVCaMBUMZVdxKOaqFwlQStVWb/akfvP8JqQxvDzxO3Ajcms7QOQPhnsq7SOQx4znmFhD7eUrDDLUP5TBp1g3M+jAZtCJyQ0dmAxaMCoUUAKtmNrQgengfw5v5WJDC7Y8NlZs2RCTvBexu+Z5zc7V10C+C41zAFjwaJU8RE5tAAAAAElFTkSuQmCC
# """)
# FISHERIES_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGZgb7PGP5TathmKQZGFnQBcg2DOYh2Xh41cNTAUQNHDcRpICVlIqzoY0EXoBQAAAtECh/OdEtnAAAAAElFTkSuQmCC
# """)
# AREA_IMG = ("""
# data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADpJREFUOI1jYaAyYKGZgf8ZGP5TahgjAwMjC7oAuYbBHEQ7L48aOGrgqIGjBuI0kJIyEVb0saALUAoAtHoGU/jZDVYAAAAASUVORK5CYII=
# """)
#
# LEGEND = {
#     "Marine waters": MARINE_WATERS_IMG,
#     "Territorial waters": TERRITORIAL_IMG,
#     "Continental shelf": CONTINENTAL_SHELF_IMG,
#     "Extended continental shelf": EXTENDED_IMG,
#     "Fisheries Management Zone": FISHERIES_IMG,
#     "Area designated for hydrocarbon exploration and exploitation": AREA_IMG,
# }


# TODO: don't hardcode legend, use
# https://test.discomap.eea.europa.eu/arcgis/rest/services/Marine/Marine_waters_v4/MapServer/legend?f=pjson


def parse_csv(path, klass):
    wf = resource_filename('wise.theme', path)

    reader = csv.reader(open(wf))
    cols = reader.next()
    stats = []

    for line in reader:
        d = dict(zip(cols, line))
        s = klass(**d)
        stats.append(s)

    return stats


STATS = parse_csv('data/Marine_waters_statistics.csv', Stat)
CONVENTION_WEBSITES = parse_csv('data/convention_websites.csv', ConvWebsite)
COUNTRY_CONVENTIONS = parse_csv('data/country_conventions.csv', CountryConv)
MSFD_WEBSITES = parse_csv('data/MSFD_websites.csv', MSFDWebsites)


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

    @ram.cache(lambda fun, self: True)
    def _api_legend(self):
        url = "{server}/{user}/{service}/MapServer/legend?f=pjson".format(
            server=MAP_SERVER, user=MAP_USER, service=MAP_SERVICE
        )
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

    def authorities(self):
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

    def country_name(self):
        util = getUtility(IVocabularyFactory, name="wise_search_member_states")
        vocab = util(self.context)

        for term in vocab:
            if term.value == self.context.country:
                return term.title

        return ''

    @ram.cache(lambda fun, self: self.context.getPhysicalPath())
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

    @ram.cache(lambda fun, self: self.context.getPhysicalPath())
    def get_extent(self):
        """ Get the extent for the context country
        """
        url = GET_EXTENT_URL.replace('COUNTRYMARKER', self.context.country)
        resp = requests.get(url)
        res = resp.json()

        logger.error('Got response in query extent %r', res)
        return json.dumps(res)
