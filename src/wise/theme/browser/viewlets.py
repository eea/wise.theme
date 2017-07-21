from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet
from Products.Five.browser import BrowserView
from plone.app.layout.viewlets.common import GlobalSectionsViewlet
from zope.component import getMultiAdapter
from Acquisition import aq_inner
from plone import api


class CookiesViewlet(CookiePolicyViewlet):
    render = ViewPageTemplateFile("pt/cookiepolicy.pt")

    def update(self):
        return super(CookiesViewlet, self).render()


# class GoToPDB(BrowserView):
#     def __call__(self):
#         import pdb; pdb.set_trace()
#         return "done"


class NavigationViewlet(GlobalSectionsViewlet):
    """ Navigation menu viewlet override
    """
    index = ViewPageTemplateFile('pt/sections.pt')

    def tabs(self):
        site = api.portal.getSite()
        contentish = ['Folder', 'Collection', 'Topic']
        tabs = [{
            'url': site.absolute_url(),
            'id': site.id,
            'name': 'Home',
            'subtabs': []}]

        brains = site.getFolderContents(
            contentFilter={
                'portal_type': contentish
            })

        for brain in brains:
            obj = brain.getObject()
            children = []

            types = ['collective.cover.content', 'Document',
                     'News Item', 'Event', 'Folder']
            folder_contents = obj.getFolderContents(
                contentFilter={
                    'portal_type': types
                })

            for child in folder_contents:
                child = child.getObject()
                children.append({
                    'url': child.absolute_url(),
                    'description': '',
                    'name': child.title,
                    'id': child.id})
            tab = {
                'url': obj.absolute_url(),
                'description': '',
                'name': obj.title,
                'id': obj.id,
                'subtabs': children
            }
            tabs.append(tab)
        return tabs
