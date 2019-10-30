# -*- coding: utf-8 -*-

"""Module where all interfaces, events and exceptions live."""

from plone.supermodel import model
from zope.interface import Interface, provider
from plone.app.textfield import RichText
from plone.autoform.interfaces import IFormFieldProvider
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


class IWiseThemeLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IHomepage(Interface):
    """ Marker interface for the context object that is the homepage
    """

class IFullWidthLayout(Interface):
    """ Marker interface
    """

@provider(IFormFieldProvider)
class IExternalLinks(model.Schema):
    """ External links interface with RichText schema
    """

    external_links = RichText(title=u"External Links", description=u'', required=False)
