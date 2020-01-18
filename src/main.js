import "./main.pcss";
import App from './App.svelte';

import firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from './config.js';
firebase.initializeApp(firebaseConfig);

const app = new App({
  target: document.body,
  props: {
    name: 'world',
  },
});

export default app;
