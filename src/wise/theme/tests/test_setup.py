# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from plone import api
from wise.theme.testing import WISE_THEME_INTEGRATION_TESTING  # noqa

import unittest


class TestSetup(unittest.TestCase):
    """Test that wise.theme is properly installed."""

    layer = WISE_THEME_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if wise.theme is installed."""
        self.assertTrue(self.installer.isProductInstalled(
            'wise.theme'))

    def test_browserlayer(self):
        """Test that IWiseThemeLayer is registered."""
        from wise.theme.interfaces import (
            IWiseThemeLayer)
        from plone.browserlayer import utils
        self.assertIn(IWiseThemeLayer, utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = WISE_THEME_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.installer.uninstallProducts(['wise.theme'])

    def test_product_uninstalled(self):
        """Test if wise.theme is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled(
            'wise.theme'))

    def test_browserlayer_removed(self):
        """Test that IWiseThemeLayer is removed."""
        from wise.theme.interfaces import \
            IWiseThemeLayer
        from plone.browserlayer import utils
        self.assertNotIn(IWiseThemeLayer, utils.registered_layers())
