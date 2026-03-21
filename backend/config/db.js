const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try {
        await client.connect();
        console.log('Connected successfully to server');
    
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);

module.exports = run;
