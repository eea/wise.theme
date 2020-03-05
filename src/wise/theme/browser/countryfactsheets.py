import csv
import json
from collections import namedtuple
from decimal import Decimal

import requests
from pkg_resources import resource_filename
from zope.i18n.locales import locales

from Products.Five.browser import BrowserView

Stat = namedtuple('Stat', ['Country', 'Subregion', 'Area_km2', 'Type'])


def parse_csv():
    wf = resource_filename('wise.theme', 'data/Marine_waters_statistics.csv')

    reader = csv.reader(open(wf))
    cols = reader.next()
    stats = []

    for line in reader:
        d = dict(zip(cols, line))
        s = Stat(**d)
        stats.append(s)

    return stats


STATS = parse_csv()


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
        return sum([int(b[1]) for b in self.water_stats()])


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
