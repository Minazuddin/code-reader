const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.json({ success: true, message: 'TEST GET /' }))

app.post('/exec-code', (req, res) => {
    const data = req.body;

    fs.writeFile('code.js', data.code, 'utf-8', (err) => {
        if (err) {
            return res.json({ success: false, message: err });
        }
        
        exec('node code.js', (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`)
                return res.json({ success: false, message: error });
            }
            if (stderr) {
                console.log(`stderror: ${stderr.message}`)
                return res.json({ success: false, message: stderr });
            }
            console.log(`stdout: ${stdout}`)
            return res.json({ success: true, message: 'executed successfully!', output: stdout });
        })
     })
})

app.listen(PORT, () => console.log('server listening to port ', PORT))