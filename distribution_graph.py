import json

import networkx as nx
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import util

G = util.load_raw_relation()
core_distribution = util.get_core_distribution(G)
print(core_distribution)

cores = core_distribution[0]
num_of_nodes = core_distribution[1]
print(cores)
print(num_of_nodes)

N = 4
ind = np.arange(N)    # the x locations for the groups
width = 0.35       # the width of the bars: can also be len(x) sequence

p1 = plt.bar(ind, num_of_nodes, width)

plt.ylabel('number of nodes')
plt.title('core distribution')
plt.xticks(ind, cores)
plt.show()

clustering_distribution = util.get_clustering_distribution(G)
clustering_list = list(clustering_distribution.items())
clustering_list.sort(key=lambda x: x[1], reverse=True)
result = list(map(list, zip(*clustering_list)))
print(clustering_distribution)

N = clustering_list.__len__()
ind = np.arange(N)    # the x locations for the groups
width = 1       # the width of the bars: can also be len(x) sequence

p2 = plt.bar(ind, result[1], width)

plt.ylabel('clustering coefficient')
plt.title('clustering coefficient distribution')
plt.show()
