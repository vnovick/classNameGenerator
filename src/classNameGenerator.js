/* global define, module, root */
(function (root, factory) {
    "use strict";
    if (typeof exports === "object") {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.classNameGenerator = factory();
    }
})
(this, function() {
 'use strict';

 var defaults = {
   elementSeperator: '__',
   elementNameSeperator: '-',
   modSeperator: '--',
   modValueSeperator: '-',
   classSeperator: ' ',
   bemEnabled: false,
 };
var toCamelCase = function(str, delimiter) {
  var delimiter = delimiter || defaults.elementNameSeperator;
  return str.toLowerCase().
    replace(new RegExp(delimiter + '([a-z])', 'g'), function (word) {
    return word[1].toUpperCase();
  });
};

 function ClassNameGenerator(options) {
   if (!(this instanceof ClassNameGenerator)) {
     return getClassNameGeneratorInstance(options);
   }
   options = options || {};
   this.elementSeperator = options.elementSeperator || defaults.elementSeperator;
   this.elementNameSeperator = options.elementNameSeperator || defaults.elementNameSeperator;
   this.modSeperator = options.modSeperator || defaults.modSeperator;
   this.modValueSeperator = options.modValueSeperator || defaults.modValueSeperator;
   this.classSeperator = options.classSeperator || defaults.classSeperator;
   this.bemEnabled = typeof options.bemEnabled === 'boolean' ? options.bemEnabled : defaults.bemEnabled;
   return this.generateBlockClassNames.bind(this);
 }

 ClassNameGenerator.prototype = {

   _createModifier: function(base, modifierKey, modifierValue) {
     if (modifierValue) {
       modifierKey = modifierKey;
       var bemPrefix = this.bemEnabled ? base + this.modSeperator : '';
       return this.classSeperator + bemPrefix + modifierKey;
     } else {
       return '';
     }
   },
   _generateModifiers: function(base, modifiersList) {
     modifiersList = modifiersList || {};
     var modifierClassString = '';
     Object.getOwnPropertyNames(modifiersList).forEach(function(modifier) {
       if (typeof modifiersList[modifier] === 'boolean') {
         modifierClassString += this._createModifier(base, modifier, modifiersList[modifier]);
       } else {
         var baseClassName = this.bemEnabled ? base + this.modSeperator : '';
         modifierClassString += this.classSeperator + baseClassName + modifier + this.modValueSeperator + modifiersList[modifier];
       }
     }.bind(this));
     return modifierClassString;
   },
   _generateElement: function(base, el, generatedElementsObject, elementObject) {
     var elementName = toCamelCase(el.alias || el.name, this.elementNameSeperator);
     var elCopy = Object.assign({},el);
     var bemPrefix = this.bemEnabled ? base + this.elementSeperator : '';
     elCopy.name = bemPrefix + el.name;
     var generatedBlock = this.generateBlockClassNames(elCopy);
     try {
       elementName = generatedElementsObject.hasOwnProperty(elementName) && el.alias ? el.alias : elementName;
       Object.defineProperty(generatedElementsObject, elementName, {
         value: generatedBlock,
       });
       Object.defineProperty(elementObject.prototype, elementName, { value: generatedBlock});
     } catch (ex) {
       if (ex.message.indexOf('Cannot redefine property') > -1) {
         var errorReason = el.alias ? 'alias: ' + el.alias : 'element name: "' + el.name + '" please use alias to support duplicate element names';
         throw new TypeError('Element classNames and aliases cannot have duplicate values. Trying to assign duplicate ' + errorReason + ' check configuration Object');
       }
     }


     return generatedElementsObject;
   },
   _generateElementList: function(b, elementObject) {
     var base = b.name;
     var elementList = b.elements;
     var generatedElementsObject = {};
     if (elementList) {
       elementList.forEach(function(el) {
         generatedElementsObject = this._generateElement(base, el, generatedElementsObject, elementObject);
       }.bind(this));
     }

     return generatedElementsObject;
   },
   _generateBlockName: function(b) {
     return b.name + this._generateModifiers(b.name, b.modifiers);
   },


   generateBlockClassNames: function(block) {
     var b = block;
     var self = this;
     var Element = function() {
       this.elements = self._generateElementList(b, Element);
       this.modifiers = block.modifiers;
     };

     Element.prototype.toString = function() {
       return this.name;
     };

     Object.defineProperty(Element.prototype, 'name', { get: function() {
       return self._generateBlockName(b);
     }});


     return new Element();
   },
 };

 function getClassNameGeneratorInstance() {
   var classNameGenerator = new ClassNameGenerator();
   return classNameGenerator;
 }

 var classNameGenerator = getClassNameGeneratorInstance();
 classNameGenerator.Class = ClassNameGenerator;

 return classNameGenerator;
});
