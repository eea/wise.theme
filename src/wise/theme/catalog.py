from plone.dexterity.interfaces import IDexterityContainer
from plone.indexer.decorator import indexer


@indexer(IDexterityContainer)
def has_default_page(object, **kw):
    return bool(object.getDefaultPage())
