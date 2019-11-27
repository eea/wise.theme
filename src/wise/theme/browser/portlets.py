import logging

from ZODB.POSException import ConflictError
from zope.component import adapter, getMultiAdapter  # , getUtilitiesFor
from zope.interface import Interface, implementer
from zope.publisher.interfaces.browser import IBrowserRequest, IBrowserView

from plone.memoize.view import memoize
from plone.portlets.interfaces import (IPortletManager,
                                       IPortletManagerRenderer,
                                       IPortletRetriever)
from plone.portlets.manager import \
    PortletManagerRenderer as BasePortletManagerRenderer
from plone.portlets.utils import hashPortletInfo
from wise.theme.interfaces import IWiseThemeLayer

logger = logging.getLogger('wise.theme')


@implementer(IPortletManagerRenderer)
@adapter(Interface, IWiseThemeLayer, IBrowserView, IPortletManager)
class PortletManagerRenderer(BasePortletManagerRenderer):
    """ Override default portlet renderer, we want Navigation portlet first
    """

    @memoize
    def _lazyLoadPortlets(self, manager):
        retriever = getMultiAdapter((self.context, manager), IPortletRetriever)
        items = []

        portlets = retriever.getPortlets()
        portlets = [p for p in portlets if p['name'] == 'navigation'] + \
            [p for p in portlets if p['name'] != 'navigation']

        for p in self.filter(portlets):
            renderer = self._dataToPortlet(p['assignment'].data)
            info = p.copy()
            info['manager'] = self.manager.__name__
            info['renderer'] = renderer
            hashPortletInfo(info)
            # Record metadata on the renderer
            renderer.__portlet_metadata__ = info.copy()
            del renderer.__portlet_metadata__['renderer']
            try:
                isAvailable = renderer.available
            except ConflictError:
                raise
            except Exception as e:
                isAvailable = False
                logger.exception(
                    "Error while determining renderer availability of portlet "
                    "(%r %r %r): %s"
                    % (p['category'], p['key'], p['name'], str(e))
                )

            info['available'] = isAvailable
            items.append(info)

        return items
