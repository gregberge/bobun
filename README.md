# Bobun Binding [![Build Status](https://travis-ci.org/neoziro/bobun-binding.png?branch=master)](https://travis-ci.org/neoziro/bobun-binding)

Bobun Binding is binding library for Backbone, it use `set`, `get`, `on` methods and `change:*` events to bind two object. It support one-way and two-way bindings.

## Installing

### Client side

```
bower install bobun-binding
```

### Server side

```
npm install bobun-binding
```

## Usage

```javascript
Bobun.Binding(modelA).bind(modelB, 'foo');

modelA.set('foo', 'bar');

modelB.get('foo') // -> return 'bar'
```

All methods can be called directly or wrapped (as underscore).

### bind( obj, bindedObj, attributes )

`bind` provides a two-way binding.

```javascript
// simple
Bobun.Binding.bind(modelA, modelB, 'attr');
Bobun.Binding.bind(modelA, modelB, {'attr': 'distAttr'});
Bobun.Binding.bind(modelA, modelB, ['attr', 'secondAttr']);

// wrapped
Bobun.Binding(modelA).bind(modelB, 'attr');
...
```

### bindTo( obj, bindedObj, attributes )

`bindTo` provides a one-way binding.

```javascript
// simple
Bobun.Binding.bindTo(modelA, modelB, 'attr');
Bobun.Binding.bindTo(modelA, modelB, {'attr': 'distAttr'});
Bobun.Binding.bindTo(modelA, modelB, ['attr', 'secondAttr']);

// wrapped
Bobun.Binding(modelA).bindTo(modelB, 'attr');
...
```