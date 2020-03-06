import csv
import json
from collections import namedtuple
from decimal import Decimal

import requests
from pkg_resources import resource_filename
from zope.component import getUtility
from zope.i18n.locales import locales
from zope.schema.interfaces import IVocabularyFactory

from Products.Five.browser import BrowserView

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
        "ANS": "NE Atlantic: Greater North Sea, incl. Kattegat & English Channel",
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

    def authorities(self):
        from wise.msfd.data import _get_report_filename_art7_2018
        from wise.msfd.data import get_report_file_url
        from wise.msfd.data import get_xml_report_data
        from lxml.etree import fromstring

        res = []
        fname = _get_report_filename_art7_2018(self.context.country,
                                               None, None, None)
        # furl = get_report_file_url(fname)
        report_data = get_xml_report_data(fname)
        etree = fromstring(report_data)
        NSMAP = {"w": "http://water.eionet.europa.eu/schemas/dir200856ec"}
        auth_nodes = etree.xpath('//w:CompetentAuthority', namespaces=NSMAP)

        for node in auth_nodes:
            name = node.xpath('w:CompetentAuthorityName/text()',
                              namespaces=NSMAP)[0]
            href = node.xpath('w:URL/text()', namespaces=NSMAP)[0]

            res.append(Website(name, href))

        return res

    def country_name(self):
        util = getUtility(IVocabularyFactory, name="wise_search_member_states")
        vocab = util(self.context)

        for term in vocab:
            if term.value == self.context.country:
                return term.title

        return ''


GET_EXTENT_URL = (
    "https://trial.discomap.eea.europa.eu/arcgis/rest/services/Marine/"
    "Marine_waters/MapServer/0/query?where=Country%3D%27COUNTRYMARKER%27&text="
    "&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&"
    "spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&"
    "returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&"
    "geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly="
    "false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&"
    "returnZ=false&returnM=false&gdbVersion=&historicMoment=&"
    "returnDistinctValues=false&resultOffset=&resultRecordCount=&"
    "queryByDistance=&returnExtentOnly=true&datumTransformation=&"
    "parameterValues=&rangeValues=&quantizationParameters=&featureEncoding="
    "esriDefault&f=pjson"
)


class CountryMap(BrowserView):
    layerUrl = "https://trial.discomap.eea.europa.eu/arcgis/rest/services/"\
        "Marine/Marine_waters/MapServer"

    def title(self):
        return "Country map for {}".format(self.context.country)

    def get_extent(self):
        """ Get the extent for the context country
        """
        resp = requests.get(GET_EXTENT_URL.replace(
            'COUNTRYMARKER', self.context.country))
        res = resp.json()

        return json.dumps(res)
