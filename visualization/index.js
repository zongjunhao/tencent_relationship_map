// 127.0.0.1:5000/get_init_data
console.log("test")
let relation_chart = echarts.init(document.getElementById('relation-chart'));
relation_chart.showLoading();
$.getJSON('http://127.0.0.1:5000/get_init_data', function (graph) {
    console.log(graph)
    console.log(graph.categories)
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
});

result = [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53], [16, 29, 71, 33, 14, 11, 9, 4, 5, 3, 3, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0.0784313725490196, 0.14215686274509803, 0.3480392156862745, 0.16176470588235295, 0.06862745098039216, 0.05392156862745098, 0.04411764705882353, 0.0196078431372549, 0.024509803921568627, 0.014705882352941176, 0.014705882352941176, 0.014705882352941176, 0.0, 0.0, 0.004901960784313725, 0.004901960784313725, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.004901960784313725]]
let node_degree_chart = echarts.init(document.getElementById('node-degree-chart'))
node_degree_chart.showLoading()
$.getJSON('http://127.0.0.1:5000/get_node_distribution', function (json) {
    node_degree_chart.hideLoading()
    console.log("degree")
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
                data: result[0],
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
                data: result[2]
            },
        ]
    }
    console.log("before setoption")
    node_degree_chart.setOption(option)
    console.log("after setoption")
})