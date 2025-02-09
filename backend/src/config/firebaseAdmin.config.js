import admin from "firebase-admin";
import serviceAccount from "./my-spotify-clone-15856-firebase-adminsdk-1yi46-8acd8887fd.json" with { type: "json" };  //wtf use assert instead of with

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

// We can import this in other files where needed
