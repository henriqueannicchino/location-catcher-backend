const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use(cors(/* IP */));

app.use('/', require("./src/routes"));

let port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log('Server running on port ' + port);
});