const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;

// Middle Ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hlw World')
} )

app.listen( port, () => {
    console.log(`App is run on port: ${port}`);
} )