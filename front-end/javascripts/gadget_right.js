(function (window, document, rJS, RSVP) {

    rJS(window)

        // ready = all dependencies loaded
        // make the gadget DOM element accessible throughout the script
        .ready(function (gadget) {
            return gadget.getElement()
                .push(function (element) {
                    gadget.element = element;
                })
        })

        // example: event binding
        .declareService(function () {
            var gadget = this;
            function sharecb() {
                var toggle = $('#ss_toggle'),
                    menu = $('#share-menu'),
                    rot;
                $('ul.fixed-tool li.share-li').show();
                if (!$(".qrcontain").is(":hidden")) {
                    $(".qrcontain").hide();
                    $("#qrBtn").removeClass("opened");
                }
                rot = parseInt(toggle.data('rot')) - 180;
                if (rot / 180 % 2 == 0) {
                    menu.css('transform', 'rotate(' + rot + 'deg)');
                    menu.css('webkitTransform', 'rotate(' + rot + 'deg)');
                    toggle.parent().addClass('ss_active');
                    toggle.addClass('close');
                } else {
                    menu.css('transform', 'rotate(' + parseInt(rot - 30) + 'deg)');
                    menu.css('webkitTransform', 'rotate(' + parseInt(rot - 30) + 'deg)');
                    toggle.parent().removeClass('ss_active');
                    toggle.removeClass('close');
                }
                toggle.data('rot', rot);
                menu.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
                    if (rot / 180 % 2 == 0) {
                        $("#share-menu i.fa").addClass('bounce');
                    } else {
                        $("#share-menu i.fa").removeClass('bounce');
                    }
                });
            }
            return loopEventListener(
                gadget.element.querySelector('#ss_toggle'),
                'click',
                false,
                sharecb
            );
        })

        .declareService(function () {
            var gadget = this;
            var img = document.createElement("img");
            return new RSVP.Queue()
                .push(function () {
                    img.src = "../../images/pic1.jpg";
                    img.onload = function () {
                        $("#qrcode").qrcode({
                            text: window.location.href,
                            size: "100",
                            ecLevel: 'L',
                            minVersion: 4,
                            mode: 4,
                            image: img,
                            mSize: 0.3
                        });
                    };
                })
                .push(function () {
                    return loopEventListener(
                        gadget.element.querySelector('#qrBtn'),
                        'click',
                        false,
                        qrcb
                    );
                });

            function qrcb() {
                var menu = $('#share-menu');
                $('ul.fixed-tool li.qr-li').show();
                if ($("#ss_toggle").hasClass("close")) {
                    $("#share-menu").css("transition", "none");
                    $("#ss_toggle").click();
                }
                if ($(".qrcontain").is(":hidden")) {
                    $(".qrcontain").removeClass("fadeOutLeft").addClass("fadeInLeft");
                    $(".qrcontain").show();
                    $("#qrBtn").addClass("opened");
                } else {
                    $(".qrcontain").removeClass("fadeInLeft").addClass("fadeOutLeft");
                    $(".qrcontain").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                        $(".qrcontain").hide();
                    });
                    $("#qrBtn").removeClass("opened");
                }
                $("#share-menu").css("transition", "all 1s ease 0s");
            }
        })

        .declareService(function () {
            var gadget = this;
            $(window).scroll(function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > 0) {
                    $("#scrollTop").show();
                    $(".qrcontain").css("top", "-57px");
                    $(".qrcontain .arrow").css("top", "52%");
                } else {
                    $("#scrollTop").hide();
                    $(".qrcontain").css("top", "-107px");
                    $(".qrcontain .arrow").css("top", "86%");
                }
            });
            function scrollcb() {
                var menu = $('#share-menu');
                $('ul.fixed-tool li.top-li').show();
                $("html,body").animate({scrollTop: 0}, 800);
            }
            return loopEventListener(
                gadget.element.querySelector('#scrollTop'),
                'click',
                false,
                scrollcb
            );
        });

}(window, document, rJS, RSVP));