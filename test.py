import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# 读取数据
relation = pd.read_csv("data/result.csv")
edge = relation[["startNode", "endNode"]]
edge_array = np.array(edge)
print(len(edge_array))

G = nx.Graph()  # 定义了一个空图
G.add_edges_from(edge_array)  # 建图

coreness = 0
for i in range(200):
    G2 = nx.algorithms.k_core(G, k=i)
    nodes_num = G2.number_of_nodes()
    edge_num = G2.number_of_edges()
    if nodes_num == 0 and edge_num == 0:
        coreness = i - 1
        break
    else:
        print(i, nodes_num, edge_num)
core = nx.core_number(G)
print("core number:", core)
print("coreness:", max(core.values()))
clustering = nx.clustering(G)
print("clustering of G:", nx.clustering(G))
print("clustering of G node 0:", clustering[0])
print("clustering of G node 0:", nx.clustering(G, nodes=0))
print("average clustering of G:", nx.average_clustering(G))
print("average shortest path length:", nx.average_shortest_path_length(G))
# nx.draw(G2)
degree = G.degree[0]
# 去除节点
G.remove_node(0)
print("degree of 0:", degree)
print("number of nodes:", G.number_of_nodes(), "number_of_edges:", G.number_of_edges())


plt.show()
