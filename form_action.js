let processComputeButton = () => {

    $.get("/getData", data => {}).done(function(data) {
        console.log(eval(data));

        for (let o of data) {
            if (o.url != "") {


                $("#result").append(
                    "<div class=\"mdl-cell mdl-cell--10-col\">" +
                    "<center>" +
                    "<div class=\" mdl-card mdl-shadow--2dp\" style=\"width:900px;\">" +
                    "<div class=\"mdl-card__title mdl-color--grey mdl-color-text--white\">" +
                    "<h2 class=\"mdl-card__title-text\"> <a href='" + o.url + "'>" + o.title + "</a></h2>" +
                    "</div>" +
                    "<section class=\"mdl-layout__tab-panel is-active\" id=\"scroll-tab-1\">" +
                    "<div class=\"page-content\">" +
                    "<div class=\"mdl-cell mdl-cell--12-col\">" +
                    "<div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">" +
                    "<p> Leechers: " + o.leechers + "<p>" +
                    "<p> Seeders: " + o.seeds + "<p>" +
                    "<p> Size: " + o.size + "</p>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</section>" +
                    " </div>" +
                    "<center>" +
                    " </div>"
                );
            }
        }
    });
};
$("#searchForm").submit(event => {
    event.preventDefault();
    let searchKeywords = $("#searchForm").find('input[name="search_keywords"]').val();
    if (searchKeywords === "")
        return;

    let url = $("#searchForm").attr('action');
    if (url === "")
        return;

    let posting = $.post(url, {
        "search_keywords": searchKeywords
    });

    processComputeButton();
    //history.go(0);
});
