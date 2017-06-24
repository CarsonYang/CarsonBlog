/**
 * Created by NUC on 2017/6/7.
 */
/*global window, document, navigator, rJS, Handlebars,jIO,$*/
(function (window, document, navigator, rJS, Handlebars,jIO,$) {
    "use strict";

    /* Constants */

    var ENTER_KEY = 13,
        ESCAPE_KEY = 27,
        aboutInfoDefault = {
            "FirstLine": "",
            "SecondLine": "",
            "PhotoPath": "",
            "ThirdLine": "",
            "Profile": "",
            "Wechat": "",
            "QrcodePath": "",
            "websiteImage":"",
            "Email": ""
        },


    /* Global Variables */

        handlebars_template,
        storage,
        storageInfo,
        storageInfoID = "about";

    var url = "http://www.maggiedodo.cn:9999/about_new";
    var aboutInfo = aboutInfoDefault;

    $.ajax({
        url: url,
        type: "GET",
        success: function(result){
            aboutInfo = result || aboutInfoDefault;
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
            gadget.put(storageInfoID,aboutInfo);
            gadget.get(storageInfoID);
            gadget.element.appendChild(div);
            handlebars_template = Handlebars.compile(
                document.head.querySelector(".handlebars-template").innerHTML
            );
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