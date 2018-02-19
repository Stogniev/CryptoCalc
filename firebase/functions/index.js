//GOOGLE_APPLICATION_CREDENTIALS=../cryptocalc1-d51fa5762f45.json firebase experimental:functions:shell

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// cloud firestore
var db = admin.firestore();

const axios = require('axios');

// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.internalRefreshConventionalRates = functions.https.onRequest((request, response) => {
  let ratesCollection = db.collection('rates')
  let ratesDoc = ratesCollection.doc('all')
  let metaDoc = ratesCollection.doc('_meta')

  let stamp = new Date()

  const currenciesUpdate =   axios.get('https://openexchangerates.org/api/latest.json?app_id=96165ff9475d45708a008b0a05584271')
        .then( res => {
          metaDoc.set({ConventionalCurrenciesUpdated: stamp}, {merge: true})
          ratesDoc.set(res.data.rates, {merge: true})
          return response.send(`Conventional rates updated at ${stamp}`)
        })
        .catch(error => {
          console.error('Conventional rates api error:', error)
          return response.send(`Conventional rates api error: ${error}`)
        })
})


exports.internalRefreshCryptoRates = functions.https.onRequest((request, response) => {
  let ratesCollection = db.collection('rates')
  let ratesDoc = ratesCollection.doc('all')
  let metaDoc = ratesCollection.doc('_meta')

  let stamp = new Date()

  const cryptocurrenciesUpdate = axios.get('http://coincap.io/front')
        .then( res => {
          const rates = res.data.reduce( (obj, item) => Object.assign(obj, {[item.short]: 1/item.price}), {} )

          metaDoc.set({cryptoCurrenciesUpdated: stamp}, {merge: true})
          ratesDoc.set(rates, {merge: true})
          return response.send(`Crypto rates updated at ${stamp}`)
        })
        .catch(error => {
          console.error('Cryptocurrencies api error:', error)
          return response.send(`Crypto rates api error: ${error}`)
        })
})


