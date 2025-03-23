const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;
const cors = require('cors');
const claude = require('./promptClaude');
const editData = require('./dataProcessing');

app.use(cors());

app.use(express.json());


app.post('/claude', async (req, res) => {
    const { pdfBase64 } = req.body;
    console.log('Received pdfBase64:', pdfBase64);

    let const_data = await claude(pdfBase64);
    console.log('Sending Data back');
    res.json(const_data);
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});