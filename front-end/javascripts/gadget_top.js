/**
 * Created by NUC on 2017/5/29.
 */
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

        // example: event binding
        .declareService(function () {
            var gadget = this;
            $(".my-nav-pills li:contains('about')").addClass("active").siblings().removeClass("active");
            $("#job-title").cycleText();
            //function sharecb() {
            //    console.log("mouseenter event fire");
            //}
            //return loopEventListener(
            //    gadget.element.querySelector('#ss_toggle'),
            //    'mouseenter',
            //    false,
            //    sharecb
            //);
        });

}(window, document, rJS, RSVP));