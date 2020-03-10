import csv
import json
from collections import namedtuple
from decimal import Decimal

import requests
from lxml.etree import fromstring
from pkg_resources import resource_filename
from zope.component import getUtility
from zope.i18n.locales import locales
from zope.schema.interfaces import IVocabularyFactory

from plone.memoize.view import memoize
from Products.Five.browser import BrowserView
from wise.msfd import db, sql
from wise.msfd.data import _get_report_filename_art7_2018, get_xml_report_data

Stat = namedtuple('Stat', ['Country', 'Subregion', 'Area_km2', 'Type'])
ConvWebsite = namedtuple('ConvWebsite', ['RSC', 'Web'])
CountryConv = namedtuple('CountryConv', ['Country', 'RSCs'])
MSFDWebsites = namedtuple('MSFDWebsites', ['Country', 'URL', 'Observations'])
Website = namedtuple('Website', ['name', 'href'])


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
        res = []
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

            res.append(Website(name, href))

        return res

    @db.use_db_session('2012')
    def get_authorities_2012(self):
        count, recs = db.get_all_records(
            [sql.t_MS_CompetentAuthorities],
            sql.t_MS_CompetentAuthorities.c.C_CD == self.context.country)
        res = []

        for rec in recs:
            url = rec.URL_CA

            if not (url.startswith('http') or url.startswith('https')):
                url = "https://{}".format(url)
            res.append(Website(rec.CompetentAuthorityName, url))

        return res

    def authorities(self):
        code = self.context.country
        try:
            fname = _get_report_filename_art7_2018(code, None, None, None)
            res = self.get_authorities_2018(fname)
            raise IndexError
        except IndexError:
            res = self.get_authorities_2012()

        return res

    def country_name(self):
        util = getUtility(IVocabularyFactory, name="wise_search_member_states")
        vocab = util(self.context)

        for term in vocab:
            if term.value == self.context.country:
                return term.title

        return ''


GET_EXTENT_URL = ("""
https://trial.discomap.eea.europa.eu/arcgis/rest/services/Marine/Marine_waters_v3/MapServer/0/query?where=Country%3D%27COUNTRYMARKER%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=true&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson
""").strip()


class CountryMap(BrowserView):
    layerUrl = "https://trial.discomap.eea.europa.eu/arcgis/rest/services/"\
        "Marine/Marine_waters_v3/MapServer"

    def title(self):
        return "Country map for {}".format(self.context.country)

    @memoize
    def get_extent(self):
        """ Get the extent for the context country
        """
        resp = requests.get(GET_EXTENT_URL.replace(
            'COUNTRYMARKER', self.context.country))
        res = resp.json()

        return json.dumps(res)

# <script type="text/javascript">
#       // <![CDATA[
#       require([
#       "esri/Map",
#       "esri/views/MapView",
#       "esri/widgets/Home",
#       "esri/layers/MapImageLayer",
#       "esri/geometry/Extent",
#       "esri/views/layers/support/FeatureFilter",
#       "dojo/domReady!"
#       ], function(Map, MapView, Home, MapImageLayer, Extent, FeatureFilter) {
#               var map = new Map();
#               var view = new MapView({
#                 container: "viewDiv",
#                 map: map,
#               });
#               view.extent = new Extent(extent.extent);
#               view.filter = new FeatureFilter({
#                 where: "Country = '${context/country}'",
#               });
#
#               //var homeBtn = new Home({
#               //view: view
#               //});
#               // view.ui.add(homeBtn, "top-left");
#               var layer = new MapImageLayer('${view/layerUrl}', null);
#               map.layers.add(layer);
#           });
#         // ]]>
#       </script>
