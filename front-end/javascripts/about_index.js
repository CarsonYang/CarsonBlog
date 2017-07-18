/*global window, document, navigator, rJS, Handlebars,jIO,$*/
(function (window, document, navigator, rJS, Handlebars,jIO,$) {
    "use strict";

    /* Constants */

    var ENTER_KEY = 13,
        ESCAPE_KEY = 27,

    /* Global Variables */

        handlebars_template,
        storage,
        storageInfo,
        storageInfoID = "about";


    if (navigator.serviceWorker) {
        navigator.serviceWorker.register("../../serviceworker.js");
    }

    var url = "https://www.maggiedodo.cn/about_new";
    var aboutInfo = null;

    $.ajax({
        url: url,
        type: "GET",
        success: function(result){
            aboutInfo = result;
        },
        fail: function(error){
            console.log(error);
        }
    });

    /* Initialization */

    rJS(window)

        .setState({
            update: false
        })

        .declareService(function () {
            var gadget = this,
                div = document.createElement("div");
            storage = jIO.createJIO({"type": "indexeddb", "database": "about"});
            gadget.get(storageInfoID).push(function(){
                if(!storageInfo){
                    gadget.put(storageInfoID,aboutInfo).push(function(){
                        gadget.get(storageInfoID).push(function(){
                            gadget.element.appendChild(div);
                            handlebars_template = Handlebars.compile(
                                document.head.querySelector(".handlebars-template").innerHTML
                            );
                        });
                    });
                }else{
                    gadget.element.appendChild(div);
                    handlebars_template = Handlebars.compile(
                        document.head.querySelector(".handlebars-template").innerHTML
                    );
                }
            });

        })

        .declareMethod("put", function (id,message) {
            return storage.put(id, message)
                .push(function (result) {
                    console.log(result);
                })
                .push(undefined, function (error) {
                    console.log(error);
                });
        })
        .declareMethod("get", function (id) {
            return storage.get(id)
                .push(function (result) {
                    console.log(result);
                    storageInfo = result;
                })
                .push(undefined, function (error) {
                    console.log(error);
                    storageInfo = null;
                });
        })

        /* Rendering */

        .onStateChange(function () {
            var gadget = this;
            gadget.element.querySelector(".handlebars-anchor").innerHTML =
                handlebars_template({
                    info:storageInfo
                });
        })

        /* Event Listeners */

        .onEvent("click", function (event) {
            var gadget = this;
            if (event.target.className === "fa fa-lg fa-qrcode") {
                if($(".profile-img").css("display") === "none"){
                    $(".wechat-img").hide();
                    $(".profile-img").show();
                }else{
                    $(".profile-img").hide();
                    $(".wechat-img").show();
                }
            }else{
                return gadget.changeState({update: true});
            }
        }, false, false);

}(window, document, navigator, rJS, Handlebars,jIO,$));