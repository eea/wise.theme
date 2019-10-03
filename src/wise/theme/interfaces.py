# -*- coding: utf-8 -*-
"""Module where all interfaces, events and exceptions live."""

from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from zope.interface import Interface


class IWiseThemeLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class ISlideshowFolder(Interface):
    """Content type interface for slideshows
    """

class ISlideshowWillBeCreatedEvent(Interface):
    """An event that is fired before a child site is created
    """

class ISlideshowCreatedEvent(Interface):
    """An event that is fired after a child site is created
    """

class ISlideshowWillBeRemovedEvent(Interface):
    """An event that is fired before the child site is removed
    """

class ISlideshowRemovedEvent(Interface):
    """An event that is fired after a child site is removed
    """
