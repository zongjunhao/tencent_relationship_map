import pandas
import json
from pandas.io.json import json_normalize

# pandas显示配置 方便调试
# 显示所有列
pandas.set_option('display.max_columns', None)
# 显示所有行
# pandas.set_option('display.max_rows', None)
# 设置value的显示长度为100，默认为50
pandas.set_option('max_colwidth', 200)

# 处理nodes文件，提取嵌套元素
with open("raw_data/nodes.json", "r", encoding='utf-8') as nodes_file:
    raw_nodes = json.load(nodes_file)
nodes_data = json_normalize(raw_nodes, 'labels',
                            ['id', ["properties", "keyNo"], ["properties", "name"], ["properties", "hasImage"],
                             ["properties", "status"], ["properties", "registCapi"], ["properties", "econKind"]],
                            errors='ignore')
nodes_data.columns = ['labels', 'id', 'keyNo', 'name', 'hasImage', 'status', 'registCapi', 'econKind']
# 输出数据，为保证excel打开兼容，输出为UTF8带签名格式
nodes_data.to_csv('data/nodes.csv', encoding="utf_8_sig", index=True)

# 处理relationship文件，提取嵌套元素
with open("raw_data/relationship.json", "r", encoding='utf-8') as relationship_file:
    raw_relation = json.load(relationship_file)
relation_data = json_normalize(raw_relation)
relation_data.columns = ["id", "type", "startNode", "endNode", "role", "shouldCapi", "stockPercent"]
# 输出数据，为保证excel打开兼容，输出为UTF8带签名格式
relation_data.to_csv('data/relationship.csv', encoding="utf_8_sig", index=True)

# 更换Nodes的ID
nodes_data = pandas.read_csv("data/nodes.csv")
nodes_data.columns = ['nodes_id', 'labels', 'id', 'keyNo', 'name', 'hasImage', 'status', 'registCapi', 'econKind']
nodes_data.to_csv('data/nodes.csv', encoding="utf_8_sig", index=False)

# 匹配新的Nodes ID
relation_data = pandas.read_csv("data/relationship.csv")
relation_data.columns = ["newId", "id", "type", "startNode", "endNode", "role", "shouldCapi", "stockPercent"]
del relation_data["id"]
relation_data.rename(columns={'newId': 'relation_id'}, inplace=True)
relation_data.to_csv('data/relationship.csv', encoding="utf_8_sig", index=False)

nodes_id = nodes_data[["nodes_id", "id"]]
relation_data = pandas.read_csv("data/relationship.csv")
result = relation_data.set_index("startNode").join(nodes_id.set_index("id"))
result.rename(columns={'nodes_id': 'newStartNode'}, inplace=True)
result = result.set_index("endNode").join(nodes_id.set_index("id"))
result.rename(columns={'nodes_id': 'newEndNode'}, inplace=True)
result.rename(columns={'newStartNode': 'startNode'}, inplace=True)
result.rename(columns={'newEndNode': 'endNode'}, inplace=True)

result.to_csv('data/result.csv', encoding="utf_8_sig", index=False)
print(result)
