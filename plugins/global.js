import Vue from "vue";
import Seo from "~/plugins/mixins/seo.js";
import Mixin from "~/plugins/mixins/mixin.js";
import firebase from "firebase";

Vue.mixin(Seo);
Vue.mixin(Mixin);


const firebaseConfig = {
    apiKey: "AIzaSyCf8-oQQtKWxwqOfaJ8MOlEDEO7TeMymus",
    authDomain: "todoapp-26259.firebaseapp.com",
    projectId: "todoapp-26259",
    storageBucket: "todoapp-26259.appspot.com",
    messagingSenderId: "354717534108",
    appId: "1:354717534108:web:6e89298d094518261aea59"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}
const database = firebase.firestore();

window.firebase = firebase;
window.database = database;