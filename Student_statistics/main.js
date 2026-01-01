let db = JSON.parse(localStorage.getItem('CV_PRO_DATA') || "[]");
let captchaCode = "";
let currentPie = null;

// 1. SYSTEM INITIALIZATION
window.onload = () => {
    generateCaptcha();
    updateDashboardHub();
};

function generateCaptcha() {
    captchaCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    document.getElementById('captchaDisplay').innerText = captchaCode;
}

function handleAuth() {
    const pass = document.getElementById('entryPass').value;
    const userCap = document.getElementById('captchaInput').value;
    if (pass === "Teacher@123" && userCap.toUpperCase() === captchaCode) {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('mainDashboard').classList.remove('hidden');
    } else {
        alert("Authentication Blocked. Check Password or Captcha.");
        generateCaptcha();
    }
}

// 2. TAB CONTROLLER
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');

    if(tabId === 'overview') updateDashboardHub();
    if(tabId === 'view-records') renderTable();
    if(tabId === 'topper-dash') renderTopper();
}

// 3. ENROLLMENT & ANALYSIS
function saveRecord() {
    const data = {
        name: document.getElementById('stuName').value,
        std: document.getElementById('classSelect').value,
        m: parseFloat(document.getElementById('mScore').value) || 0,
        s: parseFloat(document.getElementById('sScore').value) || 0,
        v: parseFloat(document.getElementById('vScore').value) || 0,
        att: parseFloat(document.getElementById('attScore').value) || 0
    };

    if(!data.name) return alert("Student Name Required");

    // LOGIC PORTED FROM C++ CRITERIA
    let avg = (data.m + data.s + data.v) / 3;
    let path = "";
    if (data.m > 90 && data.s > 85) path = "Aerospace / AI Research";
    else if (data.s > 90) path = "Biotechnology / Neuroscience";
    else if (data.m > 80 && avg > 80) path = "FinTech / Quantitative Analyst";
    else if (avg > 75) path = "Digital Arts & Management";
    else path = "Vocational Professional";

    db.push({...data, avg, path});
    localStorage.setItem('CV_PRO_DATA', JSON.stringify(db));
    alert(`Success: ${data.name} Profiled as ${path}`);
    document.querySelectorAll('input').forEach(i => i.value = "");
}

// 4. DATABASE VIEW
function renderTable() {
    const body = document.getElementById('tableBody');
    body.innerHTML = db.map((s, i) => `
        <tr>
            <td>${s.name}</td>
            <td>${s.std}</td>
            <td>${s.avg.toFixed(1)}%</td>
            <td style="color:var(--cyan)">${s.path}</td>
            <td>
                <button onclick="exportSinglePDF(${i})" style="background:none; border:1px solid var(--cyan); color:var(--cyan); cursor:pointer; padding:5px 10px; border-radius:5px;">PDF</button>
            </td>
        </tr>
    `).join('');
}

function searchTable() {
    const term = document.getElementById('searchBar').value.toLowerCase();
    const rows = document.getElementById('tableBody').getElementsByTagName('tr');
    for (let row of rows) {
        row.style.display = row.innerText.toLowerCase().includes(term) ? "" : "none";
    }
}

// 5. EXCELLENCE LAB (THE PIE FIX)
function renderTopper() {
    const filter = document.getElementById('topperFilter').value;
    const list = filter === "all" ? db : db.filter(s => s.std === filter);
    if(!list.length) return document.getElementById('topperInfo').innerHTML = "<p>No Data Available</p>";

    const topper = list.reduce((a, b) => b.avg > a.avg ? b : a);
    document.getElementById('topperInfo').innerHTML = `
        <h1 style="color:var(--cyan)">🏆 ${topper.name}</h1>
        <p>Aggregate Score: ${topper.avg.toFixed(2)}%</p>
        <p>Recommended: ${topper.path}</p>
    `;

    if(currentPie) currentPie.destroy();
    currentPie = new Chart(document.getElementById('topperPie'), {
        type: 'pie',
        data: {
            labels: ['Math', 'Science', 'Vocab'],
            datasets: [{ data: [topper.m, topper.s, topper.v], backgroundColor: ['#64ffda', '#1a73e8', '#f8d210'], borderColor: '#0a192f' }]
        },
        options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#ccd6f6' } } } }
    });
}

// 6. DASHBOARD HUB ANALYTICS
function updateDashboardHub() {
    document.getElementById('totalStu').innerText = db.length;
    const avg = db.length ? (db.reduce((a, b) => a + b.avg, 0) / db.length).toFixed(1) : 0;
    document.getElementById('sysAvg').innerText = avg + "%";
    document.getElementById('lowAttCount').innerText = db.filter(s => s.att < 75).length;
}

function exportSinglePDF(i) {
    const s = db[i];
    document.getElementById('pdf-data').innerHTML = `<h2>Analysis for ${s.name}</h2><p>Class: ${s.std}</p><p>Result: ${s.path}</p>`;
    const el = document.getElementById('pdf-shell');
    el.style.display = 'block';
    html2pdf().from(el).save(`${s.name}_Report.pdf`);
    setTimeout(() => el.style.display = 'none', 500);
}