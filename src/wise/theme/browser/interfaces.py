from zope.interface import Interface
from zope import schema
# from zope.i18nmessageid import MessageFactory

#_ = MessageFactory('collective.easyslideshow')

class IEasySlideshowBrowserLayer(Interface):
    """ Browser layer marker interface
    """

class IEasySlideshowView(Interface):
    """ View class for the Slideshow
    """

    def getImages(slideshowfolderid):
        """ Get the images for the slideshow based of the given ID
        """

    def getPortletImages(slideshowfolderuid):
        """ Get the images for the slideshow based of the given UID
        """

    # def getSlideshowLocalProperties(self):
    #     """ Returns the locally defined properties for the slideshow """
    #
    # def setSlideshowLocalProperties(self):
    #     """ Saves the locally defined properties for a Slideshow """
    #
    # def getSlideshowGeneralProperties(self):
    #     """ Returns the slideshow properties defined site-wide """
    #
    # def getSlideshowAllProperties(self):
    #     """ Returns the local property if there is one,
    #     general property if not """
