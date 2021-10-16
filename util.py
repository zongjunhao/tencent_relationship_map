import json
import math

import networkx as nx
import numpy as np
import pandas as pd


def get_core_of_node(G: nx.Graph, node_id: int) -> int:
    return nx.core_number(G)[node_id]


def get_coreness(G: nx.Graph) -> int:
    cores = nx.core_number(G)
    coreness = max(cores.values())
    return coreness


def get_degree_of_node(G: nx.Graph, node_id: int):
    return G.degree[node_id]


def get_average_degree(G: nx.Graph) -> float:
    degree = G.degree
    degree_list = list(degree)
    sum_degree = 0
    for (node_id, node_degree) in degree_list:
        sum_degree += node_degree
    length = degree_list.__len__()
    return sum_degree / length


def get_degree_distribution(G: nx.Graph) -> str:
    degree = G.degree
    degree_list = list(degree)
    sum_degree = 0
    max_degree = 0
    for (node_id, node_degree) in degree_list:
        sum_degree += node_degree
        if node_degree > max_degree:
            max_degree = node_degree
    length = degree_list.__len__()
    degree_distribution = []
    for i in range(0, max_degree):
        nodes_num_of_degree_i = 0
        for (node_id, node_degree) in degree_list:
            if node_degree == i + 1:
                nodes_num_of_degree_i += 1
        degree_distribution.append([i + 1, nodes_num_of_degree_i, nodes_num_of_degree_i / length])
    # degrees = []
    # node_nums = []
    # proportions = []
    # for item in degree_distribution:
    #     degrees.append(item[0])
    #     node_nums.append(item[1])
    #     proportions.append(item[2])
    # 列表转置
    result = list(map(list, zip(*degree_distribution)))
    return json.dumps(result)


def get_average_clustering(G: nx.Graph) -> float:
    return nx.average_clustering(G)


def get_clustering_of_node(G: nx.Graph, node_id: int) -> float:
    return nx.clustering(G, nodes=node_id)


def get_average_shortest_path_length(G: nx.Graph) -> float:
    return nx.average_shortest_path_length(G)


def get_number_of_nodes(G: nx.Graph) -> int:
    return G.number_of_nodes()


def get_number_of_edges(G: nx.Graph) -> int:
    return G.number_of_edges()


def get_number_of_connected_components(G: nx.Graph) -> int:
    return nx.number_connected_components(G)


def get_size_of_the_largest_graph(G: nx.Graph) -> int:
    return len(max(nx.connected_components(G), key=len))


def load_raw_relation() -> nx.Graph:
    nodes = pd.read_csv("data/nodes.csv")
    nodes_info = nodes[["nodes_id", "labels", "name", "registCapi"]]
    relation = pd.read_csv("data/result.csv")
    edge = relation[["startNode", "endNode"]]
    edge_array = np.array(edge)
    edge_list = edge_array.tolist()
    G = nx.Graph()
    for index, row in nodes_info.iterrows():
        registCapi = None
        if math.isnan(row["registCapi"]):
            registCapi = 10
        else:
            registCapi = math.log(float(row["registCapi"])) + 1
        category = 0
        if row["labels"] == "Company":
            category = 0
        else:
            category = 1
        G.add_node(row["nodes_id"], category=category, name=row["name"], registCapi=registCapi, symbolSize=registCapi)
    G.add_edges_from(edge_list)
    return G


def generate_response_data() -> str:
    G = load_raw_relation()
    json_result = nx.json_graph.node_link_data(G)
    json_result['categories'] = [{"name": "Company"}, {"name": "Person"}]
    return json.dumps(json_result, ensure_ascii=False)


def generate_graph_from_json() -> nx.Graph:
    G = nx.Graph()
    return G
