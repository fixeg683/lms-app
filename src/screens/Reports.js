import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';
// ✅ Import your specialized logic
import { fetchStudentReportData } from '../utils/gradeCalculations';
import { generateReportHTML } from '../utils/reportTemplate';

const styles = {
  container: { padding: '24px', backgroundColor: '#F9FAFB', minHeight: '100vh', fontFamily: 'Inter, sans-serif' },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' },
  subtitle: { color: '#6B7280', marginBottom: '32px' },
  card: { background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', maxWidth: '500px' },
  label: { marginBottom: '8px', display: 'block', fontWeight: '600', color: '#374151', fontSize: '14px' },
  select: {
    width: '100%',
    padding: '12px',
    marginBottom: '24px',
    borderRadius: '10px',
    border: '1px solid #D1D5DB',
    fontSize: '16px',
    backgroundColor: '#F9FAFB'
  },
  btn: {
    backgroundColor: '#4F46E5',
    color: '#fff',
    padding: '14px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    width: '100%',
    fontSize: '16px',
    transition: 'background-color 0.2s'
  },
  btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' },
  warning: { marginTop: '16px', color: '#9CA3AF', fontSize: '12px', fontStyle: 'italic', lineHeight: '1.5' }
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id, full_name')
        .order('full_name', { ascending: true });
      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  const handleDownloadPDF = async () => {
    if (!selectedStudentId) return;
    
    setLoading(true);
    try {
      // 1. Fetch data using the specialized 8-subject logic
      const reportData = await fetchStudentReportData(selectedStudentId);

      // 2. Generate the HTML structure based on your Tassia School template
      const reportHTML = generateReportHTML(reportData);

      // 3. Create a temporary container for html2pdf
      const element = document.createElement('div');
      element.innerHTML = reportHTML;

      // 4. Configure PDF options for a professional look
      const opt = {
        margin: [0, 0],
        filename: `Report_${reportData.name.replace(/\s+/g, '_')}_2025.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // 5. Run the conversion
      await html2pdf().set(opt).from(element).save();

    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to generate report. Ensure all 8 subjects have grades.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Academic Reports</h1>
      <p style={styles.subtitle}>Generate and download official student progress forms</p>

      <div style={styles.card}>
        <label style={styles.label}>Learner Name</label>
        <select
          style={styles.select}
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">-- Choose a Student --</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.full_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleDownloadPDF}
          disabled={!selectedStudentId || loading}
          style={{ 
            ...styles.btn, 
            ...(loading || !selectedStudentId ? styles.btnDisabled : {}) 
          }}
        >
          {loading ? 'Processing Data...' : 'Download Progress Report'}
        </button>

        <p style={styles.warning}>
          * A report will only generate if the student has grades recorded for all 8 mandatory subjects.
        </p>
      </div>
    </div>
  );
};

export default Reports;