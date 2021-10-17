let base_url = "http://127.0.0.1:5000/"
let raw_data
let relation_chart = echarts.init(document.getElementById('relation-chart'));
let node_degree_chart = echarts.init(document.getElementById('node-degree-chart'))
relation_chart.showLoading();
node_degree_chart.showLoading()
$.getJSON('http://127.0.0.1:5000/get_raw_data', function (data) {
    raw_data = data
    init_raw_graph(JSON.parse(raw_data.graph_data))
    init_node_distribution(JSON.parse(raw_data.degree_distribution))
    init_data(raw_data)
})

function init_raw_graph(graph) {
    nodes = graph.nodes
    links = graph.links
    relation_chart.hideLoading();
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
                }
            }
        ]
    };
    relation_chart.setOption(option);
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
    $('#average-degree').text(raw_data.average_degree.toFixed(5));
    $('#degree-of-node').text(raw_data.degree_of_node_0);
    $('#average-shortest-path-length').text(raw_data.average_shortest_path_length.toFixed(5));
    $('#average-clustering-coefficient').text(raw_data.average_clustering.toFixed(5));
    $('#clustering-coefficient').text(raw_data.clustering_of_node_0.toFixed(5));
    $('#coreness-of-graph').text(raw_data.coreness);
    $('#core-of-node').text(raw_data.core_of_node_0);
    nodes = JSON.parse(raw_data.graph_data).nodes
    for (let i = 0; i < nodes.length; i++) {
        $('#degree-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
        $('#clustering-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
        $('#core-node-id').append("<option value=" + nodes[i]['id'] + ">" + nodes[i]['id'] + "&nbsp;" + nodes[i]['name'] + "</option>")
    }
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

// $.getJSON('http://127.0.0.1:5000/get_init_data', function (graph) {
//     console.log(graph)
//     console.log(graph.categories)
//     nodes = graph.nodes
//     links = graph.links
//     relation_chart.hideLoading();
//     option = {
//         tooltip: {},
//         legend: [
//             {
//                 data: graph.categories.map(function (a) {
//                     return a.name;
//                 })
//             }
//         ],
//         animation: false,
//         series: [
//             {
//                 name: 'Les Miserables',
//                 type: 'graph',
//                 layout: 'force',
//                 data: graph.nodes,
//                 links: graph.links,
//                 categories: graph.categories,
//                 roam: true,
//                 label: {
//                     show: false,
//                     position: 'right',
//                     formatter: '{b}'
//                 },
//                 labelLayout: {
//                     hideOverlap: true
//                 },
//                 scaleLimit: {
//                     min: 0.4,
//                     max: 2
//                 },
//                 emphasis: {
//                     focus: 'adjacency',
//                     label: {
//                         position: 'right',
//                         show: true
//                     }
//                 },
//                 lineStyle: {
//                     color: 'source',
//                     curveness: 0.0
//                 },
//                 force: {
//                     repulsion: 100
//                 }
//             }
//         ]
//     };
//     relation_chart.setOption(option);
// });
//
// $.getJSON('http://127.0.0.1:5000/get_node_distribution', function (json) {
//     node_degree_chart.hideLoading()
//     console.log("degree")
//     option = {
//         tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//                 type: 'cross',
//                 crossStyle: {
//                     color: '#999'
//                 }
//             }
//         },
//         xAxis: [
//             {
//                 type: 'category',
//                 data: json[0],
//                 axisPointer: {
//                     type: 'shadow'
//                 }
//             }
//         ],
//         yAxis: [
//             {
//                 type: 'value'
//             }
//         ],
//         series: [
//             {
//                 type: 'bar',
//                 data: json[2]
//             },
//         ]
//     }
//     console.log("before setoption")
//     node_degree_chart.setOption(option)
//     console.log("after setoption")
// })