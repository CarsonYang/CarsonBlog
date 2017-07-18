(function (window, document, rJS, RSVP) {

    rJS(window)

        // ready = all dependencies loaded
        // make the gadget DOM element accessible throughout the script
        .ready(function (gadget) {
            return gadget.getElement()
                .push(function (element) {
                    gadget.element = element;
                });
        })

        .declareService(function () {
            var gadget = this;
            $(".my-nav-pills li:contains('about')").addClass("active").siblings().removeClass("active");
            $("#job-title").cycleText();
        });

}(window, document, rJS, RSVP));