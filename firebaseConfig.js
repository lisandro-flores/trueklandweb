import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHQRBnXFeyGOqqrslQNwYE4mhQANjbhrU",
  authDomain: "truekland-6ea20.firebaseapp.com",
  projectId: "truekland-6ea20",
  storageBucket: "truekland-6ea20.appspot.com",
  messagingSenderId: "931792877390",
  appId: "1:931792877390:web:0442eb9939b36b97f3501f",
  measurementId: "G-PFSYJXHNF6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.setPersistence(browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export { app, auth };
