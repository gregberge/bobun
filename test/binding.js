/*jshint undef:false, expr:true, strict:false */
var expect = require('chai').expect,
sinon = require('sinon'),
Backbone = require('backbone'),
Bobun = require('../bobun');


describe('Bobun.Binding', function () {

  var modelA, modelB;

  beforeEach(function () {
    modelA = new Backbone.Model();
    modelB = new Backbone.Model();
  });

  it('should be consistent', function () {
    var binding = Bobun.Binding(modelA);
    expect(binding).to.be.equal(Bobun.Binding(binding));
  });

  describe('#methods', function () {

    describe('#bindTo', function () {
      it('obj.bindTo(bindedObj, property)', function () {
        var spy = sinon.spy();
        modelB.on('change:foo', spy);
        Bobun.Binding(modelA).bindTo(modelB, 'foo');

        modelA.set('foo', 'bar');

        expect(spy.called).to.be.true;
        expect(modelB.get('foo')).to.equal('bar');
      });

      it('obj.bindTo(bindedObj, Array attributes)', function () {
        var spy = sinon.spy();
        modelB.on('change:foo', spy);
        modelB.on('change:bar', spy);
        Bobun.Binding(modelA).bindTo(modelB, ['foo', 'bar']);

        modelA.set('foo', 'bar');
        modelA.set('bar', 'foo');

        expect(spy.calledTwice).to.be.true;
      });

      it('obj.bindTo(bindedObj, Object attributes)', function () {
        var spy = sinon.spy();
        modelB.on('change:bar', spy);
        Bobun.Binding(modelA).bindTo(modelB, {
          'foo': 'bar'
        });

        modelA.set('foo', 'bar');

        expect(spy.called).to.be.true;
      });

      it('Bobun.Binding.bindTo(obj, bindedObj, Object attributes)', function () {
        var spy = sinon.spy();
        modelB.on('change:bar', spy);
        Bobun.Binding.bindTo(modelA, modelB, {
          'foo': 'bar'
        });

        modelA.set('foo', 'bar');

        expect(spy.called).to.be.true;
      });
    });

    describe('#bind', function () {
      it('obj.bind(bindedObj, property)', function () {
        var spy = sinon.spy();
        modelA.on('change:foo', spy);
        modelB.on('change:foo', spy);
        Bobun.Binding(modelA).bind(modelB, 'foo');

        modelA.set('foo', 'bar');
        expect(spy.callCount).to.equal(2);
        expect(modelB.get('foo')).to.equal('bar');

        modelB.set('foo', 'bar2');
        expect(spy.callCount).to.equal(4);
        expect(modelA.get('foo')).to.equal('bar2');
      });
    });
  });
});