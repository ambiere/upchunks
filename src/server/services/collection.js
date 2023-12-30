require("dotenv").config();
const MongoDbclient = require("./mongodb");

class Collection {
  constructor(isProduction = process.env.NODE_ENV === "production") {
    this.mongodbClient = async function () {
      const MongoDbClientInstance = new MongoDbclient(isProduction);
      return await MongoDbClientInstance.getDatabase();
    };
  }

  static async insertDocument(collectionName, document) {
    const { db, client } = await new Collection().mongodbClient();
    const collection = db.collection(collectionName);
    const { acknowledged, insertedId } = await collection.insertOne(document);
    if (!acknowledged) {
      await client.close();
      const error = new Error("Write result not aknowledged :)");
      error.code = "WR_RESULT_NOT_ACK";
      throw error;
    }
    await client.close();
    return insertedId.toString();
  }

  static async getDocument(collectionName, filter, options) {
    const { db, client } = await new Collection().mongodbClient();
    const collection = db.collection(collectionName);
    const document = await collection.findOne(filter, options);
    await client.close();
    return document;
  }

  static async getDocuments(collectionName, filter = {}, options) {
    const { db, client } = await new Collection().mongodbClient();
    const collection = db.collection(collectionName);
    const documentsCursor = collection.find(filter, options);
    const count = await collection.countDocuments(filter);
    const documents = await documentsCursor.toArray();
    await documentsCursor.close();

    await client.close();
    return { documents, totalDocuments: count };
  }
}

module.exports = Collection;
module.exports.Collection = Collection;
