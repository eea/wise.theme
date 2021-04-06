from plone.app.dexterity.behaviors.metadata import (DCFieldProperty,
                                                    MetadataBase)

from .interfaces import IDisclaimer, IExternalLinks, IReferenceLinks


class ExternalLinks(MetadataBase):
    """External Links Behavior"""

    external_links = DCFieldProperty(IExternalLinks["external_links"])


class ReferenceLinks(MetadataBase):
    """Reference Links Behavior"""

    reference_links = DCFieldProperty(IReferenceLinks["reference_links"])


class Disclaimer(MetadataBase):
    """Disclaimer Behavior"""

    disclaimer = DCFieldProperty(IDisclaimer["disclaimer"])
