
'use strict';
// var React;
var classNameGenerator = require('../src/ClassNameGenerator');
var expect = require("chai").expect;
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
    it('ClassNameGenerator is an instance of Object', function() {
        expect(classNameGenerator.constructor.name).to.eql('Function');
    });

    it('ClassNameGenerator should return an Object', function() {
        expect(typeof classNameGenerator(ClassNameConfig)).to.eql('object');
    });

    it('ClassNameGenerator should create correct number of children elements', function() {
        var cssClassNameBlock = classNameGenerator(ClassNameConfig);
        expect(Object.getOwnPropertyNames(cssClassNameBlock).length).to.eql(2);
    });

    it('ClassNameGenerator should return correct block class with modifiers', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.name).to.eql('test-container hidden');
    });

    it('ClassNameGenerator returned block class should support toString() for getting name value', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.toString()).to.eql('test-container hidden');
    });

    it('ClassNameGenerator should return correct block elements classes with modifiers', function() {
        var classNameBlock = classNameGenerator(ClassNameConfig);
        expect(classNameBlock.element1.name).to.eql('element1 hidden test-secondVal');
    });


    it('ClassNameGenerator should be able to support BEM blocks naming for elements with modifiers', function() {
        var customClassNameGenerator = new classNameGenerator.Class({
            bemEnabled: true,
        });
        var bemBlock = customClassNameGenerator(ClassNameConfig);
        expect(bemBlock.element1.name).to.eql('test-container__element1 test-container__element1--hidden test-container__element1--test-secondVal');
    });

});
