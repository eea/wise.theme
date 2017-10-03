from plone.api import portal
from Products.Five.browser import BrowserView


class FrontpageSlidesView (BrowserView):
    """ BrowserView for the frontpage slides which will be loaded through diazo
    """

    def __call__(self):
        site = portal.get()
        slides_folder = site.unrestrictedTraverse('marine/frontpage-slides')
        self.images = slides_folder.listFolderContents(
            contentFilter={'review_state': 'published'}
        )

        return self.index()

    def getDescription(self, image):
        return image.long_description.output

    def getTitle(self, image):
        return image.title

    def getImageUrl(self, image):
        return image.absolute_url()
