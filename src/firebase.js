import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBNvZwBWZGS_5zAjaXK4U-mPI_J6E6vZis",
  authDomain: "newagent-e757a.firebaseapp.com",
  databaseURL: "https://newagent-e757a.firebaseio.com",
  projectId: "newagent-e757a",
  storageBucket: "newagent-e757a.appspot.com",
  messagingSenderId: "1036851133642",
  appId: "1:1036851133642:web:007f68bee672a039430833"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
