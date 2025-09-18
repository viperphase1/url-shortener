import {Db, MongoClient, ServerApiVersion} from 'mongodb';

export async function getClient() {
    const client = new MongoClient(process.env.MONGO_DB_URI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    return client;
}

export async function getDb(dbName: string): Promise<[MongoClient, Db]> {
    const client = await getClient();
    const db = client.db(dbName);
    return [client, db];
}

export async function getCollection(dbName: string, collectionName: string) {
    const [client, db] = await getDb(dbName);
    const collection = db.collection(collectionName);
    return [client, db, collection];
}
