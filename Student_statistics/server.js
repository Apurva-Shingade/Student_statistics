const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

app.use(express.json());
app.use(express.static(__dirname)); 

const DB_PATH = './students.json';

// DYNAMIC ROUTE 1: Append to JSON
app.post('/save', (req, res) => {
    let db = fs.existsSync(DB_PATH) ? JSON.parse(fs.readFileSync(DB_PATH)) : [];
    db.push(req.body);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.send(`Data for ${req.body.name} (Std ${req.body.std}) saved!`);
});

// DYNAMIC ROUTE 2: Fetch and Execute C++
app.get('/analyze', (req, res) => {
    const name = req.query.name;
    const db = JSON.parse(fs.readFileSync(DB_PATH));
    
    // Filter all records for this specific student (1st to 10th std)
    const records = db.filter(s => s.name.toLowerCase() === name.toLowerCase());

    if (records.length === 0) return res.json({ career: "No records found" });

    // Calculate averages across all saved years
    const avgMath = records.reduce((a, b) => a + Number(b.math), 0) / records.length;
    const avgSci = records.reduce((a, b) => a + Number(b.science), 0) / records.length;

    // Run C++ logic engine
    const cmd = `logic_engine.exe ${avgMath} ${avgSci}`;
    exec(cmd, (err, stdout) => {
        res.json({ career: stdout.trim() || "General Studies" });
    });
});

app.listen(3000, () => console.log("Server Live: http://localhost:3000"));