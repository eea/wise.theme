
from __future__ import absolute_import
import requests

from plone.app.dexterity.behaviors.metadata import (DCFieldProperty,
                                                    MetadataBase)
from plone.namedfile.file import NamedBlobImage
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

    original_source = DCFieldProperty(ICatalogueMetadata["original_source"])
    organisation = DCFieldProperty(ICatalogueMetadata["organisation"])
    dpsir_type = DCFieldProperty(ICatalogueMetadata["dpsir_type"])
    theme = DCFieldProperty(ICatalogueMetadata["theme"])
    subtheme = DCFieldProperty(ICatalogueMetadata["subtheme"])
    publication_year = DCFieldProperty(ICatalogueMetadata["publication_year"])
    thumbnail = DCFieldProperty(ICatalogueMetadata["thumbnail"])

    sources = DCFieldProperty(ICatalogueMetadata["sources"])


def set_thumbnail(context, event):
    """ Set the thumbnail image if it was not completed and the
        original_source is www.eea.europa.eu
    """

    if not context.original_source:
        return context

    if 'www.eea.europa.eu' not in context.original_source:
        return context

    if context.thumbnail:
        return context

    image_url = context.original_source + '/image_large'
    filename = u'image_large.png'
    response = requests.get(image_url)

    if not response.ok:
        return context

    context.thumbnail = NamedBlobImage(data=response.content,
                                       filename=filename)

    return context
