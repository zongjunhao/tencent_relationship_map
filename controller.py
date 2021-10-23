from flask import Flask, redirect, url_for, request
from flask_cors import CORS

import util

app = Flask(__name__, static_folder="visualization", static_url_path="")
CORS(app, supports_credentials=True)


@app.route('/success/<name>')
def success(name):
    return 'welcome %s' % name


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        user = request.form['name']
        return redirect(url_for('success', name=user))
    else:
        user = request.args.get('name')
        return redirect(url_for('success', name=user))


@app.route('/get_init_data')
def get_init_data():
    return util.generate_graph_data()


@app.route('/get_raw_data')
def get_raw_data():
    return util.generate_raw_data()


@app.route('/get_node_distribution')
def get_node_distribution():
    G = util.load_raw_relation()
    degree_distribution = util.get_degree_distribution(G)
    return degree_distribution


@app.route('/get_degree_of_node')
def get_degree_of_node():
    node_id = request.args.get("node_id")
    G = util.load_raw_relation()
    return str(util.get_degree_of_node(G, int(node_id)))


@app.route('/get_clustering_of_node')
def get_clustering_of_node():
    node_id = request.args.get("node_id")
    G = util.load_raw_relation()
    return str(util.get_clustering_of_node(G, int(node_id)))


@app.route('/get_core_of_node')
def get_core_of_node():
    node_id = request.args.get("node_id")
    G = util.load_raw_relation()
    return str(util.get_core_of_node(G, int(node_id)))


@app.route('/attack_graph', methods=['POST'])
def attack_graph():
    node_id = request.form['node_id']
    graph = request.form['graph']
    return util.attack_graph(graph, node_id)


if __name__ == '__main__':
    app.run(debug=True)
