! function (t) {
    t.fn.printPreview = function (e) {
      var i = this,
        r = t.extend({
          obj2print: "body",
          style: "",
          width: "670",
          height: screen.height - 105,
          top: 0,
          left: "center",
          resizable: "yes",
          scrollbars: "yes",
          status: "no",
          title: "Print Preview"
        }, e);
      return "center" == r.left && (r.left = screen.width / 2 - r.width / 2), i.bind("click.printPreview", function () {
        var e = i[0].outerHTML,
          n = "";
        n = t("head").html();
        var l = "<!DOCTYPE html><html><head>" + n + r.style + "</head><body>";
        l += t(r.obj2print)[0].outerHTML.replace(e, "") + "</body></html>";
        var o = window.open("", "newWindow", "width=" + r.width + ",top=" + r.top + ",height=" + r.height + ",left=" + r.left + ",resizable=" + r.resizable + ",scrollbars=" + r.scrollbars + ",status=" + r.status);
        o.document.write(l), o.document.title = r.title
      })
    }
  }(jQuery);

  $(function(){
    $("#btnPrint").printPreview({
        obj2print:'#masterContent',
        width:'810'
    });
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36251023-1']);
_gaq.push(['_setDomainName', 'jqueryscript.net']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
