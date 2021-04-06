# -*- coding: utf-8 -*-

""" Module where all interfaces, events and exceptions live."""

from plone.app.textfield import RichText
from plone.autoform.interfaces import IFormFieldProvider
from plone.supermodel import model
from zope.interface import Interface, provider
from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from zope.schema import (URI, Bool, Choice, Date, Datetime, Int, List, Text,
                         TextLine, Tuple)


class IWiseThemeLayer(IDefaultBrowserLayer):
    """Marker interface that defines a browser layer."""


class IHomepage(Interface):
    """Marker interface for the context object that is the homepage"""


class ICountriesFactsheetDatabase(Interface):
    """Marker interface for the context object that is the homepage"""


class IFullWidthLayout(Interface):
    """Marker interface"""


@provider(IFormFieldProvider)
class IExternalLinks(model.Schema):
    """External links interface with RichText schema"""

    external_links = RichText(title=u"External Links", description=u"", required=False)


@provider(IFormFieldProvider)
class IReferenceLinks(model.Schema):
    """Reference links interface with RichText schema"""

    reference_links = RichText(
        title=u"Reference Links", description=u"", required=False
    )


@provider(IFormFieldProvider)
class IDisclaimer(model.Schema):
    """Disclaimer interface with RichText schema"""

    disclaimer = RichText(title=u"Disclaimer", description=u"", required=False)


@provider(IFormFieldProvider)
class ICatalogueMetadata(model.Schema):
    """Wise catalogue metadata

    Title   text    y
    Short description   Text    y
    Organisation name   from a list y
    Organization acronym    from the list   y
    Organization Logo   image (to be provided by Silvia)    y
    Organisation webpage    From the list   y
    Thumbnail   image   n   usefull for cards setting
    Type (DPSR) from the list   n
    Theme   from the list   n
    Subtheme    from the list   n
    keywords    text    n
    Date of Publication date (at least year)    y
    Last modified in WISE Marine    automatic from plone
    Link        y   the link can be internal or external links (more external, including EEA
    website and SDI catalogue
    """

    organisation = Choice(
        title=u"Organisation", required=True, vocabulary="wise_organisations_vocabulary"
    )

    dpsir_type = Choice(
        title=u"DPSIR", required=False, vocabulary="wise_dpsir_vocabulary"
    )

    theme = Choice(title=u"Theme", required=False, vocabulary="wise_theme_vocabulary")

    subtheme = Choice(
        title=u"Subtheme", required=False, vocabulary="wise_subthemes_vocabulary"
    )

    publication_year = Int(title=u"Publication year", required=True)
