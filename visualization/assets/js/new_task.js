$(document).ready(function () {
    // // $("#edge-div *").attr("disabled", true);
    // // $("#classification-div *").attr("disabled", true);
    // // $("#edge-file").fileinput('disable');
    // // $("#classification-file").fileinput('disable');
    // let taskName;
    // let algorithm;
    // let boolean;
    // // $("#edge-file").fileinput('enable');
    // // $("#classification-file").fileinput('enable');
    // let attriFileInput;
    // let edgeFileInput;
});


function add_task() {
    let taskName = $("#task-name").val();
    let algorithm = $("#algorithm-type").val();
    let boolean = document.getElementById("standardized").checked;
    // $("#edge-file").fileinput('enable');
    // $("#classification-file").fileinput('enable');
    let attriFileInput = $('#attri-file').get(0).files[0];
    let edgeFileInput = $('#edge-file').get(0).files[0];
    if (taskName === "") {
        // alert("Please enter a task name!");
        layer.msg("Please enter a task name !", {
            time: 2000
        });
    } else if (algorithm === "") {
        // alert("Please select an algorithm!");
        layer.msg("Please select an algorithm !", {
            time: 2000
        });
    } else if (attriFileInput == null) {
        // alert("Please select a properties file!")
        layer.msg("Please select a properties file !", {
            time: 2000
        });
        // } else if (!boolean) {
        //     alert("Please standardize the properties file!");
    } else if (edgeFileInput == null) {
        // alert("Please select an edge file!");
        layer.msg("Please select an edge file !", {
            time: 2000
        });
    } else {
        const formdata = new FormData(document.getElementById("form"));
        let loadFormIndex = layer.load(0, {
            shade: [0.5, '#F5F5F5'],
            zIndex: 222222222
        });
        layer.msg("Uploading files, please wait...", {
            time: 1500,
            zIndex: 333333333
        });
        // layer.load(2, { //icon支持传入0-2
        //     shade: [0.5, 'gray'], //0.5透明度的灰色背景
        //     content: '加载中...',
        //     success: function (layero) {
        //         layero.find('.layui-layer-content').css({
        //             'padding-top': '39px',
        //             'width': '60px'
        //         });
        //     }
        // });
        console.log("layer.open2222");
        console.log(formdata);
        $.ajax({
            type: "POST",
            url: "addTask",
            //dataType: "json",
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            data: formdata,
            success: function (res) {
                console.log(res.resultDesc);
                layer.close(loadFormIndex);
                layer.msg(res.resultDesc, {
                    time: 1500
                });
                if (res.resultCode === "1008") {
                    window.location.href = "login.html";
                } else if (res.resultCode === "6016") {
                    parent.window.location.reload();
                }
            },
            error: function (res) {
                console.log(res.resultDesc);
            }
        });
    }
}