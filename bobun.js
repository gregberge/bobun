(function () {
  'use strict';


  // Establish the root object, `window` in the browser, or `gobal` on the server.
  var root = this;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both the browser and the server.
  var Bobun;
  if (typeof exports !== 'undefined') {
    Bobun = exports;
  } else {
    Bobun = root.Bobun = {};
  }

  // Current version of the library. Keep in sync with `package.json`
  Bobun.VERSION = '0.4.0';

  // Require Underscore, if we're on the server, and it's not already present
  var _ = root._;
  if (! _ && (typeof require !== 'undefined')) _ = require('underscore');

  // Require Backbone, if we're on the server, and it's not already present
  var Backbone = root.Backbone;
  if (! Backbone && (typeof require !== 'undefined')) Backbone = require('backbone');

  // Require backbone.babysitter, if we're on the server, and it's not already present
  Backbone.ChildViewContainer = root.Backbone ? root.Backbone.ChildViewContainer : void 0;
  if (! Backbone.ChildViewContainer && (typeof require !== 'undefined'))
    Backbone.ChildViewContainer = require('backbone.babysitter');



  // Bobun.Binding
  // -------------

  // A module that uses `set`, `get`, `on` methods and `change:*` events to bind two objects.
  // It support one-way and two-way bindings.
  Bobun.Binding = function (obj) {
    if (obj instanceof Bobun.Binding) return obj;
    if (!(this instanceof Bobun.Binding)) return new Bobun.Binding(obj);
    this._wrapped = obj;
  };

  // A method to format attributes to a valid object.
  //
  //    {'objAttribute': 'bindedObjAttribute'}
  //
  var formatAttributes = function (attributes) {
    attributes = typeof attributes === 'string' ? [attributes] : attributes;
    return _.isArray(attributes) ? _.object(attributes, attributes) : attributes;
  };

  // Provide a one-way binding from `obj` to `bindedObj` on a single symetric attribute,
  // an array of symetric attributes, or an hash of asynmetric attributes
  Bobun.Binding.bindTo = function (obj, bindedObj, attributes) {
    if (! obj || ! bindedObj || ! attributes) return ;

    attributes = formatAttributes(attributes);

    _.each(attributes, function (bindKey, key) {
      obj.on('change:' + key, function (obj, value) {
        bindedObj.set(bindKey, value);
      });
    });

    return obj;
  };

  // Provide a two-way binding from `obj` to `bindedObj` on a single symetric attribute,
  // an array of symetric attributes, or an hash of asynmetric attributes
  Bobun.Binding.bind = function (obj, bindedObj, attributes) {
    attributes = formatAttributes(attributes);

    Bobun.Binding.bindTo(obj, bindedObj, attributes);
    Bobun.Binding.bindTo(bindedObj, obj, _.invert(attributes));

    return obj;
  };

  // Expose function on the prototype to call the wrapped object
  _.each(['bindTo', 'bind'], function (method) {
    Bobun.Binding.prototype[method] = function () {
      return Bobun.Binding[method].apply(this._wrapped, [this._wrapped].concat(_.toArray(arguments)));
    };
  });


  // Bobun.View
  // -------------


  // A module which add an event couch with `options`, a sub-views support
  // and binding functions
  Bobun.View = Backbone.View.extend({

    // A template assigned to the view
    template: null,

    // Override `Backbone.View_configure` method, who initialize sub-views
    // and model binding
    _configure: function () {
      Backbone.View.prototype._configure.apply(this, arguments);

      this.views = new Backbone.ChildViewContainer(this.options.views || []);

      this.on('change:views', function () {
        this.views = new Backbone.ChildViewContainer(this.options.views || []);
        this.render();
      });

      _.each(this.options, function (value, option) {
        this._bindModelOption(option);
      }, this);
    },

    // A private function used to bind a model property to an option
    // using a syntax `model.attribute`
    _bindModelOption: function (option, model) {
      var optionValue, optionMatches, attributes;

      model = model || this.model;
      optionValue = this.options[option];

      if (! model || ! option || typeof optionValue !== 'string') return ;

      optionMatches = optionValue.match(/model\.(.*)/);

      if (! optionMatches) return ;

      attributes = {};
      attributes[option] = optionMatches[1];

      this.bind(model, attributes);
      this.set(option, model.get(optionMatches[1]), {silent: true});
    },

    // An utility function which render and append a view to the view `el`,
    // or a child element of `el` if $el provided.
    append: function (view, $el) {
      this.views.add(view);
      $el = $el || this.$el;
      $el = _.isString($el) ? this.$el.find($el) : Backbone.$($el);
      $el.append(view.render().el);
      view.delegateEvents();
      return this;
    },


    // An utility function which assign a view to a child DOM element.
    assign: function (el, view) {
      this.views.add(view);
      view.setElement(this.$(el)).render();
      return this;
    },

    // A function to serialized the collection and the model assigned to the view.
    // Used to render the template.
    toJSON: function () {
      return {
        collection: this.collection ? this.collection.toJSON() : null,
        model: this.model ? this.model.toJSON() : null
      };
    },

    // Override the render function to render using the template if present.
    render: function () {
      if (this.template)
        this.$el.html(this.template(this.toJSON()));
      return this;
    },

    // An utility function to proxy a DOM event to a view event
    domEventTriggerProxy: function (event) {
      this.trigger('$' + event.type, event, this);
    },

    // Override `Backbone.View.remove` method to remove sub-views
    remove: function () {
      Backbone.View.prototype.remove.apply(this, arguments);
      return this.clearViews();
    },

    // Clear subviews
    clearViews: function () {
      this.views.each(_.bind(function (view) {
        this.views.remove(view.remove());
      }, this));
      return this;
    },

    // Override `Backbone.View.remove` method to stop listening the sub-views
    stopListening: function () {
      Backbone.View.prototype.stopListening.apply(this, arguments);
      this.views.invoke.apply(this.views, ['stopListening'].concat(_.toArray(arguments)));
    }
  });

  // Use `Backbone.Model` method to handle options manipulation
  _.each(['set', 'get', '_validate', 'previous'], function (method) {
    Bobun.View.prototype[method] = function () {
      var attributes = this.attributes, result;
      this.attributes = this.options;
      result = Backbone.Model.prototype[method].apply(this, arguments);
      this.attributes = attributes;
      return result;
    };
  });

  // `Bobun.Binding` methods that we want to implement on the view
  _.each(['bindTo', 'bind'], function (method) {
    Bobun.View.prototype[method] = function () {
      return Bobun.Binding[method].apply(this, [this].concat(_.toArray(arguments)));
    };
  });

}).call(this);
