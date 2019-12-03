from .interfaces import IExternalLinks
from .interfaces import IReferenceLinks
from plone.app.dexterity.behaviors.metadata import (DCFieldProperty,
                                                    MetadataBase)

class ExternalLinks(MetadataBase):
    """ External Links Behavior
    """

    external_links = DCFieldProperty(IExternalLinks['external_links'])

class ReferenceLinks(MetadataBase):
    """ Reference Links Behavior
    """

    reference_links = DCFieldProperty(IReferenceLinks['reference_links'])
