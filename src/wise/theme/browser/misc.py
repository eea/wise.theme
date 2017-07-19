from Products.Five.browser import BrowserView
from plone import api


class FrontpageSlidesView (BrowserView):
    """ BrowserView for the frontpage slides which will be loaded through diazo
    """

    def __call__(self):
        context = self.context
        self.images = context.unrestrictedTraverse(
            'frontpage-slides').listFolderContents()
        return self.index()

    def getDescription(self, image):
        return image.html2text(image.description.output)

    def getTitle(self, image):
        return image.title

    def getImageUrl(self, image):
        return image.absolute_url()
