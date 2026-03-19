import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '../lib/supabase';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  
  // ✅ FIXED: Initialized with useState correctly
  const [selectedId, setSelectedId] = useState('');

  const tabs = ['student', 'class', 'subject'];

  useEffect(() => {
    fetchOptions();
  }, [activeTab]);

  const fetchOptions = async () => {
    setSelectedId(''); // Reset selection when switching tabs
    setDataList([]);

    let table = '';
    let labelKey = '';

    if (activeTab === 'student') {
      table = 'students';
      labelKey = 'full_name';
    } else if (activeTab === 'class') {
      table = 'classes';
      labelKey = 'name';
    } else {
      table = 'subjects';
      labelKey = 'name';
    }

    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order(labelKey, { ascending: true });

      if (error) throw error;

      if (data) {
        const formatted = data.map((item) => ({
          id: item.id,
          label: item[labelKey] || 'Unnamed'
        }));
        setDataList(formatted);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const generatePDF = async () => {
    if (!selectedId) return;
    setLoading(true);

    try {
      // ✅ Improved Query to handle relationships
      let query = supabase.from('grades').select(`
        score,
        subjects (name),
        students (
          full_name,
          class,
          classes (name)
        )
      `);

      if (activeTab === 'student') {
        query = query.eq('student_id', selectedId);
      } else if (activeTab === 'class') {
        // This assumes your students table has a class_id foreign key
        query = query.eq('students.class_id', selectedId);
      } else if (activeTab === 'subject') {
        query = query.eq('subject_id', selectedId);
      }

      const { data: reportData, error } = await query;
      if (error) throw error;

      if (!reportData || reportData.length === 0) {
        alert('No grade records found for this selection.');
        setLoading(false);
        return;
      }

      // Find the name of the selected entity for the title
      const selectedName = dataList.find(i => i.id === selectedId)?.label || '';

      const htmlContent = `
        <div style="font-family: sans-serif; padding: 40px; color: #1F2937;">
          <h1 style="color: #4F46E5; margin-bottom: 4px;">Performance Report</h1>
          <p style="font-size: 18px; margin-bottom: 20px;">${activeTab.toUpperCase()}: <strong>${selectedName}</strong></p>
          <hr style="border: 0; border-top: 1px solid #E5E7EB; margin-bottom: 20px;" />
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #F9FAFB;">
                <th style="text-align: left; padding: 12px; border: 1px solid #E5E7EB;">Student</th>
                <th style="text-align: left; padding: 12px; border: 1px solid #E5E7EB;">Subject</th>
                <th style="text-align: center; padding: 12px; border: 1px solid #E5E7EB;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.map(item => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #E5E7EB;">${item.students?.full_name || 'N/A'}</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB;">${item.subjects?.name || 'N/A'}</td>
                  <td style="padding: 12px; border: 1px solid #E5E7EB; text-align: center; font-weight: bold;">${item.score}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #6B7280;">Generated on ${new Date().toLocaleString()}</p>
        </div>
      `;

      const element = document.createElement('div');
      element.innerHTML = htmlContent;

      await html2pdf()
        .set({
          margin: 10,
          filename: `${activeTab}_report_${selectedName}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(element)
        .save();

    } catch (err) {
      console.error('PDF ERROR:', err);
      alert('Error generating PDF');
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
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        <p style={styles.label}>Select {activeTab}</p>
        <select
          style={styles.select}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Choose {activeTab} --</option>
          {dataList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
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
          {loading ? 'Generating Report...' : 'Download PDF Report'}
        </button>
      </div>
    </div>
  );
};

// ... (Styles stay the same as your code)

export default Reports;