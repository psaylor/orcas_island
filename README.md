Orcas Island is a fun place to read short stories and practice your English pronunciation!


How to build this site:
Using express and express-generator
npm install express
npm install -g express-generator
npm install -g nodemon so that you don't have to restart your application each time you make a change
then start with nodemon app.js instead of node app.js (https://github.com/remy/nodemon/blob/master/README.md)

how to upgrade node with npm: http://davidwalsh.name/upgrade-nodejs

using the express generator:
510 patriciasaylor:orcas_island$ express .
destination is not empty, continue? [y/N] y

   create : .
   create : ./package.json
   create : ./app.js
   create : ./public
   create : ./public/javascripts
   create : ./public/images
   create : ./public/stylesheets
   create : ./public/stylesheets/style.css
   create : ./routes
   create : ./routes/index.js
   create : ./routes/users.js
   create : ./views
   create : ./views/index.jade
   create : ./views/layout.jade
   create : ./views/error.jade
   create : ./bin
   create : ./bin/www

   install dependencies:
     $ cd . && npm install

   run the app:
     $ DEBUG=orcas_island:* ./bin/www


still having npm install issues, so do:
549 patriciasaylor:orcas_island$ sudo chown -R $USER ~/.npm
550 patriciasaylor:orcas_island$ sudo chown -R $USER /usr/local/lib/node_modules

new recognition file:
cd ./for_trish
./run_misp_detect_proposed.sh $1