var attri = [];
var classification = [];
let myChart = echarts.init(document.getElementById('chart'));
// 链接预测的两个节点
var SimilarityCalculationNodes = [];
// 点击节点是否进行链接预测的标志
var flag = false;
// 获取属性文件、边文件以及分类文件的路径
$(document).ready(function () {
    myChart.showLoading();
    getTask();
});

function getTask() {
    $.ajax({
        type: "POST",
        url: "getTask",
        datatype: 'json',
        data: {
            "taskId": $.session.get('viewedTaskId'),
        }, // 发送数据
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
        },
        success: function (jsonobj) {
            if (jsonobj.resultCode === "6001") {//任务查询成功

                var links = [];
                var nodes = [];

                jsonobj.data.nodes.forEach(function (origin_node) {
                    var node = new Object();
                    node.id = origin_node;
                    node.name = origin_node;
                    node.itemStyle = null;
                    node.symbolSize = 10;
                    node.value = origin_node;
                    // Use random x, y
                    node.x = node.y = null;
                    node.draggable = true;
                    nodes.push(node);
                });

                var i = 0;
                jsonobj.data.sides.forEach(side => {
                    var link = new Object();
                    link.id = i++;
                    link.name = null;
                    link.source = side[0];
                    link.target = side[1];
                    var normal = new Object();
                    link.lineStyle = normal;
                    links.push(link);
                });

                $('#start-time').text(jsonobj.data.task.StartTime);
                $('#end-time').text(jsonobj.data.task.EndTime);
                $('.message-body').text(jsonobj.data.task.Messages);
                console.log('打印nodes、links');
                console.log(nodes);
                console.log(links);
                initCharm(nodes, links);
                getFeatureGroup();
                myChart.hideLoading();
            } else {
                layer.msg(jsonobj.resultDesc, {
                    time: 1000
                });
            }
        },
    });
}
// 初始化关系图
function initCharm(nodes, links) {

    // 基于准备好的dom，初始化echarts实例

    // 指定图表的配置项和数据
    // let option = {
    //     title: {
    //         text: ''
    //     },
    //     tooltip: {},
    //     animationDurationUpdate: 1500,
    //     animationEasingUpdate: 'quinticInOut',
    //     series: [
    //         {
    //             type: 'graph',
    //             layout: 'circular',
    //             symbolSize: 50,
    //             roam: true,
    //             label: {
    //                 show: true
    //             },
    //             edgeSymbol: ['none', 'none'],
    //             edgeSymbolSize: 10,
    //             edgeLabel: {
    //                 fontSize: 20
    //             },
    //             data: nodes,
    //             links: edges,
    //             lineStyle: {
    //                 opacity: 0.9,
    //                 width: 2,
    //             }
    //         }
    //     ]
    // };
    option = {
        title: {
            // text: '',
            // subtext: 'Default layout',
            // top: 'bottom',
            // left: 'right'
        },
        tooltip: {},
        legend: [],
        animation: false,
        series : [
            {
                name: 'node',
                type: 'graph',
                layout: 'force',
                data: nodes,
                links: links,
                roam: true,
                label: {
                    position: 'right'
                },
                force: {
                    repulsion: 100
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    myChart.on('click', function (params) {
        console.log(params);
        if (params.componentType === 'series') {
            if (params.seriesType === 'graph') {
                if (params.dataType === 'edge') {
                    // Clicked on the edge of the graph.
                    console.log('Clicked on the edge of the graph.');
                } else {
                    // Clicked on the node of the graph.
                    console.log('Clicked on the node of the graph.');
                    getNodeAttri(params.data.id);
                }
            }
        }
    });
}

function getFeatureGroup() {
    console.log('开始请求属性和分类');
    $.ajax({
        type: "POST",
        url: "getFeatureGroup",
        datatype: 'json',
        data: {
            "taskId": $.session.get('viewedTaskId'),
        }, // 发送数据
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
        },
        success: function (jsonobj) {
            if (jsonobj.resultCode === "5001") {//查询属性和分类成功
                attri = jsonobj.data.attri;
                classification = jsonobj.data.classification;
            } else {
                layer.msg(jsonobj.resultDesc, {
                    time: 1000
                });
            }
        },
    });
}

function getNodeAttri(nodeId) {
    let tableh = "<tr>";
    let tableb = "<tr>";
    attri.forEach(element => {
        if (element[0] === nodeId) {
            console.log(element);
            $(".node h3 span").text(element[0]);
            for (var i = 1; i < element.length; i++) {
                tableh += "<th>" + "attr" + (i) + "</th>";
                tableb += "<td>" + element[i] + "</td>";
            }
            tableh += "</tr>";
            tableb += "</tr>"
            $(".table thead").empty();
            $(".table tbody").empty();
            $(".table thead").append(tableh);
            $(".table tbody").append(tableb);
        }
    });
    if (classification != null) {
        classification.forEach(element => {
            if (element[0] === nodeId) {
                console.log(element);
                $(".node-classification p").html(element[1]);
            }
        });
    } else {
        getClassification(nodeId);
    }
    if (flag) {
        SimilarityCalculationNodes.push(nodeId);
    }
    if (SimilarityCalculationNodes.length == 2) {
        flag = false;
        getSimilarity();
    }
}

function switchMode() {
    layer.msg("Please select two nodes in turn for link prediction.", {
        time: 2000
    });
    flag = true;
}

function getClassification(nodeId) {
    $.ajax({
        type: "POST",
        url: "getClassification",
        datatype: 'json',
        data: {
            "taskId": $.session.get('viewedTaskId'),
            "nodeId": nodeId,
        }, // 发送数据
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
        },
        success: function (jsonobj) {
            if (jsonobj.resultCode === "6007") {//获取分类号成功
                console.log(jsonobj.data);
                $(".node-classification p").text(jsonobj.data);
            } else {
                layer.msg(jsonobj.resultDesc, {
                    time: 1000
                });
            }
        },
    });
}
function getSimilarity() {
    console.log("获取相似度");
    console.log(SimilarityCalculationNodes);
    $.session.set('link-pre1', SimilarityCalculationNodes[0]);
    $.session.set('link-pre2', SimilarityCalculationNodes[1]);
    $.ajax({
        type: "POST",
        url: "getSimilarity",
        datatype: 'json',
        data: {
            "taskId": $.session.get('viewedTaskId'),
            "nodeId1": SimilarityCalculationNodes[0],
            "nodeId2": SimilarityCalculationNodes[1],
        }, // 发送数据
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
        },
        success: function (jsonobj) {
            if (jsonobj.resultCode === "6008") {//获取相似度成功
                console.log(jsonobj.data);
                layer.open({
                    type: 1,
                    title: 'Link Prediction',
                    area: ['400px', '120px'],
                    shadeClose: true, //点击遮罩关闭
                    // content: '\<\div style="padding:20px;">node:' + SimilarityCalculationNodes[0] + " and node:" 
                    // + SimilarityCalculationNodes[1] + " 's similarity is: " + jsonobj.data + '\<\/div>'
                    content: '\<\div style="padding:20px;">node:' + $.session.get('link-pre1') + " and node:"
                        + $.session.get('link-pre2') + " 's similarity is: " + jsonobj.data + '\<\/div>'
                });
            } else {
                layer.msg(jsonobj.resultDesc, {
                    time: 1000
                });
            }
        },
    });
    // set to empty
    SimilarityCalculationNodes = [];
}