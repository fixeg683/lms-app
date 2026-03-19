import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import AddStudentModal from '../components/AddStudentModal';
import EditStudentModal from '../components/EditStudentModal';
import DeleteModal from '../components/DeleteModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editConfig, setEditConfig] = useState({ open: false, student: null });
  const [deleteConfig, setDeleteConfig] = useState({
    open: false,
    id: null,
    name: '',
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching students:", error?.message || error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfig?.id) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', deleteConfig.id);

      if (error) throw error;

      setDeleteConfig({ open: false, id: null, name: '' });
      fetchStudents();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div>
          <h1 style={styles.title}>Student Management</h1>
          <p style={styles.subtitle}>
            Manage student records and information
          </p>
        </div>

        <button
          style={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Student
        </button>
      </div>

      {loading ? (
        <div style={{ marginTop: 50 }}>Loading...</div>
      ) : (
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <span style={{ ...styles.headerText, flex: 2 }}>
              STUDENT
            </span>
            <span style={{ ...styles.headerText, flex: 1 }}>
              CLASS
            </span>
            <span
              style={{ ...styles.headerText, flex: 0.5, textAlign: 'right' }}
            >
              ACTIONS
            </span>
          </div>

          {students.map((student) => {
            const initials = student?.full_name
              ? student.full_name.substring(0, 2).toUpperCase()
              : '??';

            return (
              <div key={student.id} style={styles.row}>
                <div style={styles.studentCell}>
                  <div style={styles.avatar}>
                    <span style={styles.avatarText}>{initials}</span>
                  </div>
                  <span style={styles.studentName}>
                    {student.full_name}
                  </span>
                </div>

                <div style={styles.classCell}>
                  <div style={styles.badge}>
                    <span style={styles.badgeText}>
                      {student.class || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div style={styles.actionCell}>
                  <span
                    style={styles.editIcon}
                    onClick={() => setEditConfig({ open: true, student })}
                  >
                    ✎
                  </span>

                  <span
                    style={styles.deleteIcon}
                    onClick={() =>
                      setDeleteConfig({
                        open: true,
                        id: student.id,
                        name: student.full_name,
                      })
                    }
                  >
                    🗑
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={fetchStudents}
      />

      <EditStudentModal
        isOpen={editConfig.open}
        student={editConfig.student}
        onClose={() => setEditConfig({ open: false, student: null })}
        onRefresh={fetchStudents}
      />

      <DeleteModal
        isOpen={deleteConfig.open}
        onClose={() => setDeleteConfig({ open: false, id: null, name: '' })}
        onConfirm={handleDelete}
        itemName={deleteConfig.name}
      />
    </div>
  );
};

/* ✅ STYLES INSIDE FILE */
const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '16px',
  },
  tableHeader: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '8px',
    marginBottom: '12px',
  },
  headerText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  studentCell: {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#6366f1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: '600',
  },
  studentName: {
    fontWeight: '500',
    color: '#111827',
  },
  classCell: {
    flex: 1,
  },
  badge: {
    backgroundColor: '#eef2ff',
    padding: '6px 10px',
    borderRadius: '999px',
    display: 'inline-block',
  },
  badgeText: {
    color: '#4338ca',
    fontSize: '12px',
    fontWeight: '600',
  },
  actionCell: {
    flex: 0.5,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  editIcon: {
    cursor: 'pointer',
    color: '#2563eb',
  },
  deleteIcon: {
    cursor: 'pointer',
    color: '#dc2626',
  },
};

export default Students;