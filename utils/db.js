import { connect } from "mongoose";
import { algoliasearch } from "algoliasearch";
import userModel from "../models/user.model.js";
import dotenv from "dotenv";
//configuring dotenv for algoliaClient as algoliaClient is not available to the app.js file as it's outside syncDataToAlgolia ,whereas in app.js we have already configured dotenv.
dotenv.config();

/*Initialize the Algolia client one time and we don't need to initialize it again and again 
that's why we are initializing it outside the syncDataToAlgolia function.*/

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
);

const syncDataToAlgolia = async () => {
  try {
    const users = await userModel.find();

    const records = users.map((user) => ({
      photoURL: user.photoURL,
      objectID: user._id.toString(),
      username: user.username,
    }));

    await algoliaClient.saveObjects({ indexName: "user", objects: records });

    console.log("Data synced to Algolia successfully!");
  } catch (err) {
    console.error("Error syncing data:", err);
  }
};

const connectDB = async function () {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Database Connected");
    syncDataToAlgolia();
  } catch (error) {
    console.log("Error in connecting to Database:", error);
  }
};

//RealTime sync between Algolia and Mongodb
const connectChangeStream = () => {
  const changeStream = userModel.watch([], { fullDocument: "updateLookup" });

  changeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      const user = change.fullDocument;
      await algoliaClient.saveObject({
        indexName: "user",
        body: {
          photoURL: user.photoURL,
          objectID: user._id.toString(),
          username: user.username,
        },
      });
      console.log("Record added in Algolia");
    }

    if (change.operationType === "update") {
      const updatedFields = change.updateDescription.updatedFields;

      if (updatedFields.username || updatedFields.photoURL) {
        const user = change.fullDocument;
        await algoliaClient.partialUpdateObject({
          indexName: "user",
          objectID: user._id.toString(),
          attributesToUpdate: {
            username: user.username,
            photoURL:user.photoURL
          },
        });
        console.log("Record updated in Algolia");
      }
    }

    if (change.operationType === "delete") {
      const objectID = change.documentKey._id.toString();

      await algoliaClient.deleteObject({ indexName: "user", objectID });
      console.log("Record deleted from Algolia");
    }
  });

  changeStream.on("error", (error) => {
    console.error("Change Stream Error:", error);
    if (error.code === "ECONNRESET") {
      setTimeout(connectChangeStream, 1000);
    }
  });
};


connectChangeStream();

export default connectDB;
