#pylint: skip-file
""" events.py """
from __future__ import absolute_import
from wise.theme.interfaces import ISlideshowCreatedEvent
from wise.theme.interfaces import ISlideshowRemovedEvent
from wise.theme.interfaces import ISlideshowWillBeCreatedEvent
from wise.theme.interfaces import ISlideshowWillBeRemovedEvent
from zope.component.interfaces import ObjectEvent
from zope.interface import implements


class SlideshowWillBeCreatedEvent(ObjectEvent):
    """SlideshowWillBeCreatedEvent"""
    implements(ISlideshowWillBeCreatedEvent)


class SlideshowCreatedEvent(ObjectEvent):
    """SlideshowCreatedEvent"""
    implements(ISlideshowCreatedEvent)


class SlideshowWillBeRemovedEvent(ObjectEvent):
    """SlideshowWillBeRemovedEvent"""
    implements(ISlideshowWillBeRemovedEvent)


class SlideshowRemovedEvent(ObjectEvent):
    """SlideshowRemovedEvent"""
    implements(ISlideshowRemovedEvent)
