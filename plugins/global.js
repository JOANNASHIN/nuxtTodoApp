import Vue from "vue";
import Seo from "~/plugins/mixins/seo.js";
import Mixin from "~/plugins/mixins/mixin.js";
import firebase from "firebase";

import moment from "moment";
import $ from 'jquery';
import Swiper from 'swiper';
import Vue2TouchEvents from 'vue2-touch-events'

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
window.moment = moment;
window.$ = window.jquery = window.jQuery = $;
window.Swiper = Swiper;

Vue.mixin(Seo);
Vue.mixin(Mixin);
Vue.use(Vue2TouchEvents, {
    disableClick: false,
    touchClass: '',
    tapTolerance: 10,
    touchHoldTolerance: 400,
    swipeTolerance: 30,
    longTapTimeInterval: 400,
    namespace: 'touch'
})



