define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var lang = require("../lib/lang");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var LuceneHighlightRules = function() {
    this.$rules = {
        "start" : [
            {
                token : "negation",
                regex : "[\\-]"
            }, {
                token : "interro",
                regex : "[\\?]"
            }, {
                token : "asterisk",
                regex : "[\\*]"
            }, {
                token: 'proximity',
                regex: '~[0-9]+\\b'
            }, {
                token : 'keyword',
                regex: '(?:AND|OR|NOT|NEAR/[1-9](?:[0-9]+))\\b'
            }, {
                token : "paren.lparen",
                regex : "[\\(]"
            }, {
                token : "paren.rparen",
                regex : "[\\)]"
            }, {
                token : "field",
                regex : "[\\S]+:[^)\\s]+"
            }, {
                token : "string",           // " string
                regex : '".*?"'
            }, {
                token : "text",
                regex : "\\s+"
            }
        ]
    };
};

oop.inherits(LuceneHighlightRules, TextHighlightRules);

exports.LuceneHighlightRules = LuceneHighlightRules;
});
