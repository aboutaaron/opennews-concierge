/* global Wit: false, toString: false, jQuery: false, alert: false */

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
        self.mic.connect('CSDL5LYIMJ77EM66K6TDF5HQ5AWM3ZYL');
    },
    fetch: function (aQuery) {
        $.ajax({
            crossDomain: true,
            url: 'http://newsautomata.starbase.in/search',
            type: 'POST',
            data: {query: aQuery},
        })
        .done(function(response) {
            console.log('success');
        })
        .fail(function() {
            console.log('error');
        })
        .always(function() {
            console.log('complete');
        });

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
            var query;

            try {
                query = entities.search_query.value;

            } catch (e) {
                alert('try again');
                window.location.reload();
            }


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

            Concierge.fetch(query);

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
