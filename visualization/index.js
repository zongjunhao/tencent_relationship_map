let base_url = "http://127.0.0.1:5000/" // 部署地址url
let raw_data                            // 原始数据
let intentional_attack_graph            // 存储蓄意攻击的图
let random_attack_graph                 // 存储随机攻击的图
let raw_node_num                        // 原始图节点数目，用于计算 size of the largest subgraph
let intentional_subgraph_data = []      // 蓄意攻击 size of the largest subgraph
let random_subgraph_data = []           // 随机攻击 size of the largest subgraph
let relation_chart = echarts.init(document.getElementById('relation-chart'));
let node_degree_chart = echarts.init(document.getElementById('node-degree-chart'))
let intentional_attack_chart = echarts.init(document.getElementById('intentional-attack-chart'));
let intentional_subgraph_chart = echarts.init(document.getElementById('intentional-subgraph-chart'));
let random_attack_chart = echarts.init(document.getElementById('random-attack-chart'));
let random_subgraph_chart = echarts.init(document.getElementById('random-subgraph-chart'));
relation_chart.showLoading();
node_degree_chart.showLoading()
intentional_attack_chart.showLoading()
intentional_subgraph_chart.showLoading()
random_attack_chart.showLoading()
random_subgraph_chart.showLoading()

$.getJSON(base_url + 'get_raw_data', function (data) {
    raw_data = data
    intentional_attack_graph = JSON.parse(raw_data.graph_data)
    random_attack_graph = JSON.parse(raw_data.graph_data)
    init_raw_graph(JSON.parse(raw_data.graph_data))
    init_node_distribution(JSON.parse(raw_data.degree_distribution))
    init_data(raw_data)
})

function init_raw_graph(graph) {
    relation_chart.hideLoading();
    intentional_attack_chart.hideLoading()
    random_attack_chart.hideLoading()
    option = {
        tooltip: {},
        legend: [
            {
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        animation: false,
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.0
                },
                force: {
                    repulsion: 100
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (params.dataType === "node")
                            return (
                                "id:" + params.data.id + "<br>" +
                                "name:" + params.data.name + "<br>" +
                                "registCapi:" + params.data.registCapi
                            )
                        else
                            return (params.data.source + " > " + params.data.target)
                    }
                },
            }
        ]
    };
    relation_chart.setOption(option);
    intentional_attack_chart.setOption(option);
    random_attack_chart.setOption(option);
}

function init_node_distribution(data) {
    node_degree_chart.hideLoading()
    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        xAxis: [
            {
                type: 'category',
                data: data[0],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                type: 'bar',
                data: data[2]
            },
        ],
        grid: {
            x: 35,
            y: 20,
            x2: 30,
            y2: 20
        }
    }
    node_degree_chart.setOption(option)
}

