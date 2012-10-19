if (typeof process !== "undefined") {
    require("amd-loader");
}

define(function(require, exports, module) {
"use strict";

var assert = require("../test/assertions");
var Worker = require("./lucene_worker").LuceneWorker;


module.exports = {
    setUp : function() {
        this.sender = {
            on: function() {},
            callback: function(data, id) {
                this.data = data;
            },
            events: [],
            emit: function(type, e) {
                this.events.push([type, e]);
            }
        };
    },

    "test check for syntax error": function() {
        var worker = new Worker(this.sender);
        worker.setValue("this is borked OR");
        worker.deferredUpdate.call();

console.log('EVENTS', this.sender.events);

        assert.equal(this.sender.events[0][1][0].type, "error");
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
