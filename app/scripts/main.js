/* global Wit: false, toString: false, jQuery: false, alert: false, Handlebars: false */

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
        //self.download();
        self.setup();
        self.mic.connect('CSDL5LYIMJ77EM66K6TDF5HQ5AWM3ZYL');
    },
    fetch: function (aQuery) {
        var self = this;
        $.ajax({
            crossDomain: true,
            url: 'http://newsautomata.starbase.in/search',
            type: 'POST',
            data: {query: aQuery},
        })
        .done(function(response) {
            self.configure('#tmpl', '#placeholder', response);
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
    },
    download: function () {
        var manifest_url = location.href + 'manifest.webapp';

        function install(ev) {
          ev.preventDefault();
          // define the manifest URL
          // install the app
          var installLocFind = navigator.mozApps.install(manifest_url);
          installLocFind.onsuccess = function(data) {
            // App is installed, do something
          };
          installLocFind.onerror = function() {
            // App wasn't installed, info is in
            // installapp.error.name
            alert(installLocFind.error.name);
          };
        };

        // get a reference to the button and call install() on click if the app isn't already installed. If it is, hide the button.
        var button = document.getElementById('install-btn');

        var installCheck = navigator.mozApps.checkInstalled(manifest_url);

        installCheck.onsuccess = function() {
          if(installCheck.result) {
            button.style.display = "none";
          } else {
            button.addEventListener('click', install, false);
          };
        };
    },
    configure: function (template, placeholder, obj) {
        var source = $(template).html(),
            hbs = Handlebars.compile( source );

        $(placeholder).html( hbs( obj ) );
    }

};

jQuery(document).ready(function() {
    Concierge.init();
});
