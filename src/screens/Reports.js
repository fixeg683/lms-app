import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedId, setSelectedId] = '';

  const tabs = ['student', 'class', 'subject'];

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setSelectedId('');

    const table =
      activeTab === 'student'
        ? 'students'
        : activeTab === 'class'
        ? 'classes'
        : 'subjects';

    const column = activeTab === 'student' ? 'full_name' : 'name';

    try {
      const { data, error } = await supabase
        .from(table)
        .select(`id, ${column}`);

      if (error) throw error;

      setDataList(data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load options');
    }
  };

  const generatePDF = async () => {
    if (!selectedId) {
      alert(`Please select a ${activeTab}`);
      return;
    }

    setLoading(true);

    try {
      // ✅ FIXED QUERY (NO !inner)
      let query = supabase.from('grades').select(`
        score,
        subjects (name),
        students (
          full_name,
          class_id,
          classes (id, name)
        )
      `);

      // ✅ FILTERS
      if (activeTab === 'student') {
        query = query.eq('student_id', selectedId);
      } else if (activeTab === 'class') {
        query = query.eq('students.class_id', selectedId);
      } else if (activeTab === 'subject') {
        query = query.eq('subject_id', selectedId);
      }

      const { data: reportData, error } = await query;

      console.log('REPORT DATA:', reportData); // 🔍 DEBUG

      if (error) throw error;

      if (!reportData || reportData.length === 0) {
        alert('No records found. Check your grades table or relationships.');
        return;
      }

      const htmlContent = `
        <div style="font-family: Arial; padding: 30px;">
          <h1 style="color:#4F46E5;">${activeTab.toUpperCase()} REPORT</h1>
          <p>Date: ${new Date().toLocaleDateString()}</p>

          <table style="width:100%; border-collapse: collapse; margin-top:20px;">
            <thead>
              <tr>
                <th style="border:1px solid #ddd; padding:10px;">Student</th>
                <th style="border:1px solid #ddd; padding:10px;">Class</th>
                <th style="border:1px solid #ddd; padding:10px;">Subject</th>
                <th style="border:1px solid #ddd; padding:10px;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(item => `
                <tr>
                  <td style="border:1px solid #ddd; padding:10px;">
                    ${item.students?.full_name || 'N/A'}
                  </td>
                  <td style="border:1px solid #ddd; padding:10px;">
                    ${item.students?.classes?.name || 'N/A'}
                  </td>
                  <td style="border:1px solid #ddd; padding:10px;">
                    ${item.subjects?.name || 'N/A'}
                  </td>
                  <td style="border:1px solid #ddd; padding:10px;">
                    ${item.score ?? 'N/A'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      // ✅ PDF DOWNLOAD (WEB)
      const element = document.createElement('div');
      element.innerHTML = htmlContent;

      html2pdf()
        .set({
          margin: 10,
          filename: `${activeTab}_report.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(element)
        .save();

    } catch (err) {
      console.error('PDF ERROR:', err);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Reports</h1>
      <p style={styles.subtitle}>Generate performance PDF reports</p>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Card */}
      <div style={styles.card}>
        <p style={styles.label}>Select {activeTab}</p>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Select {activeTab} --</option>
          {dataList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.full_name || item.name}
            </option>
          ))}
        </select>

        <button
          onClick={generatePDF}
          disabled={!selectedId || loading}
          style={{
            ...styles.btn,
            ...(loading || !selectedId ? styles.btnDisabled : {})
          }}
        >
          {loading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default Reports;

/* ✅ INLINE STYLES */
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: '20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    background: '#fff'
  },
  activeTab: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5'
  },
  card: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px'
  },
  label: {
    marginBottom: '10px'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '8px'
  },
  btn: {
    backgroundColor: '#4F46E5',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none'
  },
  btnDisabled: {
    backgroundColor: '#9CA3AF',
    cursor: 'not-allowed'
  }
};