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

from plone.memoize.view import memoize
from Products.Five.browser import BrowserView
from wise.msfd import db, sql
from wise.msfd.data import _get_report_filename_art7_2018, get_xml_report_data

logger = logging.getLogger('wise.theme')

Stat = namedtuple('Stat', ['Country', 'Subregion', 'Area_km2', 'Type'])
ConvWebsite = namedtuple('ConvWebsite', ['RSC', 'Web'])
CountryConv = namedtuple('CountryConv', ['Country', 'RSCs'])
MSFDWebsites = namedtuple('MSFDWebsites', ['Country', 'URL', 'Observations'])
Website = namedtuple('Website', ['name', 'href'])

GET_EXTENT_URL = ("""
https://trial.discomap.eea.europa.eu/arcgis/rest/services/Marine/Marine_waters_v3/MapServer/0/query?where=Country%3D%27COUNTRYMARKER%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=true&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson
""").strip()


GET_LAYER_TYPES_URL = ("""
http://trial.discomap.eea.europa.eu/arcgis/rest/services/Marine/Marine_waters_v3/MapServer/0/query?where=Country+%3D+%27COUNTRYMARKER%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=Type&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson
""")


MARINE_WATERS_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADNJREFUOI1jYaAyYKGZgfv+v/hPqWFOjBKMtHPhqIGjBo4aOGrg0DDQiVGCEcVAmAClAADQeQUJaPdGswAAAABJRU5ErkJggg==
""")
TERRITORIAL_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADBJREFUOI1jYaAyYKGdgc9W/qfYNKlwRhq6cNTAUQNHDRw1cGgYKBXOiGogVIBSAAAt/gQ1i+f+5QAAAABJRU5ErkJggg==
""")
CONTINENTAL_SHELF_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAIdJREFUOI3t1MENgCAMBdA2YRA29MIYJIQN2aReRBAKSqs3e9NvHt+IGHh5zHfgRqTWIqJpb9SXLpVFvL1mXR7ahrOH7zCLmN+QBZexajpQg3WgFmMbajAWlGAuEbFfWYpNG2qwKfjvw0c521CCDbeNFBs29AHYczGvDtDnZ3YcfQWM499pZXbHQIiyFUf9UgAAAABJRU5ErkJggg==
""")
EXTENDED_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAINJREFUOI3t1MENgCAMBVCaMBUMZVdxKOaqFwlQStVWb/akfvP8JqQxvDzxO3Ajcms7QOQPhnsq7SOQx4znmFhD7eUrDDLUP5TBp1g3M+jAZtCJyQ0dmAxaMCoUUAKtmNrQgengfw5v5WJDC7Y8NlZs2RCTvBexu+Z5zc7V10C+C41zAFjwaJU8RE5tAAAAAElFTkSuQmCC
""")
FISHERIES_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADtJREFUOI1jYaAyYKGZgb7PGP5TathmKQZGFnQBcg2DOYh2Xh41cNTAUQNHDcRpICVlIqzoY0EXoBQAAAtECh/OdEtnAAAAAElFTkSuQmCC
""")
AREA_IMG = ("""
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADpJREFUOI1jYaAyYKGZgf8ZGP5TahgjAwMjC7oAuYbBHEQ7L48aOGrgqIGjBuI0kJIyEVb0saALUAoAtHoGU/jZDVYAAAAASUVORK5CYII=
""")

LEGEND = {
    "Marine waters": MARINE_WATERS_IMG,
    "Territorial waters": TERRITORIAL_IMG,
    "Continental shelf": CONTINENTAL_SHELF_IMG,
    "Extended continental shelf": EXTENDED_IMG,
    "Fisheries Management Zone": FISHERIES_IMG,
    "Area designated for hydrocarbon exploration and exploitation": AREA_IMG,
}


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
                for (k, v) in LEGEND.items()
                if k in self.layer_types()]

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
        except HTTPError:
            import pdb
            pdb.set_trace()
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

    @memoize
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
