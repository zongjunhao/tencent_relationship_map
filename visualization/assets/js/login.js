// $(document).ready(function() {
//
//     if (!(typeof($.cookie("username")) === "undefined")) {
//         window.location.href = "index.html";
//     }
// });
function checkStandard(element) {
    let content = $("#signin-" + element).val();
    switch (element) {
        case "no": {
            if (content == null || content === "") {
                //alert(content);
                layer.msg("Please enter your username");
                return false;
            } else {
                return true;
            }
        }
        case "pwd": {
            if (content == null || content === "") {
                layer.msg("Please enter the password");
                return false;
            } else {
                return true;
            }
        }
        default: {
        }
    }
}

//回车键登录
document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        signin()
    }
});

function signin() {
    let sign_no = $("#signin-no").val();
    let sign_pwd = $("#signin-pwd").val();

    if (checkStandard('no') && checkStandard('pwd')) {
        $.ajax({
            type: "POST",
            url: "login",
            datatype: 'json',
            data: {
                "username": sign_no,
                "password": sign_pwd,
            }, // 发送数据
            error: function () {
                layer.msg('request failed', {
                    time: 1000
                });
            },
            success: function (jsonobj) {
                if (jsonobj.resultCode === "4000") {//登录成功
                    $.cookie("username", sign_no);
                    window.location.href = "index.html";
                } else {
                    layer.msg(jsonobj.resultDesc, {
                        time: 1000
                    });
                }
            },
        });

    }

}
