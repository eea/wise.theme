from plone.app.dexterity.behaviors.metadata import (DCFieldProperty,
                                                    MetadataBase)

from .interfaces import (ICatalogueMetadata, IDisclaimer, IExternalLinks,
                         IReferenceLinks)


class ExternalLinks(MetadataBase):
    """External Links Behavior"""

    external_links = DCFieldProperty(IExternalLinks["external_links"])


class ReferenceLinks(MetadataBase):
    """Reference Links Behavior"""

    reference_links = DCFieldProperty(IReferenceLinks["reference_links"])


class Disclaimer(MetadataBase):
    """Disclaimer Behavior"""

    disclaimer = DCFieldProperty(IDisclaimer["disclaimer"])


class CatalogueMetadata(MetadataBase):
    """Wise metadata"""

    organisation = DCFieldProperty(ICatalogueMetadata["organisation"])
    dpsir_type = DCFieldProperty(ICatalogueMetadata["dpsir_type"])
    theme = DCFieldProperty(ICatalogueMetadata["theme"])
    subtheme = DCFieldProperty(ICatalogueMetadata["subtheme"])
    publication_year = DCFieldProperty(ICatalogueMetadata["publication_year"])
