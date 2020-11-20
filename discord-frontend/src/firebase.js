import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCjLIoq5h-OrNVvUsVUAyBoT41U6_uuP-s",
    authDomain: "mern-discord-clone-f3d41.firebaseapp.com",
    databaseURL: "https://mern-discord-clone-f3d41.firebaseio.com",
    projectId: "mern-discord-clone-f3d41",
    storageBucket: "mern-discord-clone-f3d41.appspot.com",
    messagingSenderId: "875877966496",
    appId: "1:875877966496:web:567f239ece79e8d1645fc5"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }