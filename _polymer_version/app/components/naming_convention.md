# Components naming

How components shoud be named (and understood when named) is based on their first name part before dash:

**basic** - non-UI modules, or other entities, such as behaviors

**block** - minor UI component such as tag or user avatar

**card** - content module, represented as material design's "card" metaphor, such as message

**page** - a complete page of an app, in other words - app's "mode". I.e. basic messaging, settings, etc

**text** - inline element component, i.e. used for translation

**unit** - self-succicient content module, i.e. topic, messages, tags or users

**ui** - reusable ui element, non-specific to the project

to be deleted or renamed:

* tinng

* header

# Functions naming

Previously, parent (behavior) functions had prefixes. This is completely wrong!
Descendant's functions that are wrappers for behavior's function should have prefix.

So now: `parseUpdates` is behavior's method name and `topics_parseUpdates` is it's wrapper in unit-topics node.

This way, descendant can use a method of parent and it's own method. Parent can't use a descendant's method, since it doesn't 
know, how the descendant's method will be called, which is completely right - use of descendant's methods in parents can
cause confusion and affects hierarchy of code. Instead of it, descendant should use simple wrapper of parent's method.

**Underscore** is used to separate descendants from usual methods