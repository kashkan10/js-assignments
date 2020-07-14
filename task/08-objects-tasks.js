'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;

    Rectangle.prototype.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

    element: function (value) {
        return new CssConstructor().element(value);
    },

    id: function (value) {
        return new CssConstructor().id(value);
    },

    class: function (value) {
        return new CssConstructor().class(value);
    },

    attr: function (value) {
        return new CssConstructor().attr(value);
    },

    pseudoClass: function (value) {
        return new CssConstructor().pseudoClass(value);
    },

    pseudoElement: function (value) {
        return new CssConstructor().pseudoElement(value);
    },

    combine: function (selector1, combinator, selector2) {
        return new CssConstructor().combine(selector1, combinator, selector2);
    },
};

class CssConstructor {

    constructor() {
        this.value = "";
        this.order = [];
    }

    element(value) {
        if (this.hasElement) {
            throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
        }

        this.hasElement = true;
        this.checkOrder(0);
        this.value += value;
        return this;
    }

    id(value) {
        if (this.hasId) {
            throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
        }

        this.hasId = true;
        this.checkOrder(1);
        this.value += `#${value}`;
        return this;
    }

    class(value) {
        this.checkOrder(2);
        this.value += `.${value}`;
        return this;
    }

    attr(value) {
        this.checkOrder(3);
        this.value += `[${value}]`;
        return this;
    }

    pseudoClass(value) {
        this.checkOrder(4);
        this.value += `:${value}`;
        return this;
    }

    pseudoElement(value) {
        if (this.hasPseudoElement) {
            throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
        }

        this.hasPseudoElement = true;
        this.checkOrder(5);
        this.value += `::${value}`;
        return this;
    }

    combine(selector1, combinator, selector2) {
        this.value = eval(selector1).value + " " + combinator + " " + eval(selector2).value;
        return this;
    }

    stringify() {
        return this.value;
    }

    checkOrder(num) {
        this.order.push(num);
        this.order.reduce((prev, curr) => {
            if (prev > curr) {
                throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
            }
        })
    }
}


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
