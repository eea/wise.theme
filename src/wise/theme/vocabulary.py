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
""".split(
    "\n"
)

layers = [lr.strip() for lr in layers if lr.strip()]


@provider(IVocabularyFactory)
def layers_vocabulary(context):
    return values_to_vocab(layers)


def list_values_to_vocab(values):
    terms = [SimpleTerm(key, value, title) for (key, value, title) in values]
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
CY	CY	Cyprus
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
""".split(
    "\n"
)

countries = [l.strip() for l in countries if l.strip()]
countries = [l.split("\t") for l in countries]


@provider(IVocabularyFactory)
def countries_vocabulary(context):
    vocab = list_values_to_vocab(countries)
    return vocab


types = [
    "Indicator" "Data visualization",
    "Publication/Report",
    "Spatial datasets",
    "Map (interative)",
    "Data",
]


@provider(IVocabularyFactory)
def types_vocabulary(context):
    return values_to_vocab(types)


dpsir = [
    "Pressure",
    "State",
    "Impact",
    "Response",
    "Other",
]


@provider(IVocabularyFactory)
def dpsir_vocabulary(context):
    return values_to_vocab(dpsir)


themes = [
    "Climate change",
    "Contaminants",
    "Ecosystem",
    "Eutrophication",
    "Extraction of species",
    "Habitats",
    "Hydrographical conditions",
    "Marine litter",
    "Marine Protected Areas",
    "Non-indigenous species",
    "Physical damage",
    "Physical disturbance",
    "Species",
    "Underwater noise",
    "Not classified",
]


@provider(IVocabularyFactory)
def themes_vocabulary(context):
    return values_to_vocab(themes)


subthemes = [
    "Acidification",
    "Aquaculture",
    "Beach litter",
    "Benthic habitats",
    "Birds",
    "By-catch",
    "Chlorophyll-a concentration",
    "Coastline",
    "Commercially exploited fish",
    "Contaminants concentration",
    "Coverage",
    "Effects in organisms",
    "Established NIS",
    "Extent of physical Damage",
    "Fish",
    "Impulsive noise",
    "Incidental by-catch",
    "Input of contaminants",
    "Input of non-indigenous species",
    "Input of nutrients",
    "Litter in the water column",
    "Litter ingested",
    "Litter on the seafloor",
    "Macrofauna communities",
    "Mammals",
    "Microbial pathogens",
    "Nutrient concentrations",
    "Oxygen",
    "Oxygen content",
    "Permanent alterations",
    "Phytoplankton blooms",
    "Phytoplankton production",
    "Plankton diversity",
    "Predators",
    "Radionucleids",
    "Reptiles",
    "Sea ice",
    "Sea level",
    "Sea temperature",
    "Seabirds",
    "Species distribution",
    "Transparency",
    "Zooplankton",
    "Not classified",
]


@provider(IVocabularyFactory)
def subthemes_vocabulary(context):
    return values_to_vocab(subthemes)


organisations = [
    "European Environment Agency",
    "Environment Directorate General of the European Commission ",
    "European Topic Centre on Inland, Coastal and Marine waters",
    "OSPAR Commission-Protecting and conserving the North-East Atlantic and its",
    "resources",
    "The Baltic Marine Environment Protection Commission",
    "UN Environment Programme / Mediterranean Action Plan",
    "Black Sea Commission (BS",
    "Other",
]


@provider(IVocabularyFactory)
def organisations_vocabulary(context):
    return values_to_vocab(organisations)
