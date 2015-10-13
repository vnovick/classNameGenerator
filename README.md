# classNameGenerator
BEM methodology inspired util that let's you create classNames in React by passing proper configuration. You can also use library outside of React since there are no React dependencies

## High-level API:
`classNameGenerator` is using some key concepts and names from BEM methodology. By default BEM naming is disabled but can be enabled via configuration. It's compatible with AMD, CommonJS and also can be used as browser global.

### Key concepts
Before describing `classNameGenerator` it's important to understand some key concepts of classNames naming convention. There are three main entities that should be explained:

##### Block
A logically and functionally independent page component that can be reused.

##### Element
A constituent part of a block that can't be used outside of it.

##### Modifier
className that defines appearance or behavior of an element/block. For example 'active' class on active menu element or 'hidden' class on hidden element are modifiers.


### Getting Started

`classNameGenerator` is an instance of `ClassNameGenerator` class which is created by passing configuration object with desired block and element names.
`classNameGenerator.Class` is ClassNameGenerator Class and can be used to create custom classNameGenerator with different configuration.

Following are examples of desired markup, configuration object that should be passed to `classNameGenerator` to achieve relevant classNameBlock
#### Basic Usage

##### Simple block with some elements inside

Let's say you want to create this kind of markup:

```html
<div class="test-container">
  <div class="panel"></div>
  <div class="card"></div>
</div>
```

In this case "test-container" is a block with two elements "panel" and "card"

In order to create classNameObject with `classNameGenerator`
do the following:

```javascript
var classNameGenerator = require('classname-generator');

var classNameBlock = classNameGenerator({
  name: 'test-container',
  elements: [{
    name: 'panel'
  },
  {
    name: 'card'
  }]
})

var Element = React.createClass({
  render: function() {
    return (
      <div className={classNameBlock}>
        <div className={classNameBlock.panel}></div>
        <div className={classNameBlock.card}></div>
      </div>
    )
  }
})

React.render(<Element />,document.body);

```

##### Simple block with some elements and different modifiers
The interesting part starts when you start using modifiers.

Let's say you need the following markup:

```html
<div class="tab-container active">
  <div class="panel wide"></div>
  <div class="card hidden"></div>
</div>
```

As you can see from the markup above 'active', 'wide', 'hidden' logically define appearance of 'tab-container', 'panel' and 'card' respectively

So they will be called modifiers and the syntax of classNameGenerator will be as following:

```javascript
var classNameGenerator = require('classname-generator');

var classNameBlock = classNameGenerator({
  name: 'test-container',
  elements: [{
    name: 'panel',
    modifiers: {
      wide: true,
      hidden: false,
    }
  },
  {
    name: 'card'
    modifiers: {
      hidden: true
    }
  }],
  modifiers: {
    active: true
  }
})

var Element = React.createClass({
  render: function() {
    return (
      <div className={classNameBlock}>
        <div className={classNameBlock.panel}></div>
        <div className={classNameBlock.card}></div>
      </div>
    )
  }
})

React.render(<Element />,document.body);

```
#### Usage Variations:

##### Elements access:

All elements can be accessed through elements object or directly

```javascript
classNameBlock.elements.panel = classNameBlock.panel
classNameBlock.elements.card = classNameBlock.card
```

##### Getting block/elements name directly without accessing name property

Calling toString will print element name:

```javascript
//calling toString method
classNameBlock.toString();

//Appending to string (will automatically call toString);
"" + classNameBlock;


//ES6 template strings usage
`${classNameBlock}`

```

##### Modifiers manipulations

Modifiers values can be changed on the fly by assigning new value to modifier.
For example with the same config object as above let's change hidden modifier on panel element:

```javascript
classNameBlock.panel.hidden = true;

classNameBlock.panel.name === classNameBlock.panel.toString === classNameBlock.elements.panel.name === classNameBlock.elements.panel.toString() === 'panel wide hidden'

```

#### Aliases
Alias is used in order to differentiate elements with the same name. Aliases as names cannot have duplicate values.

Let's say you want to create the following markup:
```html
<nav>
  <ul class="menu">
    <li class="item active"></li>
    <li class="item"></li>
    <li class="item"></li>
  </ul>
</nav>
```

As you can see we have several elements with duplicate names but one of them will have active modifier set to true.

The javascript will be as following:

```javascript
var classNameGenerator = require('classname-generator');

var classNameBlock = classNameGenerator({
  name: 'menu',
  elements: [{
    name: 'item',
    modifiers: {
      active: false,
    }
  },
  {
    name: 'item',
    alias: 'activeItem',
    modifiers: {
      active: true,
    }
  }]
})

var Element = React.createClass({
  render: function() {
      return (
        <nav>
          <ul className={classNameBlock}>
            <li className={classNameBlock.activeItem}></li>
            <li className={classNameBlock.item}></li>
            <li className={classNameBlock.item}></li>
          </ul>
        </nav>
      )
    }
});

React.render(<Element />,document.body);
```


### Custom Configuration and BEM
In BEM methodology the block level element will have unique class and child elements or child element modifiers inside the block will have prefix of parent class

For example class naming will be as following

```html
<div class="tab-container tab-container--active">
  <div class="tab-container__panel tab-container--wide"></div>
  <div class="tab-container__card tab-container--hidden"></div>
</div>
```

classNameGenerator supports BEM naming convention if you create it like this:


```javascript
var ClassNameGenerator = require('classname-generator').Class;
var customGenerator = new ClassNameGenerator({bemEnabled: true});

var classNameBlock = customGenerator({
  name: 'test-container',
  elements: [{
    name: 'panel',
    modifiers: {
      wide: true,
      hidden: false,
    }
  },
  {
    name: 'card',
    modifiers: {
      hidden: true
    }
  }],
  modifiers: {
    active: true
  }
})

var Element = React.createClass({
  render: function() {
    return (
      <div className={classNameBlock}>
        <div className={classNameBlock.panel}></div>
        <div className={classNameBlock.card}></div>
      </div>
    )
  }
})

React.render(<Element />,document.body);
```

There are several other configurable properties:


| Configuration Option | Value type | Default | Description                                         |
| -------------------- | ---------- | ------- | ---------------------------------------------- |
| elementSeperator     | String     | "__"    | separator between parent block name and element|
| modSeperator         | String     | "--"    | separator between element name and modifier name|
| modValueSeperator     | String     | "-"    | In case modifier value is other than boolean this  separator wil be between modifier key name and value.|
| classSeperator     | String     | " "    | This is default separator between class names|
| bemEnabled     | bool     | false    | passing false will strip generated classNames of seperators and will use only raw element and modifiers names. For example ``some-class some-class--hidden`` will be generated as ``some-class hidden``|
