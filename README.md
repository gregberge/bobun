# Bobun [![Build Status](https://travis-ci.org/neoziro/bobun.png?branch=master)](https://travis-ci.org/neoziro/bobun)

# This plugin is no longer actively maintained, you can still use it but issues will not be resolved. If you want the npm name, you can contact me by email.

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

## Bobun.View

### append ( view )

Add a view to sub-views, render it, append it to `$el` and call `delegateEvents`.

```javascript
mainView.append(subView);
```

### domEventTriggerProxy ( event )

Provides a way to bind a dom event to a view event.

```javascript
Bobun.View.extend({
  events: {
    'click': 'domEventTriggerProxy'
  }
});
```

### set, get, validate

Similary to models with `attributes`, Bobun.View exposes `options` using `set`, `get` and `validate`.

```javascript
var List = Bobun.View.extend({
  options: {
    'processing': false
  },

  initialize: function () {
    this.on('change:processing', this.render);
  }

  render: function () {
    this.$el.empty();

    if (this.get('processing'))
      this.$el.append('<i class="icon-spinner icon-spin">');
  }
});

var list = new List();
list.set('processing', true);
});
```

### bind, bindTo

Thanks to Bobun.Binding, it's possible to bind a view to a model or an other view.

```javascript
Bobun.View.extend({
  initialize: function () {
    // bind processing attribute to processing option
    this.bind(this.model, 'processing');

    // bind processing option to disabled button option
    this.bind(this.button, {'processing': 'disabled'});
  }
});
```

It's possible to bind a model option using a shortcut.

```javascript
Bobun.View.extend({
  options: {
    'disabled': 'model.readonly' // bind disabled option to readonly model attribute
  }
});
```


## Bobun.Binding

```javascript
Bobun.Binding(modelA).bind(modelB, 'foo');

modelA.set('foo', 'bar');

modelB.get('foo') // -> return 'bar'
```

All methods can be called directly or wrapped (as underscore).

### bind( obj, bindedObj, attributes )

Provides a two-way binding.

```javascript
// simple
Bobun.Binding.bind(modelA, modelB, 'symetricAttribute');
Bobun.Binding.bind(modelA, modelB, ['firstSymetricAttribute', 'secondSymetricAttribute']);
Bobun.Binding.bind(modelA, modelB, {'modelAAttribute': 'modelBAttribute'});

// wrapped
Bobun.Binding(modelA).bind(modelB, 'symetricAttribute');
...
```

### bindTo( obj, bindedObj, attributes )

Provides a one-way binding.

```javascript
// simple
Bobun.Binding.bindTo(modelA, modelB, 'symetricAttribute');
Bobun.Binding.bindTo(modelA, modelB, ['firstSymetricAttribute', 'secondSymetricAttribute']);
Bobun.Binding.bindTo(modelA, modelB, {'modelAAttribute': 'modelBAttribute'});

// wrapped
Bobun.Binding(modelA).bindTo(modelB, 'symetricAttribute');
...
```

## License

MIT
