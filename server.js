// import required essentials
const http = require('http');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
var cors = require('cors');
// import `items` from `routes` folder 
const itemsRouter = require('./routes/split-payments/compute');

// create new app
const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use(cors({origin: 'http://localhost:8100'}));


app.use('/split-payments/compute', itemsRouter);


const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);