import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';

// 1. Move styles to the top OR ensure they are defined before export
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    minHeight: '100vh',
    fontFamily: 'sans-serif'
  },
  title: { fontSize: '28px', fontWeight: 'bold', marginBottom: '4px' },
  subtitle: { color: '#6B7280', marginBottom: '20px' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: {
    padding: '10px 15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    background: '#fff'
  },
  activeTab: { backgroundColor: '#EEF2FF', color: '#4F46E5', borderColor: '#4F46E5' },
  card: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  label: { marginBottom: '8px', display: 'block', fontWeight: '600' },
  select: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '16px'
  },
  btn: {
    backgroundColor: '#4F46E5',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: 'bold',
    width: '100%'
  },
  btnDisabled: { backgroundColor: '#9CA3AF', cursor: 'not-allowed' }
};

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [selectedId, setSelectedId] = useState(''); // ✅ Fixed state initialization

  const tabs = ['student', 'class', 'subject'];

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setSelectedId('');
    let table = activeTab === 'student' ? 'students' : activeTab === 'class' ? 'classes' : 'subjects';
    let labelKey = activeTab === 'student' ? 'full_name' : 'name';

    try {
      const { data, error } = await supabase.from(table).select('*').order(labelKey, { ascending: true });
      if (error) throw error;
      setDataList(data.map(item => ({ id: item.id, label: item[labelKey] || 'Unnamed' })));
    } catch (err) {
      console.error(err);
    }
  };

  const generatePDF = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      let query = supabase.from('grades').select(`
        score,
        subjects (name),
        students (full_name, class)
      `);

      if (activeTab === 'student') query = query.eq('student_id', selectedId);
      else if (activeTab === 'subject') query = query.eq('subject_id', selectedId);

      const { data: reportData, error } = await query;
      if (error) throw error;

      if (!reportData || reportData.length === 0) {
        alert('No data found for this selection');
        return;
      }

      const element = document.createElement('div');
      element.innerHTML = `<h1>Report</h1><p>Generated on ${new Date().toLocaleDateString()}</p>`;
      html2pdf().from(element).save();
    } catch (err) {
      alert('PDF Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Reports</h1>
      <p style={styles.subtitle}>Generate performance PDF reports</p>

      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <label style={styles.label}>Select {activeTab}</label>
        <select
          style={styles.select}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Select --</option>
          {dataList.map(item => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>

        <button
          onClick={generatePDF}
          disabled={!selectedId || loading}
          style={{ ...styles.btn, ...(loading || !selectedId ? styles.btnDisabled : {}) }}
        >
          {loading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>
    </div>
  );
};

export default Reports;