function init_data(raw_data) {
    // raw relation
    $('#average-degree').text(raw_data.average_degree.toFixed(5));
    $('#degree-of-node').text(raw_data.degree_of_node_0);
    $('#average-shortest-path-length').text(raw_data.average_shortest_path_length.toFixed(5));
    $('#average-clustering-coefficient').text(raw_data.average_clustering.toFixed(5));
    $('#clustering-coefficient').text(raw_data.clustering_of_node_0.toFixed(5));
    $('#coreness-of-graph').text(raw_data.coreness);
    $('#core-of-node').text(raw_data.core_of_node_0);
    let nodes = JSON.parse(raw_data.graph_data).nodes
    for (let i = 0; i < nodes.length; i++) {
        $('#degree-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
        $('#clustering-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
        $('#core-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
        $('#attack-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
    }
    raw_node_num = nodes.length
    // intentional attack
    $('#intentional-average-degree').text(raw_data.average_degree.toFixed(5))
    $('#intentional-average-clustering-coefficient').text(raw_data.average_clustering.toFixed(5));
    $('#intentional-coreness-of-graph').text(raw_data.coreness);
    $('#intentional-connected-components').text(raw_data.number_of_connected_components);
    $('#intentional-largest-subgraph').text(raw_data.size_of_the_largest_graph);
    $('#intentional-number-of-nodes').text(raw_data.number_of_nodes);
    $('#intentional-number-of-edges').text(raw_data.number_of_edges);
    intentional_subgraph_data.push([intentional_subgraph_data.length, raw_data.size_of_the_largest_graph / raw_node_num])
    draw_intentional_subgraph()
    // random attack
    $('#random-average-degree').text(raw_data.average_degree.toFixed(5))
    $('#random-average-clustering-coefficient').text(raw_data.average_clustering.toFixed(5));
    $('#random-coreness-of-graph').text(raw_data.coreness);
    $('#random-connected-components').text(raw_data.number_of_connected_components);
    $('#random-largest-subgraph').text(raw_data.size_of_the_largest_graph);
    $('#random-number-of-nodes').text(raw_data.number_of_nodes);
    $('#random-number-of-edges').text(raw_data.number_of_edges);
    random_subgraph_data.push([random_subgraph_data.length, raw_data.size_of_the_largest_graph / raw_node_num])
    draw_random_subgraph()
}

$("#degree-of-node-btn").click(function () {
    let node_id = $('#degree-node-id').val();
    $.get(base_url + "get_degree_of_node?node_id=" + node_id, function (data) {
        $('#degree-of-node').text(data);
    })
})

$("#clustering-coefficient-btn").click(function () {
    let node_id = $('#clustering-node-id').val();
    $.get(base_url + "get_clustering_of_node?node_id=" + node_id, function (data) {
        console.log(data)
        $('#clustering-coefficient').text(parseFloat(data).toFixed(5));
    })
})

$("#core-of-node-btn").click(function () {
    let node_id = $('#core-node-id').val();
    $.get(base_url + "get_core_of_node?node_id=" + node_id, function (data) {
        $('#core-of-node').text(data);
    })
})

$("#intentional-attack").click(function () {
    $.ajax({
        type: "POST",
        url: base_url + "attack_graph",
        datatype: 'json',
        data: {
            "graph": JSON.stringify(intentional_attack_graph),
            "node_id": $('#attack-node-id').val()
        },
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
            console.log("error")
        },
        success: function (json_result) {// intentional attack
            let data = JSON.parse(json_result)
            console.log(data)
            $('#intentional-average-degree').text(parseFloat(data.average_degree).toFixed(5))
            $('#intentional-average-clustering-coefficient').text(parseFloat(data.average_clustering).toFixed(5));
            $('#intentional-coreness-of-graph').text(data.coreness);
            $('#intentional-connected-components').text(data.number_of_connected_components);
            $('#intentional-largest-subgraph').text(data.size_of_the_largest_graph);
            $('#intentional-number-of-nodes').text(data.number_of_nodes);
            $('#intentional-number-of-edges').text(data.number_of_edges);
            intentional_attack_chart.showLoading()
            draw_intentional_chart(JSON.parse(data.graph_data))
            intentional_attack_graph = JSON.parse(data.graph_data)
            $("#attack-node-id").empty()
            let nodes = JSON.parse(data.graph_data).nodes
            for (let i = 0; i < nodes.length; i++) {
                $('#attack-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
            }
            intentional_subgraph_data.push([intentional_subgraph_data.length, data.size_of_the_largest_graph / raw_node_num])
            draw_intentional_subgraph()
        }
    })
})

$("#random-attack").click(function () {
    $.ajax({
        type: "POST",
        url: base_url + "attack_graph",
        datatype: 'json',
        data: {
            "graph": JSON.stringify(random_attack_graph),
            "node_id": get_random_node_id()
        },
        error: function () {
            layer.msg('request failed', {
                time: 1000
            });
            console.log("error")
        },
        success: function (json_result) {// intentional attack
            let data = JSON.parse(json_result)
            console.log(data)
            $('#random-average-degree').text(parseFloat(data.average_degree).toFixed(5))
            $('#random-average-clustering-coefficient').text(parseFloat(data.average_clustering).toFixed(5));
            $('#random-coreness-of-graph').text(data.coreness);
            $('#random-connected-components').text(data.number_of_connected_components);
            $('#random-largest-subgraph').text(data.size_of_the_largest_graph);
            $('#random-number-of-nodes').text(data.number_of_nodes);
            $('#random-number-of-edges').text(data.number_of_edges);
            random_attack_chart.showLoading()
            draw_random_chart(JSON.parse(data.graph_data))
            random_attack_graph = JSON.parse(data.graph_data)
            random_subgraph_data.push([random_subgraph_data.length, data.size_of_the_largest_graph / raw_node_num])
            draw_random_subgraph()
        }
    })
})

function draw_intentional_chart(graph) {
    intentional_attack_chart.hideLoading()
    option = {
        tooltip: {},
        legend: [
            {
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        animation: false,
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.0
                },
                force: {
                    repulsion: 100
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        console.log(params)
                        if (params.dataType === "node")
                            return (
                                "id:" + params.data.id + "<br>" +
                                "name:" + params.data.name + "<br>" +
                                "registCapi:" + params.data.registCapi
                            )
                        else
                            return (params.data.source + " > " + params.data.target)
                    }
                },
            }
        ]
    };
    intentional_attack_chart.setOption(option);
}

function draw_random_chart(graph) {
    console.log(graph)
    random_attack_chart.hideLoading()
    option = {
        tooltip: {},
        legend: [
            {
                data: graph.categories.map(function (a) {
                    return a.name;
                })
            }
        ],
        animation: false,
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'force',
                data: graph.nodes,
                links: graph.links,
                categories: graph.categories,
                roam: true,
                label: {
                    show: false,
                    position: 'right',
                    formatter: '{b}'
                },
                labelLayout: {
                    hideOverlap: true
                },
                scaleLimit: {
                    min: 0.4,
                    max: 2
                },
                emphasis: {
                    focus: 'adjacency',
                    label: {
                        position: 'right',
                        show: true
                    }
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.0
                },
                force: {
                    repulsion: 100
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        console.log(params)
                        if (params.dataType === "node")
                            return (
                                "id:" + params.data.id + "<br>" +
                                "name:" + params.data.name + "<br>" +
                                "registCapi:" + params.data.registCapi
                            )
                        else
                            return (params.data.source + " > " + params.data.target)
                    }
                },
            }
        ]
    };
    random_attack_chart.setOption(option);
}

