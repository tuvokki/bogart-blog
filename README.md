My bogart blog with CouchDB

This is a blogging system, created as an example. This example is documented in a series of blogposts on [tuvokki.github.io](http://tuvokki.github.io/).

##Usage
To run create a `.env` file in the root of your project with the following contents:

    DB_HOST=https://your-couchdb.host.com/
    BOGART_SECRET=A-RANDOM-STRING-OF-CHARACTERS-TO-SERVE-AS-A-SECRET-44-LONG

Run `node app.js`and see the magic happen.

For developent use `nodemon`.