/**
 * Created by NUC on 2017/6/7.
 */
/*global window, document, navigator, rJS, Handlebars*/
(function (window, document, navigator, rJS, Handlebars) {
    "use strict";

    /* Constants */

    var ENTER_KEY = 13,
        ESCAPE_KEY = 27,


    /* Global Variables */

    handlebars_template;

    var url = "http://www.maggiedodo.cn:9999/about_new";
    var aboutInfo = null;

    $.ajax({
        url: url,
        type: "GET",
        success: function(result){
            aboutInfo = result;
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
            gadget.element.appendChild(div);
            handlebars_template = Handlebars.compile(
                document.head.querySelector(".handlebars-template").innerHTML
            );
        })

        /* Rendering */

        .onStateChange(function () {
            var gadget = this;
            gadget.element.querySelector(".handlebars-anchor").innerHTML =
                handlebars_template({
                    info:aboutInfo
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

}(window, document, navigator, rJS, Handlebars));