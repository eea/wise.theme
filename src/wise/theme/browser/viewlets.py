from plone.api import content, portal
from plone.app.layout.viewlets import ViewletBase
from plone.namedfile.file import NamedBlobImage
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

# from plone.app.layout.navigation.interfaces import INavigationRoot


class SlidesViewlet(ViewletBase):

    render = ViewPageTemplateFile("pt/slideshow.pt")

    def images(self):
        site = portal.get()
        base = '/'.join(site.getPhysicalPath())

        path = {'query': base + '/homepage-slide-images', 'depth': 1}
        results = content.find(
            path=path, portal_type='Image', sort_on='getObjPositionInParent')

        return results


class RotatingBannersViewlet(ViewletBase):
    """ BrowserView for frontpage rotating banners
    """

    def banners(self):
        site = portal.get()
        base = '/'.join(site.getPhysicalPath())

        path = {'query': base + '/rotating-banners', 'depth': 1}
        results = content.find(
            path=path, portal_type='frontpage-banner', state='published')

        return results


class FrontpageReportsViewlet(ViewletBase):
    """ BrowserView for frontpage rotating banners
    """

    def reports(self):
        results = content.find(
            portal_type='external_report', state='published',
            sort_on="EffectiveDate", sort_order="descending"
        )[:2]

        return [b.getObject() for b in results]


class LeadImage(ViewletBase):
    def lead_image(self):
        """Return lead image information
        """
        image = getattr(self.context, 'image', None)

        if image is None:
            return None

        if not isinstance(image, NamedBlobImage):
            return None

        url = '{0}/@@download/image/{1}'.format(
            self.context.absolute_url(), image.filename)
        caption = getattr(self.context, 'image_caption', None)

        return dict(url=url, caption=caption)


# from AccessControl import Unauthorized
# from plone import api
# from plone.app.layout.viewlets.common import GlobalSectionsViewlet
# from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
# from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet
#
#
# class CookiesViewlet(CookiePolicyViewlet):
#     render = ViewPageTemplateFile("pt/cookiepolicy.pt")
#
#     def update(self):
#         return super(CookiesViewlet, self).render()
#
#
# class NavigationViewlet(GlobalSectionsViewlet):
#     """ Navigation menu viewlet override
#     """
#     index = ViewPageTemplateFile('pt/sections.pt')
#
#     def tabs(self):
#         root = api.portal.get_navigation_root(context=self.context)
#         contentish = ['Folder', 'Collection', 'Topic']
#         # tabs = [{
#         #     'url': root.absolute_url(),
#         #     'id': root.id,
#         #     'name': 'Home',
#         #     'image': '',
#         #     'subtabs': []}]
#         tabs = []
#
#         brains = root.getFolderContents(
#             contentFilter={
#                 'portal_type': contentish
#
#             })
#
#         brains = [b for b in brains if b.exclude_from_nav is False]
#
#         for brain in brains:
#             obj = brain.getObject()
#             children = []
#
#             types = ['collective.cover.content', 'Document',
#                      'News Item', 'Event', 'Folder']
#             folder_contents = obj.getFolderContents(
#                 contentFilter={
#                     'portal_type': types
#                 })
#
#             for child in folder_contents:
#                 if child.exclude_from_nav:
#                     continue
#                 try:
#                     child = child.getObject()
#                 except Unauthorized:
#                     continue
#                 children.append({
#                     'url': child.absolute_url(),
#                     'description': '',
#                     'name': child.title,
#                     'id': child.id})
#
#             image = self.get_image(obj)
#             tab = {
#                 'url': obj.absolute_url(),
#                 'description': '',
#                 'name': obj.title,
#                 'id': obj.id,
#                 'image': image,
#                 'subtabs': children
#             }
#             tabs.append(tab)
#
#         return tabs
#
#     def get_image(self, obj):
#         if not hasattr(obj, 'image') or obj.image is None:
#             return ''
#
#         scales = obj.restrictedTraverse('@@images')
#         image = scales.scale('image', scale='menu-icon')
#
#         return image and image.absolute_url() or ''
