(function () {
  'use strict';

  var root = this,
  Bobun = {}, _,
  formatAttributes;

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
    root.Bobun.Binding = Bobun.Binding;
  }

  _ = root._;
  if (!_ && (typeof require !== 'undefined')) {
    _ = require('underscore');
  }

  formatAttributes = function (attributes) {
    attributes = typeof attributes === 'string' ? [attributes] : attributes;
    return _.isArray(attributes) ? _.object(attributes, attributes) : attributes;
  };


  Bobun.Binding.bindTo = function (obj, bindedObj, attributes) {
    if (! obj || ! bindedObj || ! attributes) {
      return ;
    }

    attributes = formatAttributes(attributes);

    _.each(attributes, function (bindKey, key) {
      obj.on('change:' + key, function (obj, value) {
        bindedObj.set(bindKey, value);
      });
    });
  };

  Bobun.Binding.bind = function (obj, bindedObj, attributes) {
    attributes = formatAttributes(attributes);

    Bobun.Binding.bindTo(obj, bindedObj, attributes);
    Bobun.Binding.bindTo(bindedObj, obj, _.invert(attributes));
  };

  _.each(['bindTo', 'bind'], function (method) {
    Bobun.Binding.prototype[method] = function () {
      return Bobun.Binding[method].apply(this._wrapped, [this._wrapped].concat(_.toArray(arguments)));
    };
  });

}).call(this);