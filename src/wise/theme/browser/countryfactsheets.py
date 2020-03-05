import json

import requests

from Products.Five.browser import BrowserView


class CountryFactsheetView(BrowserView):
    """ Country factsheet view
    """
    pass


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
