from __future__ import absolute_import
from plone.dexterity.interfaces import IDexterityContainer
from plone.indexer.decorator import indexer


@indexer(IDexterityContainer)
def has_default_page(object, **kw):
    return bool(object.getDefaultPage())
