from plone.api import content, portal
from Products.Five.browser import BrowserView


class FrontpageSlidesView (BrowserView):
    """ BrowserView for the frontpage slides which will be loaded through diazo
    """

    def __call__(self):
        site = portal.get()
        sf = site.unrestrictedTraverse('marine/frontpage-slides')
        self.images = [o for o in sf.contentValues()
                       if content.get_state(o) == 'published']

        return self.index()

    def getDescription(self, image):
        return image.long_description.output

    def getTitle(self, image):
        return image.title

    def getImageUrl(self, image):
        return image.absolute_url()
