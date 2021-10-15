$(document).ready(function () {
    // let table = $('#dataTables-example').DataTable({
    //     searching : false,
    //     bLengthChange : false
    // });// 加载table插件
    // table.fnDestroy();

    $.ajax({
        type: "POST",
        url: "getTaskList",
        data: {
            UserId: $.session.get('UserId')
        },
        success: function (res) {
            if (res.resultCode === "2006") {// 查找任务列表成功
                console.log(res);

                let table = "";
                // let tableLength = res.data.length;
                $.each(res.data, function (i, value) {

                    let status;

                    if (value.EndTime == null) {
                        status = "<td>" + "Training" + "</td>" +
                            "<td>" + "</td>"
                    } else {
                        status = "<td>" + "Finish" + "</td>" +
                            "<td>" +
                            '<button class="btn btn-xs btn-primary" onclick="viewResult(' + value.id + ')">View</button>' +
                            '<button class="btn btn-xs btn-danger" onclick="deleteTask(' + value.id + ')">Delete</button>' +
                            "</td>"
                    }
                    table += "<tr>" +
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + value.TaskName + "</td>" +
                        "<td>" + value.AlgorithmType + "</td>" +
                        "<td>" + value.StartTime + "</td>" +
                        "<td>" + value.EndTime + "</td>" +
                        status +
                        "</tr>"
                });
                $(".table tbody").append(table)
            } else if (res.resultCode === "1006") {
                console.log("No records in the database.")
            } else if (res.resultCode === "1008") {
                alert(res.resultDesc);
                window.location.href = "login.html";
            }
            console.log("open dataTable");
            // $("#dataTables-example").dataTable();
            $('#dataTables-example').DataTable({
                searching: false,
                bLengthChange: false
            });// 加载table插件
        },
        error: function (res) {
            console.log(res)
        }
    });

});


function deleteTask(taskId) {
    $.ajax({
        type: "POST",
        url: "deleteTask",
        data: {
            taskId: taskId
        },
        success: function (res) {
            if (res.resultCode === "6004") {
                console.log("Task deleted successfully.");
                location.reload()
            } else {
                console.log("Task deleted failed.")
            }
        },
        error: function (res) {

        }
    });
}

function viewResult(taskId) {
    $.session.set('viewedTaskId', taskId);
    page("detail");
    // window.location.href = "detail.html"
}


function newTask() {
    layer.open({
        type: 2,
        title: "New Task",
        content: "new_task.html",
        area: ['500px', '500px'],
        end: function () {
            parent.window.location.reload();
        }
    })
}