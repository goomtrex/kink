# Kink

A tiny library for experimenting with CPS-based functional streams.

The underlying currency of `kink` is the "channel" or "procedure", which does *something* with its arguments and returns void:

```js
function (/* ... */) {
	// ...
}
```

Most of the work in `kink` is handled by the "conduit" or "procedure transformer":

```js
function (output) {
	return function input (/* ... */) {
		output.apply (this, arguments)
	}
}
```

These conduits are composed from the inside out, starting with `kink.end` (a procedure that does nothing):

```js
kink.map.each (func) (kink.log (kink.end))
```

This can be simplified using left-to-right function composition via `kink.join`:

```js
kink.join (kink.map.each (func), kink.log) (kink.end)
```

The function `kink` itself combines composition and `kink.end`:

```js
kink (kink.map.each (func), kink.log)
```

In any case, what results from the above composition is a procedure that can be used as a callback:

```js
jQuery (document).on ('keypress', kink (kink.get ('key'), kink.log))

```

Here are a few more examples, using the following prelude (open kink.html to try it out...):

```js
key = jQuery.fn.on.bind (jQuery (document), 'keypress')
kinky = function (/* ... */) {
	return key (kink.apply (null, arguments))
}
```

Logging keypress events:

```js
kinky(
	kink.log
)
```

Logging the `key` property:

```js
kinky(
	kink.get('key'),
	kink.log
)
```

Logging numerical keys:

```js
kinky(
	kink.get ('key'),
	kink.scan.each (/\b[0-9]+\b/),
	kink.log
)
```

Logging numerical values:

```js
kinky(
	kink.get ('key'),
	kink.scan.each (/\b[0-9]+\b/),
	kink.parseIntegers,
	kink.log
)
```

Logging numerical values * 100:

```js
kinky(
	kink.get ('key'),
	kink.scan.each (/\b[0-9]+\b/),
	kink.parseIntegers,
	kink.map.each (function (n) { return n * 100 }),
	kink.log
)
```

Logging the 5-value moving average of numerical values * 100:

```js
kinky(
	kink.get ('key'),
	kink.scan.each (/\b[0-9]+\b/),
	kink.parseIntegers,
	kink.map.each (function (n) { return n * 100 }),
	kink.avg (5),
	kink.log
)
```

Logging the `key` property in gestures separated by > 200ms:

```js
kinky(
	kink.get ('key'),
	kink.win (200),
	kink.bundle,
	kink.log
)
```
