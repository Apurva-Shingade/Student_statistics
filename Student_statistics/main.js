// Initialize Supabase (Use your own keys from Supabase dashboard)
const _supabase = supabase.createClient('YOUR_URL', 'YOUR_ANON_KEY');

async function saveToDB() {
    const data = {
        student_name: document.getElementById('studentName').value,
        standard: parseInt(document.getElementById('stdSelect').value),
        math: parseFloat(document.getElementById('math').value),
        science: parseFloat(document.getElementById('science').value),
        // ... add other fields
    };

    const { error } = await _supabase.from('student_records').insert([data]);
    if (error) alert("Error saving: " + error.message);
    else alert("Data for Std " + data.standard + " saved successfully!");
}

async function loadAndAnalyze() {
    const name = document.getElementById('studentName').value;

    // 1. Fetch all 10 years of data for this student
    const { data, error } = await _supabase
        .from('student_records')
        .select('*')
        .eq('student_name', name);

    if (data.length > 0) {
        // 2. Aggregate data (calculate averages across years)
        const avgMath = data.reduce((acc, curr) => acc + curr.math, 0) / data.length;
        const avgSci = data.reduce((acc, curr) => acc + curr.science, 0) / data.length;
        // ... aggregate other subjects

        // 3. Pass averages to C++ Logic
        const resultId = engine.ccall(
            'predictCareerPath', 
            'number', 
            ['number', 'number', 'number', 'number', 'number', 'number'], 
            [avgMath, avgSci, avgVoc, avgSpt, avgPsn, avgCrt]
        );
        
        updateUI(resultId);
    }
}