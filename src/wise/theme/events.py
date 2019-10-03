from wise.theme.interfaces import ISlideshowCreatedEvent
from wise.theme.interfaces import ISlideshowRemovedEvent
from wise.theme.interfaces import ISlideshowWillBeCreatedEvent
from wise.theme.interfaces import ISlideshowWillBeRemovedEvent
from zope.component.interfaces import ObjectEvent
from zope.interface import implements


class SlideshowWillBeCreatedEvent(ObjectEvent):
    implements(ISlideshowWillBeCreatedEvent)


class SlideshowCreatedEvent(ObjectEvent):
    implements(ISlideshowCreatedEvent)


class SlideshowWillBeRemovedEvent(ObjectEvent):
    implements(ISlideshowWillBeRemovedEvent)


class SlideshowRemovedEvent(ObjectEvent):
    implements(ISlideshowRemovedEvent)
