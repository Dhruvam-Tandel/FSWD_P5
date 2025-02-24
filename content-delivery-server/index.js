const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use((req, res, next) => {
    const logEntry = {
        time: new Date().toISOString(),
        ip: req.ip
    };
    fs.appendFile('visits.log', JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Failed to log visit:', err);
    });
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/logs', (req, res) => {
    fs.readFile('visits.log', 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to read logs' });
        } else {
            const logs = data.trim().split('\n').map(entry => {
                try {
                    return JSON.parse(entry);
                } catch (e) {
                    return null;
                }
            }).filter(entry => entry); 
            res.json(logs);
        }
    });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
