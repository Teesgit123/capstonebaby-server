# capstonebaby-server


To run the server:

1) npm install

2) npx knex migrate:latest

3) npx knex seed:run --specific=usersSeed.js

4) npx knex seed:run --specific=telescopes.js

5) npm start
