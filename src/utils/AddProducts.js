import data from "./data";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "../config/firebase";

const addDataToCollection = async () => {
  try {
    const batch = writeBatch(db);
    data.forEach((product) => {
      const docRef = doc(db, "products", product.id.toString());
      batch.set(docRef, product);
    });

    const res = await batch.commit();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

export { addDataToCollection };
