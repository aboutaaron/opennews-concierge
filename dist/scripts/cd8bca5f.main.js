"use strict";var Concierge=Concierge||{},kv=function(a,b){return"[object String]"!==toString.call(b)&&(b=JSON.stringify(b)),a+"="+b+"\n"};Concierge={mic:new Wit.Microphone(document.getElementById("microphone")),init:function(){var a=this;a.setup(),a.mic.connect("CSDL5LYIMJ77EM66K6TDF5HQ5AWM3ZYL")},fetch:function(a){var b=this;$.ajax({crossDomain:!0,url:"http://newsautomata.starbase.in/search",type:"POST",data:{query:a}}).done(function(a){$("#placeholder").html(""),b.configure("#tmpl","#placeholder",a),console.log("success")}).fail(function(){console.log("error")}).always(function(){console.log("complete")})},setup:function(){var a=this;a.mic.onready=function(){a.info("Microphone is ready to record")},a.mic.onaudiostart=function(){a.info("Recording started"),a.error("")},a.mic.onaudioend=function(){a.info("Recording stopped, processing started")},a.mic.onresult=function(a,b){var c,d=kv("intent",a);try{c=b.search_query.value}catch(e){alert("try again"),window.location.reload()}for(var f in b){var e=b[f];if(e instanceof Array)for(var g=0;g<e.length;g++)d+=kv(f,e[g].value);else d+=kv(f,e.value)}Concierge.fetch(c),document.getElementById("result").innerHTML=d},a.mic.onerror=function(b){a.error("Error: "+b)},a.mic.onconnecting=function(){a.info("Microphone is connecting")},a.mic.ondisconnected=function(){a.info("Microphone is not connected")}},info:function(a){document.getElementById("info").innerHTML=a},error:function(a){document.getElementById("error").innerHTML=a},download:function(){function a(a){a.preventDefault();var c=navigator.mozApps.install(b);c.onsuccess=function(){},c.onerror=function(){alert(c.error.name)}}var b=location.href+"manifest.webapp",c=document.getElementById("install-btn"),d=navigator.mozApps.checkInstalled(b);d.onsuccess=function(){d.result?c.style.display="none":c.addEventListener("click",a,!1)}},configure:function(a,b,c){var d=$(a).html(),e=Handlebars.compile(d);$(b).html(e(c))}},jQuery(document).ready(function(){Concierge.init()});