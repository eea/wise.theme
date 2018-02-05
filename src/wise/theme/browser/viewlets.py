from plone import api
from plone.app.layout.viewlets.common import GlobalSectionsViewlet
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet


class CookiesViewlet(CookiePolicyViewlet):
    render = ViewPageTemplateFile("pt/cookiepolicy.pt")

    def update(self):
        return super(CookiesViewlet, self).render()


class NavigationViewlet(GlobalSectionsViewlet):
    """ Navigation menu viewlet override
    """
    index = ViewPageTemplateFile('pt/sections.pt')

    def tabs(self):
        root = api.portal.get_navigation_root(context=self.context)
        contentish = ['Folder', 'Collection', 'Topic']
        # tabs = [{
        #     'url': root.absolute_url(),
        #     'id': root.id,
        #     'name': 'Home',
        #     'image': '',
        #     'subtabs': []}]
        tabs = []

        brains = root.getFolderContents(
            contentFilter={
                'portal_type': contentish

            })

        brains = [b for b in brains if b.exclude_from_nav is False]

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
                if child.exclude_from_nav:
                    continue
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
        image = scales.scale('image', scale='menu-icon')

        return image and image.absolute_url() or ''
