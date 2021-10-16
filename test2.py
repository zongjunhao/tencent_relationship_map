import util
import networkx as nx

# G=nx.Graph()
# G.add_node(1, name="test_name", label="person")
G=util.load_raw_relation()
json_result = util.generate_response_data()
print(G)