/**
 * Created by NUC on 2017/6/11.
 */
/*global window, document, navigator, rJS, Handlebars,jIO,$*/
(function (window, document, navigator, rJS, Handlebars,jIO,$) {
    "use strict";

    /* Global Variables */

    var handlebars_template,
        storage,
        listInfo,
        listInfoId = "list",
        listInfoDefault = {"Source":"0","Alias":"Korean","Title":"M&C around the world- Korean Impression Part 1","Url":"","PublishDate":"2017-06-17","Host":"","Summary":"Korean style","ViewCount":27,"CategoryAlias":"Travel","CateName":"旅行"};

    /* Initialization */

    var home_loading_timeout = 2000;
    var isLoading = false;
    var timeout = 1000;
    var contentTimeout = 1500;
    var begin = new Date();
    var contentBegin = new Date();
    var pageCount;
    var tooltip_timeout = 1500;

    rJS(window)

        .setState({
            update: false
        })

        .declareService(function () {
            var gadget = this;
            storage = jIO.createJIO({"type": "indexeddb", "database": "blog"});
            handlebars_template = Handlebars.compile(
                document.head.querySelector(".handlebars-template").innerHTML
            );
            gadget.element.querySelector(".handlebars-anchor").innerHTML =
                handlebars_template({
                });

            /*UI Initialization */

            $(".category-list").mCustomScrollbar({
                axis: "y",
                theme: "dark-3"
            });

            $(window).scroll(function () {
                $("[data-toggle='tooltip']").tooltip("hide");
            });

            $("[data-toggle='tooltip']").tooltip({
                container: "body"
            });

            $(".post-modal .modal-body").mCustomScrollbar({
                theme: "dark-3",
                scrollButtons: {
                    enable: true
                }
            });

            gadget.requestData();

            //event listening without gadget event but JQ event

            $(document).on({
                click: function () {
                    $(this).remove();
                    begin = new Date();
                    $("#load-list").show();
                    isLoading = true;
                    $("#PageIndex").val(parseInt($("#PageIndex").val()) + 1);
                    requestData();
                }
            }, "#btn-load");

            $(document).on({
                click: function () {
                    var index = $(this).attr("page");
                    var pageItem = $("#page" + index);
                    $("html,body").animate({scrollTop: $(pageItem).offset().top - 90}, 1000);
                }
            }, "#page-nav a");

            $(document).on({
                click: function () {
                    var $this = $(this);
                    $(".bd_weixin_popup").hide();
                    $(".bd_weixin_popup_bg").hide();
                    $(".post-cover").fadeIn();
                    $("body").addClass("modal-open");
                    $(".post-modal").css("right", 0);
                    var alias = $(this).parent().attr("uid");
                    if ($('body').data('preview') === alias) {
                        return;
                    }
                    gadget.resetModal();
                    var title = $(this).siblings("h4").children("a").html();
                    $(".post-modal .modal-header h4").html(title);
                    $("#btnFullMode").attr("href", $(this).next('h4').children('a').attr('href'));
                    $(".post-content div").hide();
                    var previewData = $this.data('preview-data');
                    if (previewData) {
                        gadget.appendContent(previewData);
                        return;
                    }
                    $(".sk-cube-grid").show();
                    contentBegin = new Date();
                    $.ajax({
                        url: "/blog/getPreviewContent",
                        type: "Post",
                        data: {alias: alias},
                        success: function (data) {
                            var end = new Date();
                            $this.data('preview-data', data);
                            if (end - contentBegin > contentTimeout) {
                                gadget.appendContent(data);
                            } else {
                                var timespan = contentTimeout - (end - contentBegin);
                                setTimeout(function () {
                                    gadget.appendContent(data);
                                }, timespan);
                            }
                        }
                    });
                }
            }, ".preview-link");

            $("#Keyword").on("keypress", function (e) {
                if (e.which == 13 || e.which == 10) {
                    gadget.searchPost();
                }
            });

            $("#btnFilter").on("click", function () {
                gadget.searchPost();
            });

            $(".selectlist").on("changed.fu.selectlist", function (e, data) {
                $(this).find("li").removeClass("active");
                $(this).find("li[data-value=" + data.value + "]").addClass("active");
            });

            $(".fa.fa-lg.fa-qrcode").on("click",function(){
                if($(".profile-img").css("display") === "none"){
                    $(".wechat-img").hide();
                    $(".profile-img").show();
                }else{
                    $(".profile-img").hide();
                    $(".wechat-img").show();
                }
            });

            $(".post-cover").on("click",function(){
                gadget.closeModal();
            });

            $("#btnCloseModal").on("click",function(){
                gadget.closeModal();
            });

            $("#btnFullMode").on("click",function(){
                setTimeout(gadget.closeModal, 800);
            });

            $(".input-group-btn").on("click",function(){
                //gadget.searchPost();
            });

            $("a[sort='date']").on("click",function(){
                if (!$(this).hasClass("current")) {
                    $(event.target).addClass("current").siblings().removeClass("current");
                    $(".list-wrap ol").html("");
                    $("[data-toggle='tooltip']").tooltip("hide");
                    $("#page-nav").html("");
                    $("#btn-load").remove();
                    $("#no-more").remove();
                    begin = new Date();
                    $("#load-list").show();
                    $("#SortBy").val($(this).attr("sort"));
                    $("#PageIndex").val(1);
                    gadget.requestData();
                }
            });

            $("a[sort='title']").on("click",function(){
                if (!$(this).hasClass("current")) {
                    $(event.target).addClass("current").siblings().removeClass("current");
                    $(".list-wrap ol").html("");
                    $("[data-toggle='tooltip']").tooltip("hide");
                    $("#page-nav").html("");
                    $("#btn-load").remove();
                    $("#no-more").remove();
                    begin = new Date();
                    $("#load-list").show();
                    $("#SortBy").val($(this).attr("sort"));
                    $("#PageIndex").val(1);
                    gadget.requestData();
                }
            });

        })

        /* declare method */

        .declareMethod("requestData", function () {
            var gadget = this;
            gadget.put(listInfoId,listInfoDefault);
            $.ajax({
                url: $('#filterForm')[0].action,
                type: $('#filterForm')[0].method,
                data: $('#filterForm').serialize(),
                success: function (result) {
                    var end = new Date();
                    var data = result.posts;
                    pageCount = result.pageCount;
                    gadget.put(listInfoId,data);
                    if (end - begin > timeout) {
                        gadget.get(listInfoId);
                    } else {
                        var timespan = timeout - (end - begin);
                        setTimeout(function () {
                            gadget.get(listInfoId);
                        }, timespan);
                    }
                },
                fail: function(error){
                    console.log(error);
                    gadget.get(listInfoId);
                }
            });
        })

        .declareMethod("addPage",function(index, data){
            var gadget = this;
            $("#load-list").hide();
            if (data.length > 0) {
                $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
                $.each(data, function (key, value) {
                    var itemHtml;
                    if (value.Source == "1") {
                        itemHtml = "<div uid=\""
                            + value.Alias
                            + "\" class=\"blog-item " + ($(".home-loading").length > 0 ? "" : "animated fadeIn") + "\">"
                            + "    <h4>"
                            + "        <a title=\""
                            + value.Title
                            + "\" target=\"_blank\" href=\""
                            + value.Url
                            + "\">"
                            + "<i class=\"fa fa-link\"></i> " + value.Title
                            + "        <\/a>"
                            + "    <\/h4>"
                            + "    <span title=\"文章分类\">"
                            + "        <i class=\"fa fa-map-signs\">"
                            + "        <\/i>"
                            + "        "
                            + "<a href=\"/blog/" + value.CategoryAlias + "\" target=\"_blank\">" + value.CateName + "</a>"
                            + "    <\/span>"
                            + "    <span title=\"发布时间\" class=\"margin-left-20\">"
                            + "        <i class=\"fa fa-clock-o\">"
                            + "        <\/i>"
                            + "        "
                            + value.PublishDate
                            + "    <\/span>"
                            + "    <a title=\""
                            + value.Host
                            + "\" target=\"_blank\" href=\""
                            + value.Url.substring(0, value.Url.indexOf("://") + 3) + value.Host
                            + "\" class=\"pull-right margin-left-20 hidden-xs\">"
                            + "        "
                            + "<i class=\"fa fa-globe\"></i> " + value.Host
                            + "    <\/a>"
                            + "    <div class=\"clearfix\">"
                            + "    <\/div>"
                            + "    <p>"
                            + "        "
                            + value.Summary
                            + "    <\/p>"
                            + "<\/div>"
                            + "<div class=\"hr-line-dashed\"></div>";
                    } else {
                        itemHtml = "<div class='blog-item' uid='"+ value.Alias +"'>" +
                            "<a class='preview-link' title='点击预览'></a>" +
                            "<h4><a href='http://www.maggiedodo.cn/blog/"+value.CategoryAlias+"/"+value.Alias+"' title='"+value.Title+"' target='_blank'>"+ value.Title +"</a></h4>" +
                            "<span title='文章分类'><i class='fa fa-map-signs'></i> <a href='/blog/"+value.CategoryAlias+"' target='_blank'>"+value.CateName+"</a></span> " +
                            "<span class='margin-left-20' title='发布时间'><i class='fa fa-clock-o'></i>" +value.PublishDate+"</span>" +
                            "<div class='clearfix'></div>" +
                            "<p>" +value.Summary+"</p>" +
                            "</div>" +
                            "<div class='hr-line-dashed'></div>";
                    }
                    $("#page" + index).append(itemHtml);
                });
                $("body").append("<script id=\"cy_cmt_num\" src=\"http://changyan.sohu.com/upload/plugins/plugins.list.count.js?clientId=cyrUoGjWj\"><\/script>");
                var item = $("<li><a href=\"javascript:void(0)\" page=\"" + index + "\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"第" + index + "页\"></a></li>");
                item.appendTo($("#page-nav"));
                var percent = 100 / index;
                $("#page-nav li").css("height", percent + "%");
                $("[data-toggle='tooltip']:visible").tooltip({
                    container: "body"
                });
                item.find("a").tooltip("show");
                setTimeout(function () {
                    item.find("a").tooltip("hide");
                }, tooltip_timeout);
                if ($("#PageIndex").val() == pageCount) {
                    if (pageCount != 1) {
                        $(".list-wrap").append("<div id=\"no-more\" class=\"text-muted text-center\">没有更多数据了<\/div>");
                    }
                } else {
                    $(".list-wrap").append("<button id=\"btn-load\" class=\"btn btn-white btn-block\">下一页</button>");
                }
            } else {
                $(".list-wrap ol").append("<li id=\"page" + index + "\"></li>");
                $("#page" + index).append("<div class=\"text-center text-muted\">暂无数据</div>");
            }
            isLoading = false;
            if ($(".home-loading").length > 0) {
                var home_loading_end = new Date();
                $("[data-toggle='tooltip']").tooltip("hide");
                if (home_loading_end - home_loading_begin > home_loading_timeout) {
                    gadget.loadingRemove();
                } else {
                    var home_loading_timespan = home_loading_timeout - (home_loading_end - home_loading_begin);
                    setTimeout(function () {
                        gadget.loadingRemove();
                    }, home_loading_timespan);
                }
            }
        })

        .declareMethod("loadingRemove",function(){
            $(".home-loading").remove();
            document.body.style.overflow = "auto";
        })

        .declareMethod("resetModal",function(){
            $(".post-modal .modal-header h4").empty();
            $(".post-content div").empty();
            $("#label-foot").empty();
        })

        .declareMethod("appendContent",function(data){
            $(".sk-cube-grid").hide();
            $(".post-content div").html(data.Content);

            var labels = JSON.parse(data.Labels);
            $.each(labels, function (key, value) {
                $("#label-foot").append("<span title=\"" + value.text + "\" class=\"post-label\">" + value.text + "</span>");
            });
            $(".post-modal .modal-body").mCustomScrollbar("scrollTo", "top", {
                scrollInertia: 0
            });
            $(".post-content div").fadeIn();
            var pres = $('.post-content pre');
            pres.each(function (i, pre) {
                $(pre).html($('<code></code>').html($(pre).html()));
                hljs.highlightBlock($(pre).children('code')[0]);
            });
        })

        .declareMethod("closeModal",function(){
            $(".post-modal").css("right", "-1200px");
            $(".post-cover").fadeOut();
            $("body").removeClass("modal-open");
        })

        .declareMethod("searchPost",function(){
            var gadget = this;
            $(".list-wrap ol").html("");
            $("[data-toggle='tooltip']").tooltip("hide");
            $("#page-nav").html("");
            $("#btn-load").remove();
            $("#no-more").remove();
            begin = new Date();
            $("#load-list").show();
            $("#PageIndex").val(1);
            gadget.requestData();
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
            var gadget = this;
            return storage.get(id)
                .push(function (result) {
                    console.log(result);
                    listInfo = result;
                    gadget.addPage($("#PageIndex").val(), listInfo);
                })
                .push(undefined, function (error) {
                    console.log(error);
                });
        })

}(window, document, navigator, rJS, Handlebars,jIO,$));