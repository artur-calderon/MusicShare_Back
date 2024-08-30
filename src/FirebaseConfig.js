// Import the functions you need from the SDKs you need
import { initializeApp ,cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore"
import Credential from "./Credentials.json" assert{type:'json'}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// Initialize Firebase
const app = initializeApp({
    credential: cert(Credential)
  });
const db = getFirestore(app)




export {db}
