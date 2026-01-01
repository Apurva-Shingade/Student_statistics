let db = JSON.parse(localStorage.getItem('CodeVedas_Storage') || "[]");

// 1. AUTHENTICATION
function handleAuth() {
    const pass = document.getElementById('entryPass').value;
    if (pass === "Teacher@123") {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('mainDashboard').classList.remove('hidden');
        refreshDatabase();
    } else { alert("Unauthorized Access Detected."); }
}

// 2. NAVIGATION
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    if (tabId === 'view-records') renderRecords();
    if (tabId === 'topper-dash') renderTopperAnalytics();
    if (tabId === 'compare-section') setupComparison();
    if (tabId === 'class-stats') renderClassPerformance();
}

// 3. STUDENT DATA MANAGEMENT
function saveNewRecord() {
    const name = document.getElementById('stuName').value;
    const std = document.getElementById('classSelect').value;
    const m = parseFloat(document.getElementById('mScore').value) || 0;
    const s = parseFloat(document.getElementById('sScore').value) || 0;
    const v = parseFloat(document.getElementById('vScore').value) || 0;
    const att = parseFloat(document.getElementById('attScore').value) || 0;

    if (!name || !std) return alert("Student Name and Class are mandatory.");

    const avg = (m + s + v) / 3;
    let path = (m > 85) ? "Engineering" : (s > 85) ? "Medical" : (v > 80) ? "Law/Journalism" : "General Management";

    const newRecord = { name, std, m, s, v, att, avg, path };
    db.push(newRecord);
    localStorage.setItem('CodeVedas_Storage', JSON.stringify(db));
    
    alert(`Record successfully stored for ${name}. You can now enter the next student.`);
    document.querySelectorAll('input').forEach(input => input.value = "");
}

function renderRecords() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = db.map((student, index) => `
        <tr>
            <td>${student.name}</td>
            <td>${student.std}</td>
            <td>${student.avg.toFixed(1)}%</td>
            <td><strong>${student.path}</strong></td>
            <td><button onclick="deleteEntry(${index})" style="background:transparent; border:none; color:#ff4d4d; cursor:pointer;">Delete</button></td>
        </tr>
    `).join('');
}

function deleteEntry(index) {
    if(confirm("Permanently delete this record?")) {
        db.splice(index, 1);
        localStorage.setItem('CodeVedas_Storage', JSON.stringify(db));
        renderRecords();
    }
}

// 4. TOPPER DASHBOARD
function renderTopperAnalytics() {
    if (db.length === 0) return document.getElementById('topperAnnouncement').innerText = "No data available.";
    const topper = db.reduce((max, current) => (current.avg > max.avg) ? current : max);
    
    document.getElementById('topperAnnouncement').innerHTML = `
        <h1 style="color:var(--cyan); margin:0;">🏆 ${topper.name}</h1>
        <p style="margin-top:10px;">Highest Aggregate Found in <strong>${topper.std}</strong></p>
        <p>Current Score: ${topper.avg.toFixed(2)}% | Attendance: ${topper.att}%</p>
    `;

    new Chart(document.getElementById('topperRadar'), {
        type: 'radar',
        data: {
            labels: ['Math', 'Science', 'Linguistics', 'Attendance'],
            datasets: [{ label: topper.name, data: [topper.m, topper.s, topper.v, topper.att], borderColor: '#64ffda', backgroundColor: 'rgba(100, 255, 218, 0.2)' }]
        },
        options: { scales: { r: { ticks: { display: false }, grid: { color: '#233554' } } } }
    });
}

// 5. COMPARISON ENGINE
function setupComparison() {
    const sel1 = document.getElementById('compare1');
    const sel2 = document.getElementById('compare2');
    const options = db.map(s => `<option value="${s.name}">${s.name} (${s.std})</option>`).join('');
    sel1.innerHTML = options; sel2.innerHTML = options;
}

function compareAnalytics() {
    const s1 = db.find(x => x.name === document.getElementById('compare1').value);
    const s2 = db.find(x => x.name === document.getElementById('compare2').value);

    new Chart(document.getElementById('comparisonChart'), {
        type: 'bar',
        data: {
            labels: ['Math', 'Science', 'Vocab', 'Attendance'],
            datasets: [
                { label: s1.name, data: [s1.m, s1.s, s1.v, s1.att], backgroundColor: '#64ffda' },
                { label: s2.name, data: [s2.m, s2.s, s2.v, s2.att], backgroundColor: '#1a73e8' }
            ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true, grid: { color: '#233554' } } } }
    });
}

// 6. CLASS PERFORMANCE (AGGREGATE)
function renderClassPerformance() {
    const classData = {};
    db.forEach(s => {
        if (!classData[s.std]) classData[s.std] = { total: 0, count: 0 };
        classData[s.std].total += s.avg;
        classData[s.std].count++;
    });

    const labels = Object.keys(classData);
    const averages = labels.map(l => classData[l].total / classData[l].count);

    new Chart(document.getElementById('classAvgChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{ label: 'Average Score per Standard', data: averages, borderColor: '#64ffda', fill: false, tension: 0.1 }]
        }
    });

    const highestClass = labels[averages.indexOf(Math.max(...averages))];
    document.getElementById('classInsights').innerHTML = `
        <h3>System Insights</h3>
        <p>The highest performing class is currently <strong>${highestClass || 'N/A'}</strong>.</p>
        <p>Total students indexed: ${db.length}</p>
    `;
}

function refreshDatabase() { db = JSON.parse(localStorage.getItem('CodeVedas_Storage') || "[]"); }