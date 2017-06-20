from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from tlspu.cookiepolicy.browser.viewlets import CookiePolicyViewlet


class CookiesViewlet(CookiePolicyViewlet):
    render = ViewPageTemplateFile("pt/cookiepolicy.pt")

    def update(self):
        return super(CookiesViewlet, self).render()
