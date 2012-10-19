define(function(require, exports, module) {
'use strict';

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var Tokenizer = require("../tokenizer").Tokenizer;
var LuceneHighlightRules = require("./lucene_highlight_rules").LuceneHighlightRules;
var WorkerClient = require("../worker/worker_client").WorkerClient;

var Mode = function() {
    this.$tokenizer =  new Tokenizer(new LuceneHighlightRules().getRules());
};

oop.inherits(Mode, TextMode);

(function() {


this.createWorker = function(session) {
    var worker = new WorkerClient(["ace"], "ace/mode/lucene_worker", "LuceneWorker");
    worker.attachToDocument(session.getDocument());

    worker.on("msg", function(e) {
        session.setAnnotations([e.data]);
    });

    worker.on("terminate", function() {
        session.clearAnnotations();
    });

    return worker;
};


}).call(Mode.prototype);

exports.Mode = Mode;
});