function get_random_node_id() {
    let nodes = random_attack_graph.nodes
    length = nodes.length
    console.log(length)
    let index = Math.floor(Math.random() * length)
    console.log(nodes[index])
    return nodes[index].id
}

function draw_intentional_subgraph() {
    intentional_subgraph_chart.hideLoading()
    option = {
        title: {
            text: "size of the largest subgraph",
            left: 'center',
            top: 10
        },
        xAxis: {},
        yAxis: {},
        series: [
            {
                symbolSize: 10,
                data: intentional_subgraph_data,
                type: 'scatter'
            }
        ],
        grid: {
            x: 35,
            y: 50,
            x2: 30,
            y2: 20
        },
        tooltip: {
            formatter: function (params) {
                return (params.data[0] + " , " + params.data[1].toFixed(6))
            }
        },
    };
    intentional_subgraph_chart.setOption(option)
}

function draw_random_subgraph() {
    random_subgraph_chart.hideLoading()
    option = {
        title: {
            text: "size of the largest subgraph",
            left: 'center',
            top: 10
        },
        xAxis: {},
        yAxis: {},
        series: [
            {
                symbolSize: 10,
                data: random_subgraph_data,
                type: 'scatter'
            }
        ],
        grid: {
            x: 35,
            y: 50,
            x2: 30,
            y2: 20
        },
        tooltip: {
            formatter: function (params) {
                return (params.data[0] + " , " + params.data[1].toFixed(6))
            }
        },
    };
    random_subgraph_chart.setOption(option)
}