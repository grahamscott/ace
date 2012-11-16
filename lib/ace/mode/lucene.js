define(function(require, exports, module) {
'use strict';

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LuceneHighlightRules = require("./lucene_highlight_rules").LuceneHighlightRules;
var Outdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.$tokenizer =  new Tokenizer(new LuceneHighlightRules().getRules());
    this.$outdent   = new Outdent();
};

oop.inherits(Mode, TextMode);

(function() {

    var indenter = /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/;
    var commentLine = /^(\s*)#/;
    var hereComment = /^\s*###(?!#)/;
    var indentation = /^\s*/;

    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);
        var tokens = this.$tokenizer.getLineTokens(line, state).tokens;

        if (!(tokens.length && tokens[tokens.length - 1].type === 'comment') &&
            state === 'start' && indenter.test(line))
            indent += tab;
        return indent;
    };

    this.toggleCommentLines = function(state, doc, startRow, endRow){
        console.log("toggle");
        var range = new Range(0, 0, 0, 0);
        for (var i = startRow; i <= endRow; ++i) {
            var line = doc.getLine(i);
            if (hereComment.test(line))
                continue;

            if (commentLine.test(line))
                line = line.replace(commentLine, '$1');
            else
                line = line.replace(indentation, '$&#');

            range.end.row = range.start.row = i;
            range.end.column = line.length + 1;
            doc.replace(range, line);
        }
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

}).call(Mode.prototype);

exports.Mode = Mode;
});