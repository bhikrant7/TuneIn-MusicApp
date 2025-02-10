import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.js" 
//with { type: "json" };  //wtf use assert instead of with

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

// We can import this in other files where needed
