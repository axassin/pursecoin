import sys
import hashlib
import json
import requests
from promise import Promise
from uuid import uuid4
from time import time
from flask import Flask,jsonify,request
from blockchain import Blockchain

try:
    sys.argv[1]
except:
    print("Port undefined, e.g. python nodes.py <PORT NUMBER>")
    sys.exit()

PurseCoin = Blockchain()

port = sys.argv[1]
host = f'http://localhost:{port}'
app = Flask(__name__)

@app.route('/network/broadcast', methods = ['POST'])
def broadcastNode():
    values = request.get_json()
    newNode = values.get('newNode')

    response = {
        "message": "success broadcasting the node"
    }

    if newNode is None:
        response["message"] = f'{newNode} is invalid'
        return jsonify(response), 400
    if newNode in PurseCoin.nodes:
        response['message'] = f'{newNode} is alread in the list'
        return jsonify(response), 400
    if newNode != PurseCoin.currentNode:
        PurseCoin.registerNode(newNode)

    nodePromise = []
  
    for node in PurseCoin.nodes:
        if node != newNode:
            data = {
                "newNode": newNode
            }
            url = f'{node}/network/register'
            regNetwork = requests.post(url, json=data)
            nodePromise.append(regNetwork)
    
    print("CURRENT NODES: ", PurseCoin.nodes)
    print(nodePromise)

    return jsonify(response), 200
        


@app.route('/network/register', methods = ['POST'])
def registerNode():
    values = request.get_json()
    newNode = values.get('newNode')

    response = {
        "message": newNode + " is registered"
    }
    
    if newNode in PurseCoin.nodes:
        response['message']: f'{newNode} is already registered'
        return jsonify(response), 400

    PurseCoin.registerNode(newNode)

    print('CURRENT NODES: ', PurseCoin.nodes)

    return jsonify(response) , 200

if __name__ == "__main__":
    app.run(host='localhost', port=port)