# Bobun Binding [![Build Status](https://travis-ci.org/neoziro/bobun-binding.png?branch=master)](https://travis-ci.org/neoziro/bobun-binding)

Bobun is a UI oriented Backbone library. It supports one-way and two-way bindings and sub-views.

## Installing

### Client side

```
bower install bobun
```

### Server side

```
npm install bobun
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
Bobun.Binding.bind(modelA, modelB, 'symetricAttribute');
Bobun.Binding.bind(modelA, modelB, ['fistSymetricAttribute', 'secondSymetricAttribute']);
Bobun.Binding.bind(modelA, modelB, {'modelAAttribute': 'modelBAttribute'});

// wrapped
Bobun.Binding(modelA).bind(modelB, 'symetricAttribute');
...
```

### bindTo( obj, bindedObj, attributes )

`bindTo` provides a one-way binding.

```javascript
// simple
Bobun.Binding.bindTo(modelA, modelB, 'symetricAttribute');
Bobun.Binding.bindTo(modelA, modelB, ['fistSymetricAttribute', 'secondSymetricAttribute']);
Bobun.Binding.bindTo(modelA, modelB, {'modelAAttribute': 'modelBAttribute'});

// wrapped
Bobun.Binding(modelA).bindTo(modelB, 'symetricAttribute');
...
```

## License

Copyright (c) 2013 Bergé Greg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
