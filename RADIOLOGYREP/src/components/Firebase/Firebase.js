
import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyArTMgfsOVjmTJpokSis7ECcd21NXRhLUE",
  authDomain: "repository-ecd26.firebaseapp.com",
  databaseURL: "https://repository-ecd26.firebaseio.com",
  projectId: "repository-ecd26",
  storageBucket: "repository-ecd26.appspot.com",
  messagingSenderId: "490981223011",
};

// apiKey: process.env.REACT_APP_API_KEY,
//  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//  databaseURL: process.env.REACT_APP_DATABASE_URL,
//  projectId: process.env.REACT_APP_PROJECT_ID,
//  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;