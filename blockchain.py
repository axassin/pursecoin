
import sys
from urllib.parse import urlparse

class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.nodes = set()
        self.currentNode = f'http://localhost:{sys.argv[1]}'
        self.pendingTransactions = []
    
    def registerNode(self, address):
        self.nodes.add(address)