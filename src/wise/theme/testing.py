# -*- coding: utf-8 -*-
from __future__ import absolute_import
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import wise.theme


class WiseThemeLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

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


WISE_THEME_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        WISE_THEME_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE
    ),
    name='WiseThemeLayer:AcceptanceTesting'
)
