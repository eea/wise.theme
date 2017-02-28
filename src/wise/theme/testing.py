# -*- coding: utf-8 -*-
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import wise.theme


class WiseThemeLayer(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        self.loadZCML(package=wise.theme)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'wise.theme:default')


WISE_THEME_FIXTURE = WiseThemeLayer()


WISE_THEME_INTEGRATION_TESTING = IntegrationTesting(
    bases=(WISE_THEME_FIXTURE,),
    name='WiseThemeLayer:IntegrationTesting'
)


WISE_THEME_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(WISE_THEME_FIXTURE,),
    name='WiseThemeLayer:FunctionalTesting'
)
