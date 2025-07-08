const express = require('express');
const app = express();

require('./startup/config')();
require('./startup/db')();
const logger = require('./startup/logging');
require('./startup/routes')(app);

const port = process.env.PORT || 2000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});