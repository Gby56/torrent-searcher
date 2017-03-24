"use strict";

let processComputeButton = () => {
    $("#loading").append(

        "<div class=\"mdl-cell mdl-cell--10-col\">" +
        "<center>" +
        "</div>" +
        "<section class=\"mdl-layout__tab-panel is-active\" id=\"scroll-tab-1\">" +
        "<div class=\"cs-loader\">" +
        " <div class=\"cs-loader-inner\">" +
        "<label>	●</label>" +
        "<label>	●</label>" +
        "<label>	●</label>" +
        "<label>	●</label>" +
        "<label>	●</label>" +
        "<label>	●</label>" +
        "</div>" +
        "</div>" +
        "</section>" +
        " </div>" +
        "<center>" +
        " </div>"

    );

    $("#result").empty();
    $.get("/getData", data => {}).then((data) => {
        console.log(eval(data));
        $("#loading").empty();
        let html =
            "<table class=\"mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp\">" +
            "<thead>" +
            "<tr>" +
            "<th>Title</th>" +
            "<th>Seeders</th>" +
            "<th>Leechers</th>" +
            "<th>Size</th>" +
            "</tr>" +
            "</thead>" +
            "<tbody>";
        for (let o of data) {
            if (o.url != "") {
                html += 
                    "<tr>" +
                    "<td class=\"mdl-data-table__cell--non-numeric\">" + "<a href='" + o.url + "'>" + o.title + "</a>" + "</td>" +
                    "<td>" + o.seeds + "</td>" +
                    "<td>" + o.leechers + "</td>" +
                    "<td>" + o.size + "</td>" +
                    "</tr>" 
                    ;
            }
        }
        $("#result").append(html + "</tbody>" + "</table>");

    });
}
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
