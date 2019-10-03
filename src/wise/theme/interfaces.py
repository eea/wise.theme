# -*- coding: utf-8 -*-

"""Module where all interfaces, events and exceptions live."""

from zope.interface import Interface
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IWiseThemeLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IHomepage(Interface):
    """ Marker interface for the context object that is the homepage
    """
