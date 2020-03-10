from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm, SimpleVocabulary

# See https://developers.arcgis.com/javascript/3/jsapi/esri.basemaps-amd.html
layers = """
dark-gray
dark-gray-vector
gray
gray-vector
hybrid
national-geographic
oceans
osm
satellite
streets
streets-navigation-vector
streets-night-vector
streets-relief-vector
streets-vector
terrain
topo
topo-vector
""".split('\n')

layers = [l.strip() for l in layers if l.strip()]


@provider(IVocabularyFactory)
def layers_vocabulary(context):
    return values_to_vocab(layers)


def values_to_vocab(values):
    terms = [SimpleTerm(x, x, x) for x in values]
    terms.sort(key=lambda t: t.title)
    vocab = SimpleVocabulary(terms)

    return vocab
