(function () {
  'use strict';

  var root = this,
  Bobun = {}, _,
  formatProperties;

  Bobun.Binding = function (obj) {
    if (obj instanceof Bobun.Binding) {
      return obj;
    }

    if (!(this instanceof Bobun.Binding)) {
      return new Bobun.Binding(obj);
    }

    this._wrapped = obj;
  };

  if (typeof exports !== 'undefined') {
    module.exports = exports = Bobun.Binding;
  } else {
    root.Bobun = root.Bobun || {};
    Bobun.Binding = root.Bobun.Binding = {};
  }

  _ = root._;
  if (!_ && (typeof require !== 'undefined')) {
    _ = require('underscore');
  }

  formatProperties = function (properties) {
    properties = typeof properties === 'string' ? [properties] : properties;
    return _.isArray(properties) ? _.object(properties, properties) : properties;
  };


  Bobun.Binding.bindTo = function (obj, bindObj, properties) {
    if (! obj || ! bindObj || ! properties) {
      return ;
    }

    properties = formatProperties(properties);

    _.each(properties, function (bindKey, key) {
      obj.on('change:' + key, function (obj, value) {
        bindObj.set(bindKey, value);
      });
    });
  };

  Bobun.Binding.bind = function (obj, bindObj, properties) {
    properties = formatProperties(properties);

    Bobun.Binding.bindTo(obj, bindObj, properties);
    Bobun.Binding.bindTo(bindObj, obj, _.invert(properties));
  };

  _.each(['bindTo', 'bind'], function (method) {
    Bobun.Binding.prototype[method] = function () {
      return Bobun.Binding[method].apply(this._wrapped, [this._wrapped].concat(_.toArray(arguments)));
    };
  });

}).call(this);

/*
Bobun.Binding(this).bind('foo', view, 'bar');

bind: function ('') {
  Bobun.Binding(this.model).bind('foo', view, 'bar');
  return this;
}

_.extend(view.prototype, Bobun.Binding);

Bobun.Binding.bind(this.el, 'foo', view, 'bar');
Bobun.Binding(this.model).bind('foo', view, 'bar');
*/