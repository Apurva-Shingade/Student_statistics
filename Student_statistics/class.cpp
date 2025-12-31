#include <iostream>
#include <vector>
#include <string>
#include <numeric>
#include <iomanip>

using namespace std;

// Structure to hold all parameters for a student
struct StudentReport {
    string name;
    int std;
    float math, science, vocab, sports, passion;
    int certs;
};

// Function to determine career interest based on multi-disciplinary scores
string analyzeInterests(const StudentReport& report) {
    // Weighted logic
    float academicAvg = (report.math + report.science + report.vocab) / 3.0;
    float skillScore = (report.sports + (report.certs * 10)) / 2.0;

    if (report.math > 80 && report.science > 75) {
        return "Engineering & Technology";
    } else if (report.science > 85 && report.vocab > 70) {
        return "Medical & Life Sciences";
    } else if (report.sports > 80 || report.passion > 85) {
        return "Sports & Professional Athletics";
    } else if (report.vocab > 80 && report.passion > 70) {
        return "Law, Journalism & Humanities";
    } else {
        return "General Management & Arts";
    }
}

// THE MAIN FUNCTION: Used for local testing in VS Code terminal
int main() {
    cout << "--- Student Career Analytics Engine (Local Test) ---" << endl;

    // Creating a sample student for 10th Std
    StudentReport testStudent;
    testStudent.name = "Rahul";
    testStudent.std = 10;
    testStudent.math = 92.5;
    testStudent.science = 88.0;
    testStudent.vocab = 75.0;
    testStudent.sports = 40.0;
    testStudent.passion = 60.0;
    testStudent.certs = 2;

    cout << "Analyzing data for: " << testStudent.name << " (Std: " << testStudent.std << ")" << endl;
    
    string result = analyzeInterests(testStudent);
    
    cout << "Recommended Career Path: " << result << endl;
    cout << "----------------------------------------------------" << endl;

    return 0;
}

// Note: To use this in your website, we will later "export" 
// analyzeInterests so JavaScript can call it.