### Setup

####
1) You need to have a MongoDB cluster in order to launch the application correctly, since the **watch** function only works on a MongoDB cluster. I used a local MongoDB cluster in Docker for development without authentication.

####
2) Then you need to create a .env file in the project's bark and add the variables DB_URI and DB_NAME. For example - DB_URI=mongodb://localhost:27017 and DB_NAME=myDatabase

####
3) After that, you need to install all dependencies `yarn install`

### Launch

Then you can launch the apps

`yarn run build` - Build apps

`node .\lib\app\index.js` - launch an application that will generate fake users and insert them into the customers collection

`node .\lib\sync\index.js` - Launch an application that will monitor changes in the customers table in real time and insert anonymized users into the customers_anonymised collection

`node .\lib\sync\index.js --full-reindex` - An application that performs full synchronization

You can also find aliases for these commands in the scripts block in the package.json file

`yarn run start-app` `yarn run start-real-sync` `yarn run start-full-sync`

### Usage

In order to restart the application, you need to enter 'r'

Files fullSyncStatFile and realSyncStatFile need for save information about the last anonymized customer to the db.
