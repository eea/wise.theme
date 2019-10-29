from interfaces import IExternalLinks
from plone.app.dexterity.behaviors.metadata import (DCFieldProperty,
                                                    MetadataBase)

class ExternalLinks(MetadataBase):
    """ External Links Behavior
    """

    external_links = DCFieldProperty(IExternalLinks['external_links'])
