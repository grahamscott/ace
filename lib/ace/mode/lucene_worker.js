//Taken from: https://github.com/thoward/lucene-query-parser.js

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var Mirror = require("../worker/mirror").Mirror;
var parser = require("./lucene/lucene-query-parser");

var LuceneWorker = exports.LuceneWorker = function(sender) {
    Mirror.call(this, sender);
    this.setTimeout(500);
    this.setOptions();
};

oop.inherits(LuceneWorker, Mirror);

(function() {

    this.setOptions = function(options) {
        this.options = options || {};
        //nothing to do here
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.changeOptions = function(newOptions) {
        oop.mixin(this.options, newOptions);
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    };

    this.onUpdate = function() {
        var value = this.doc.getValue(),
            results;

        try{
            results = parser.parse(value);
            console.log('RESULTS', results);
        } catch(err){
            this.sender.emit("lucene-query-parser", err);
        }
    };

}).call(LuceneWorker.prototype);

});