
import sys

class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.nodes = set()
        self.currentNode = sys.argv[1]
        self.pendingTransactions = []