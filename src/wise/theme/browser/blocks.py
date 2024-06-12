from urllib.parse import urlparse
from AccessControl import Unauthorized
from plone import api
from plone.restapi.behaviors import IBlocks
from plone.restapi.interfaces import IBlockFieldSerializationTransformer
from plone.restapi.deserializer.utils import path2uid
from plone.restapi.serializer.utils import RESOLVEUID_RE, uid_to_url
from zExceptions import Forbidden
from zope.component import adapter
from zope.interface import implementer
from zope.publisher.interfaces.browser import IBrowserRequest
from eea.api.dataconnector.browser.blocks import (
    EmbedTableauVisualizationSerializationTransformer as BaseEmbedTableauVisualizationSerializationTransformer,
    EmbedEEAMapBlockSerializationTransformer as BaseEmbedEEAMapBlockSerializationTransformer,
    EmbedMapsSerializationTransformer as BaseEmbedMapsSerializationTransformer,
)
from eea.api.dataconnector.browser.blocks import getMetadata, getLinkHTML


def getLink(path):
    """
    Get link
    """

    URL = urlparse(path)

    if URL.netloc.startswith("localhost") and URL.scheme:
        return path.replace(URL.scheme + "://" + URL.netloc, "")
    # /marine doesn't exists in backend
    # therefore api.content.get(path=/marine/something) -> None
    if URL.path.startswith("/marine"):
        return path.replace("/marine", "", 1)
    return path


def getUid(context, link, retry=True):
    """
    Get the UID corresponding to a given link.

    Parameters:
    - context: The context or object providing the link.
    - link (str): The link for which to retrieve the UID.
    - retry (bool, optional): If True, attempt to resolve the UID
      even if the initial attempt fails. Defaults to True.

    Returns:
    - str or None: The UID corresponding to the provided link,
      or None if the link is empty or cannot be resolved.

    If the link is empty, the function returns the link itself.
    If the link cannot be resolved in the initial attempt and retry
    is True, the function retries resolving the link by calling itself
    with retry set to False.

    The function uses the RESOLVEUID_RE regular expression to match
    and extract the UID from the link.
    """

    if not link:
        return link
    match = RESOLVEUID_RE.match(link)
    if match is None:
        if not retry:
            return link
        # Alin Voinea a zis sa las asa
        return getUid(
            context, path2uid(context=context, link=getLink(link)), False
        )

    uid, _ = match.groups()
    return uid


def getUrlUid(self, value, field):
    """
    Get URL and UID based on the provided value and field.

    :param value: The input value.
    :param field: The field to extract the URL from in the value.

    :return: A tuple containing the URL and UID.
    """

    url = value.get(field)
    uid = getUid(self.context, url)
    url = uid_to_url(url)
    return url, uid


@implementer(IBlockFieldSerializationTransformer)
@adapter(IBlocks, IBrowserRequest)
class EmbedTableauSerializationTransformer(
    BaseEmbedTableauVisualizationSerializationTransformer
):
    """Embed tableau visualization serialization"""

    order = 9999
    block_type = "embed_tableau_visualization"

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self, value):
        tableau_vis_url, uid = getUrlUid(self, value, "tableau_vis_url")

        if "tableau_visualization" in value:
            del value["tableau_visualization"]

        if not uid:
            return value

        doc = None

        try:
            doc = api.content.get(UID=uid)
        except Unauthorized:
            return {
                **value,
                "tableau_vis_url": tableau_vis_url,
                "tableau_visualization": {
                    "error": "Apologies, it seems this "
                    + getLinkHTML(tableau_vis_url, "Dashboard")
                    + " has not been published yet."
                },
            }
        except Forbidden:
            return {
                **value,
                "tableau_vis_url": tableau_vis_url,
                "tableau_visualization": {
                    "error": "Apologies, it seems you do not have "
                    + "permissions to see this "
                    + getLinkHTML(tableau_vis_url, "Dashboard")
                    + "."
                },
            }

        doc_serializer = self._get_doc_serializer(doc)
        if doc_serializer:
            return {
                **value,
                "tableau_vis_url": tableau_vis_url,
                "tableau_visualization": {
                    **doc_serializer.get("tableau_visualization", {}),
                    **getMetadata(doc_serializer)
                },
            }
        return {
            **value,
            "tableau_vis_url": tableau_vis_url,
        }


@implementer(IBlockFieldSerializationTransformer)
@adapter(IBlocks, IBrowserRequest)
class EmbedEEAMapBlockSerializationTransformer(
    BaseEmbedEEAMapBlockSerializationTransformer
):
    """Embed eea map block serializer"""

    order = 9999
    block_type = "embed_eea_map_block"

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self, value):
        vis_url, uid = getUrlUid(self, value, "vis_url")

        if "map_visualization_data" in value:
            del value["map_visualization_data"]

        if not uid:
            return value

        doc = None

        try:
            doc = api.content.get(UID=uid)
        except Unauthorized:
            return {
                **value,
                "tableau_vis_url": vis_url,
                "map_visualization_data": {
                    "error": "Apologies, it seems this "
                    + getLinkHTML(vis_url, "Map (Simple)")
                    + " has not been published yet."
                },
            }
        except Forbidden:
            return {
                **value,
                "tableau_vis_url": vis_url,
                "map_visualization_data": {
                    "error": "Apologies, it seems you do not have "
                    + "permissions to see this "
                    + getLinkHTML(vis_url, "Map (Simple)")
                    + "."
                },
            }

        doc_serializer = self._get_doc_serializer(doc)
        if doc_serializer:
            return {
                **value,
                "vis_url": vis_url,
                "map_visualization_data": {
                    **doc_serializer.get("map_visualization_data", {}),
                    **getMetadata(doc_serializer),
                },
            }
        return {
            **value,
            "vis_url": vis_url,
        }


@implementer(IBlockFieldSerializationTransformer)
@adapter(IBlocks, IBrowserRequest)
class EmbedMapsSerializationTransformer(BaseEmbedMapsSerializationTransformer):
    """Embed maps serializer"""

    order = 9999
    block_type = "embed_maps"

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def __call__(self, value):
        url, uid = getUrlUid(self, value, "url")

        if "maps" in value:
            del value["maps"]

        if not uid:
            return value

        try:
            doc = api.content.get(UID=uid)
        except Unauthorized:
            return {
                **value,
                "maps": {
                    "error": "Apologies, it seems this "
                    + getLinkHTML(url, "Map (Interactive)")
                    + " has not been published yet."
                },
            }
        except Forbidden:
            return {
                **value,
                "maps": {
                    "error": "Apologies, it seems you do not have "
                    + "permissions to see this "
                    + getLinkHTML(url, "Map (Interactive)")
                    + "."
                },
            }

        doc_serializer = self._get_doc_serializer(doc)
        if doc_serializer:
            return {
                **value,
                "maps": {
                    **doc_serializer.get("maps", {}),
                    **getMetadata(doc_serializer),
                },
            }
        return value
