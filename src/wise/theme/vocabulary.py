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


def list_values_to_vocab(values):
    terms = [SimpleTerm(key, value, title)
             for (key, value, title) in values]
    terms.sort(key=lambda t: t.title)
    vocab = SimpleVocabulary(terms)

    return vocab


def values_to_vocab(values):
    terms = [SimpleTerm(x, x, x) for x in values]
    terms.sort(key=lambda t: t.title)
    vocab = SimpleVocabulary(terms)

    return vocab


countries = """
BE	BE	Belgium
BG	BG	Bulgaria
CY	CY	Cypres
DE	DE	Germany
DK	DK	Denmark
EE	EE	Estonia
EL	EL	Greece
ES	ES	Spain
FI	FI	Finland
FR	FR	France
HR	HR	Croatia
IE	IE	Ireland
IT	IT	Italy
LT	LT	Lithuania
LV	LV	Latvia
MT	MT	Malta
NL	NL	Netherlands
PL	PL	Poland
PT	PT	Portugal
RO	RO	Romania
SE	SE	Sweden
SI	SI	Slovenia
UK	UK	United Kingdom
""".split('\n')

countries = [l.strip() for l in countries if l.strip()]
countries = [l.split('\t') for l in countries]


@provider(IVocabularyFactory)
def countries_vocabulary(context):
    vocab = list_values_to_vocab(countries)
    return vocab
