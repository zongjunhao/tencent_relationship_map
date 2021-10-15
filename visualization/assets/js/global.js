init();
setInterval(function () {
    window.location.reload();
}, 1000 * 60 * 5);

function init() {
    page("task");
    $('#user-name').html($.cookie('username'));
}

function page(type) {
    $.ajax({
        url: type + ".html",
        type: "get",
        success: function (data) {
            // load the content area
            $("#contain-holder").html($(data).filter("#contain-loader").html());
            // load the js area
            $("#js-holder").html($(data).filter("#js-loader").html());
        },
        error: function () {
            layer.msg("Please refresh to try again.")
        }
    });
}

function logout() {
    layer.confirm("Confirm to logout?", {
            btn: ['confirm', 'cancel'],
            title: "Tip"
        },
        function () {
            console.log("confirm");
            $.cookie('username', '', {expires: -1}); // 删除 cookie
            $.ajax({
                url: "logout"
            });
            window.location.href = "login.html"
        },
        function () {
            console.log("cancel")
        });
}