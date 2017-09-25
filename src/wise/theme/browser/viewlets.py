from plone import api
from plone.app.layout.navigation.interfaces import INavigationRoot
from plone.app.layout.viewlets.common import GlobalSectionsViewlet
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet


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
        # site = api.portal.getSite()
        root = api.portal.get_navigation_root(context=self.context)
        contentish = ['Folder', 'Collection', 'Topic']
        tabs = [{
            'url': root.absolute_url(),
            'id': root.id,
            'name': 'Home',
            'image': '',
            'subtabs': []}]

        brains = root.getFolderContents(
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

            image = self.get_image(obj)
            tab = {
                'url': obj.absolute_url(),
                'description': '',
                'name': obj.title,
                'id': obj.id,
                'image': image,
                'subtabs': children
            }
            tabs.append(tab)

        return tabs

    def get_image(self, obj):
        if not hasattr(obj, 'image') or obj.image is None:
            return ''

        scales = obj.restrictedTraverse('@@images')
        image_url = scales.scale('image', scale='menu-icon')

        return image_url.absolute_url()
