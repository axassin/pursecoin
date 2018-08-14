import requests, hashlib, time, binascii, threading

URL = 'https://stormy-everglades-34766.herokuapp.com/'

def getTransaction():
    """
        gets the transaction and returns it as a json variable
    """
    getAddress = 'mining/get-mining-job/pursecoin'
    getJob = requests.get(URL + getAddress)
    return getJob.json()

class MinerThread(threading.Thread):
    """
        MinerThread Class, does all the hashing
    """
    def __init__(self, startNonce, endNonce, blockDataHash, difficulty):
        """
            initializes the thread, sets variables
            self.stop flag is the flag used to kill the thread
            once the other threads find the hash before THIS thread
        """

        super(MinerThread, self).__init__()
        self.stop = False
        self.startNonce = startNonce
        self.endNonce = endNonce
        self.blockDataHash = blockDataHash
        self.difficulty = difficulty
        self.block = None

    def run(self):
        """
            The main process, starts when the main thread calls start()
            The calculateHash function is defined inside this thread as apparently
            it can't call functions outside itself (I tried putting it as a separate 
            function inside the MinerThread class, didn't work)
        """
        def calculateHash(previousHash, timestamp, nonce):
            data = (f'{previousHash}|{timestamp}|{nonce}').encode('utf-8')
            hashed = hashlib.sha256(data).digest()
            return binascii.hexlify(hashed).decode('utf-8')

        timestamp = time.time()/1000
        nextHash = calculateHash(self.blockDataHash, timestamp, self.startNonce)

        while nextHash[:self.difficulty] != "0"*self.difficulty and self.startNonce <= self.endNonce:
            """
                Code is identical to js while loop, with the addition of range restriction using
                the startNonce <= endNonce condition
            """
            # print("Test with ", self.startNonce)
            self.startNonce += 1
            timestamp = time.time()/1000
            nextHash = calculateHash(self.blockDataHash, timestamp, self.startNonce)
            if self.stop == True: #self.stop only turns true if, at the higher level thread (the main thread), changes it to True
                return
        # print("Ended at nonce: ", self.startNonce, " and hash: ", nextHash)
        if nextHash[:self.difficulty] == "0"*self.difficulty:
            """
                if the while loop ends, either by nextHash being valid OR it exceeds the range limit
                This checks it, and if valid, saves it in the self.block variable,
                to be extracted by the main thread later
            """
            self.block = {
                            "nonce":self.startNonce, 
                            "dateCreated":timestamp, 
                            "blockDataHash":self.blockDataHash, 
                            "blockHash":nextHash
                        }

def miningProcess(transaction):
    """
        Receives ONE transaction, processes it to get the block hash
            ->TODO:
                Once blocks are finally a "set" of transactions,
                this should process strictly ONE transaction
                and should return the transaction hash ONLY
    """

    threads = []
    for i in range(4):
        new_thread = MinerThread(i*250000, (i+1)*250000, transaction["blockDataHash"], transaction["difficulty"])
        new_thread.start()
        threads.append(new_thread)
        print("Created new thread")

    block = None
    while block == None:
        for thread in threads:
            if thread.block != None:
                block = thread.block
        if threading.active_count() == 1:
            for i in range(4):
                new_thread = MinerThread(i*250000, (i+1)*250000, transaction["blockDataHash"], transaction["difficulty"])
                new_thread.start()
                threads.append(new_thread)
                print("Recreated another thread")
    #variable block is no longer empty -> therefore now contains the required block data (nonce, dateCreated, blockDataHash, blockDataHash)
    for thread in threads:
        thread.stop = True

    return block

def miningInit():
    """
        This function sets up the transaction details, ergo "initializes" the variables
        TODO:
            once blocks contain set of transactions, will loop through all transactions
            passing them each into miningProcess()
    """
    transaction = getTransaction()
    block = miningProcess(transaction)
    postMinedBlock(block)

def postMinedBlock(block):
    """
        Posts the mined block, only changes would be URL even if we added the newer,
        more complicated version of the block, as block structure would be defined by
        preceding functions
    """
    postAddress = 'mining/submit-mined-block'
    r = requests.post(URL + postAddress, json = block)
    print(r.text, "\nWith the block:\n", block, "\n", r.json() ,"\n------------------------------------------------------\n")

    if(r.text == "{\"errorMsg\":\"Block not found or already mined\"}"):
        mineBlock()

miningInit()