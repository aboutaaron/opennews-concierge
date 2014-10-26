/* global Wit: false, toString: false, jQuery: false */

'use strict';

var Concierge = Concierge || {},
    kv = function (k, v) {
        if (toString.call(v) !== '[object String]') {
            v = JSON.stringify(v);
        }

        return k + '=' + v + '\n';
    };

Concierge = {
    mic: new Wit.Microphone(document.getElementById('microphone')),
    init: function () {
        var self = this;
        self.setup();
        self.mic.connect('CLIENT_TOKEN');
    },
    setup: function () {
        var self = this;

        self.mic.onready = function () {
            self.info('Microphone is ready to record');
        };

        self.mic.onaudiostart = function () {
            self.info('Recording started');
            self.error('');
        };

        self.mic.onaudioend = function () {
            self.info('Recording stopped, processing started');
        };

        self.mic.onresult = function (intent, entities) {
            var r = kv('intent', intent);

            for (var k in entities) {
                var e = entities[k];

                if (!(e instanceof Array)) {
                    r += kv(k, e.value);
                } else {
                    for (var i = 0; i < e.length; i++) {
                        r += kv(k, e[i].value);
                    }
                }
            }

            document.getElementById('result').innerHTML = r;
        };

        self.mic.onerror = function (err) {
            self.error('Error: ' + err);
        };

        self.mic.onconnecting = function () {
            self.info('Microphone is connecting');
        };

        self.mic.ondisconnected = function () {
            self.info('Microphone is not connected');
        };
    },
    info: function (msg) {
        document.getElementById('info').innerHTML = msg;
    },
    error: function (msg) {
        document.getElementById('error').innerHTML = msg;
    }

};

jQuery(document).ready(function() {
    Concierge.init();
});
