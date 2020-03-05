# from plone.api import content, portal
from zope.component import getUtilitiesFor
from zope.schema.interfaces import IVocabularyFactory

from Products.Five.browser import BrowserView


class GoPDB(BrowserView):
    def __call__(self):

        import pdb
        pdb.set_trace()

        return 'ok'


class VocabularyInspector(BrowserView):
    blacklist = [
        'plone.app.vocabularies.Users',
        'plone.app.multilingual.RootCatalog',
        'plone.app.vocabularies.Principals',
        'plone.app.vocabularies.Catalog',
    ]

    def vocabs(self):
        vocabs = getUtilitiesFor(IVocabularyFactory)

        vocabs = [xv for xv in vocabs if xv[0] not in self.blacklist]

        return vocabs
