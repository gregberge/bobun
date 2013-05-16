/*jshint undef:false, expr:true, strict:false */
var expect = require('chai').expect,
sinon = require('sinon'),
Backbone = require('backbone'),
Bobun = require('../bobun');

Backbone.$ = require('jquery');

describe('Bobun.View', function () {
  var bobunView;

  beforeEach(function () {
    bobunView = new Bobun.View();
  });

  describe('#views', function () {
    var myView;

    beforeEach(function () {
      myView = new Backbone.View();
      bobunView.views.add(myView, 'myView');
    });

    it('should invoke stopListening on all sub-views', function () {
      myView.stopListening = sinon.spy(myView, 'stopListening');

      bobunView.stopListening();

      expect(myView.stopListening.called).to.be.true;
    });

    it('should invoke remove on all sub-views', function () {
      myView.remove = sinon.spy(myView, 'remove');

      bobunView.remove();

      expect(myView.remove.called).to.be.true;
    });
  });

  describe('#append', function () {
    var myView;

    beforeEach(function () {
      myView = new (Backbone.View.extend({
        render: function () {
          this.rendered = true;
          this.$el.html('foo');
          return this;
        }
      }))();
    });

    it('should add view to views', function () {
      bobunView.append(myView);
      expect(bobunView.views.length).to.equal(1);
    });

    it('should render a view', function () {
      bobunView.append(myView);
      expect(myView).to.have.property('rendered', true);
    });

    it('should append the view element to the base view element', function () {
      bobunView.append(myView);
      expect(bobunView.$el.text()).to.equal('foo');
    });

    describe('#given a second argument', function () {
      beforeEach(function () {
        bobunView.$el.append('<div class="child"></div>');
      });

      it('should append the view element to the target child of the base view element if its a selector', function () {
        bobunView.append(myView, 'div.child');
        expect(bobunView.$el.find('div.child').get(0)).to.equal(myView.$el.parent().get(0));
      });

      it('should append the view element to it if its a jQuery element', function () {
        var $parent = bobunView.$el.find('div.child');
        bobunView.append(myView, $parent);
        expect($parent.get(0)).to.equal(myView.$el.parent().get(0));
      });

      it('should append the view element to it if its a DOM element', function () {
        var parent = bobunView.$el.find('div.child').get(0);
        bobunView.append(myView, parent);
        expect(parent).to.equal(myView.$el.parent().get(0));
      });
    });

    it('should be fluent', function () {
      bobunView.append(myView);
      expect(bobunView.append(myView)).to.equal(bobunView);
    });
  });

  describe('#assign', function () {
    var myView;

    beforeEach(function () {
      bobunView = new Bobun.View({
        el: Backbone.$('<div><h1 class="foo"></h1></div>')
      });

      myView = new (Backbone.View.extend({
        render: function () {
          this.rendered = true;
          this.$el.html('foo');
          return this;
        }
      }))();
    });

    it('should add view to views', function () {
      bobunView.assign('.foo', myView);
      expect(bobunView.views.length).to.equal(1);
    });

    it('should render a view', function () {
      bobunView.assign('.foo', myView);
      expect(myView).to.have.property('rendered', true);
    });

    it('should assign the view to the element', function () {
      bobunView.assign('.foo', myView);
      expect(myView.$el.hasClass('foo')).to.be.true;
      expect(bobunView.$el.text()).to.equal('foo');
    });

    it('should be fluent', function () {
      expect(bobunView.assign('.foo', myView)).to.equal(bobunView);
    });
  });

  describe('#toJSON', function () {

    beforeEach(function () {
      bobunView.collection = new Backbone.Collection([{foo: 'bar'}]);
      bobunView.model = new Backbone.Model({foo: 'bar'});
    });

    it('should serialize the model and the collection', function () {
      expect(bobunView.toJSON()).to.deep.equal({
        model: {foo: 'bar'},
        collection: [{foo: 'bar'}]
      });
    });
  });

  describe('#render', function () {

    beforeEach(function () {
      bobunView.model = new Backbone.Model({name: 'Greg'});
      bobunView.template = function (data) {
        return 'hello ' + data.model.name;
      };
    });

    it('should render the template with view data', function () {
      expect(bobunView.render().$el.html()).to.equal('hello Greg');
    });
  });

  describe('#set', function () {

    beforeEach(function () {
      bobunView.options = {};
    });

    it('should set an option', function () {
      bobunView.set('foo', 'bar');
      expect(bobunView.options.foo).to.equal('bar');
    });

    it('should trigger a "change:key" event with args (view, value, options)', function () {
      var spy = sinon.spy();
      bobunView.on('change:foo', spy);

      bobunView.set('foo', 'bar', 'opts');

      expect(spy.firstCall.args[0]).to.equal(bobunView);
      expect(spy.firstCall.args[1]).to.equal('bar');
      expect(spy.firstCall.args[2]).to.equal('opts');
    });

    it('should trigger a "change" event with args (view, options)', function () {
      var spy = sinon.spy();
      bobunView.on('change', spy);

      bobunView.set('foo', 'bar', 'opts');

      expect(spy.firstCall.args[0]).to.equal(bobunView);
      expect(spy.firstCall.args[1]).to.equal('opts');
    });

    it('should not trigger an event if the attribute is equal', function () {
      var spy = sinon.spy();
      bobunView.on('change:foo', spy);
      bobunView.on('change', spy);

      bobunView.options.foo = 'bar';
      bobunView.set('foo', 'bar');

      expect(spy.called).to.be.false;
    });

    it('should not trigger an event with silent option', function () {
      var spy = sinon.spy();
      bobunView.on('change:foo', spy);
      bobunView.on('change', spy);

      bobunView.set('foo', 'bar', {silent: true});

      expect(spy.called).to.be.false;
    });
  });

  describe('#get', function () {

    beforeEach(function () {
      bobunView.options = {
        foo: 'bar'
      };
    });

    it('should return the value of the option', function () {
      expect(bobunView.get('foo')).to.equal('bar');
    });
  });

  describe('#_bindModelOption', function () {

    beforeEach(function () {
      bobunView.model = new Backbone.Model({
        bar: 'hello'
      });

      bobunView.options = {
        foo: 'model.bar'
      };
    });

    it('should set the model attribute to the option', function () {
      bobunView._bindModelOption('foo');
      expect(bobunView.get('foo'), 'hello');
    });

    it('should not trigger a change event when called', function () {
      var spy = sinon.spy();
      bobunView.on('change:foo', spy);
      bobunView.on('change', spy);

      bobunView._bindModelOption('foo');
      expect(bobunView.get('foo'), 'hello');

      expect(spy.called).to.be.false;
    });

    it('should listen change on the model', function () {
      var spy = sinon.spy();

      bobunView._bindModelOption('foo');

      bobunView.on('change:foo', spy);

      bobunView.model.set('bar', 'test');

      expect(spy.called).to.be.true;
      expect(bobunView.get('foo', 'test'));
    });
  });

  describe('#domEventTriggerProxy', function () {
    it('should proxy a jQuery event', function () {
      var spy = sinon.spy(),
      event = Backbone.$.Event('click');

      bobunView.on('$click', spy);
      bobunView.domEventTriggerProxy(event);

      expect(spy.called).to.be.true;
      expect(spy.calledWith(event, bobunView)).to.be.true;
    });
  });
});