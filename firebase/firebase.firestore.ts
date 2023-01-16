// noinspection JSIgnoredPromiseFromCall

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where
} from "firebase/firestore";
import { db } from "./firebase.config";
import { getDownloadURL } from "./firebase.storage";

export type Receipt = {
  uid: string,
  date: Date,
  locationName: string | undefined,
  address: string | undefined,
  items: string,
  amount: string,
  imageBucket: string | undefined
}

export type SentReceiptType = {
  uid: string,
  date: Date,
  locationName: string,
  address: string,
  items: string,
  amount: string,
  imageUrl: string,
  id: string,
  bucket: string,
}

const RECEIPT_COLLECTION = "receipts";

export const addReceipt = (data: Receipt) => {
  const { uid, date, locationName, address, items, amount, imageBucket } = data;

  addDoc(collection(db, RECEIPT_COLLECTION), { uid, date, locationName, address, items, amount, imageBucket });
};

export const getReceipts = async (uid: string, setReceipts: any, setIsLoadingReceipts: any) => {
  const receipts = await query(collection(db, RECEIPT_COLLECTION), where("uid", "==", uid), orderBy("date", "desc"));
  // const querySnapshot = await getDocs(receipts);
  return onSnapshot(receipts, async (snapshot) => {
    let allReceipts: SentReceiptType[] = [];
    for (const documentSnapshot of snapshot.docs) {
      const receipt = documentSnapshot.data();
      allReceipts.push({
        uid: receipt["uid"],
        locationName: receipt["locationName"],
        address: receipt["address"],
        items: receipt["items"],
        amount: receipt["amount"],
        date: receipt["date"],
        id: documentSnapshot.id,
        imageUrl: await getDownloadURL(receipt["imageBucket"]),
        bucket: receipt["bucket"],
      });
    }
    setReceipts(allReceipts);
    setIsLoadingReceipts(false);
  });
};

export const updateReceipts = (data: Receipt, docId: string) => {
  const { uid, date, locationName, address, items, amount, imageBucket } = data;
  console.log(docId);
  setDoc(doc(db, RECEIPT_COLLECTION, docId), { uid, date, locationName, address, items, amount, imageBucket })
    .catch(err => console.log(err));
};

export const deleteReceipt = (id: string) => {
  deleteDoc(doc(db, RECEIPT_COLLECTION, id));
};