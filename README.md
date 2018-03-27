# CryptoCalc configuration

## Node

Tested on 8.9.4 on Ubuntu. Most probably any 8.x node version would be ok.



## Firebase
Used to store currency rates.

Account: safecryptocalc@gmail.com  (paid because firebase functions request to EXTERNAL services to for the rates)

Database:  https://console.firebase.google.com/u/1/project/cryptocalc1-76acb/database/firestore/data

Database is modified via firebase functions at https://console.firebase.google.com/u/1/project/cryptocalc1-76acb/functions/list

The functions are:
 - internalRefreshConventionalRates - refresh common currency rates in firebase db
 - internalRefreshCryptoRates - refresh cryptocurrency rates in firebase db
 - helloWorld - for testing purposes

Every function has own calling url and has't arguments. You can any function manually any time (opening function url in browser or make GET request any other way)

The desired system behavour is  to update cryptocurrency rates every minute and update conventional currencies every hour, so we need to call correspondent functions periodically. Because Firebase hasn't ability for auto-calling own functions, we used external free service http://cron-job.org for that (see below).


### Firebase function modifications
Firebase functions are javascript functions that are located in ```firebase/functions``` directory (separated node sub-project with own package.json). The big problem is that official firebase packages can work only with node v6.11. This makes firebase functions modifications a bit tricky because Cryptocalc project is wrote on node v8 (long-time support node version).

The recommended way of two node versions switching is to use Node version manager package (nvm). 

E.g. you have to switch to older node (```nvm use v6.11```) every time you want modify firebase functions and switch back to last node (```nvm use v8```) to continue work with project the normal way.


To modify firebase functions first time do the following:

```bash
cd firebase/functions
nvm use v6.11  # switch to node v6.11
npm install   # call once to generate firebase/functions/node_modules

# (modify firebase/functions/index.js in the text editor)

npm run deploy   # deploy all firebase functions to server

# don't forget to swith to node v8 back to proceed the project 
npm use v8
cd ../..

```

Hope the day Firebase will support node v8 will come soon and there will be no need to perform that confusing node v6.11/v8 switching

Technical note: firebase configuration local "patch" used: ```~/dev/cryptocalc/firebase/functions/firebase.json -> "source": ""```



## Cron-job service
Used to call firebase functions periodically.

Account: safecryptocalc@gmail.com/hm5435kdfcv7 (free)

task list: https://cron-job.org/en/members/jobs/

Important note: in case problems with cronjobbed tasks (for example 5xx http answer) the email with "Cronjob failed rates" is sent to the account. If the problems repeat many times correspondent cronjob service will auto-stop ans has to be restarted manually. So keep in mind necessity to review your mailbox for possible errors.


## Openexchangerates
Used to get conventional currencies rates (called by firebase function)

Account: safecryptocalc@gmail.com/3hdiv3ucgw (free with 1000 requests/month limit)

## CoinCap.io
Used to get crypty currencies rates (called by firebase function)

(no account needed)



