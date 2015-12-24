
'use strict';
// var React;
var classNameGenerator = require('../src/ClassNameGenerator');
var expect = require("chai").expect;
var assert = require("chai").assert;
// var ReactTestUtils;

describe('ClassNameGenerator', function() {
    var ClassNameConfig = {
        name: 'test-container',
        elements: [
            {
                name: 'element1',
                modifiers: {
                    hidden: true,
                    test: 'secondVal',
                },
            },
            {
                name: 'element2',
                modifiers: {
                    red: true,
                    secondMod: 2,
                },
            },
        ],
        modifiers: {
            hidden: true,
        },
    };
    it('has a constructor function', function() {
        assert.instanceOf(classNameGenerator, Function, 'classNameGenerator is instance of Function');
    });

    it('should return an Object', function() {
        expect(typeof classNameGenerator(ClassNameConfig)).to.eql('object');
    });

    it('should create correct number of children elements', function() {
        var cssClassNameBlock = classNameGenerator(ClassNameConfig);
        expect(Object.getOwnPropertyNames(cssClassNameBlock).length).to.eql(2);
    });

    it('should return correct block class with modifiers', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.name).to.eql('test-container hidden');
    });

    it('returned block class should support toString() for getting name value', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.toString()).to.eql('test-container hidden');
    });

    it('should return correct block elements classes with modifiers', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.element1.name).to.eql('element1 hidden test-secondVal');
    });


    it('should be able to support BEM blocks naming for elements with modifiers', function() {
        var customClassNameGenerator = new classNameGenerator.Class({
            bemEnabled: true,
        });
        var bemBlock = customClassNameGenerator(ClassNameConfig);
        expect(bemBlock.element1.name).to.eql('test-container__element1 test-container__element1--hidden test-container__element1--test-secondVal');
    });
    it('should allow object dot notation of elements and child elements', function() {
      var dotNotationConfig = {
        name: 'test-container',
        elements: [
            {
                name: 'my-element-one',
                elements: [{
                  name:'child-one'},
                {
                  name: 'child-two'},]
            },
            {
                name: 'my-element-two',
                alias: 'my-element-two-alias',
                elements: [{
                  name: 'child-one'},
                { name: 'child-two'},
                ]
            },
        ],
      };
      var classNameBlock = classNameGenerator(dotNotationConfig);
      expect(classNameBlock.myElementOne.childOne).to
        .eql(classNameBlock.elements['myElementOne'].elements['childOne']);
    });


});
