from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet
from Products.Five.browser import BrowserView


class CookiesViewlet(CookiePolicyViewlet):
    render = ViewPageTemplateFile("pt/cookiepolicy.pt")

    def update(self):
        return super(CookiesViewlet, self).render()


# class GoToPDB(BrowserView):
#     def __call__(self):
#         import pdb; pdb.set_trace()
#         return "done"
