import React, { useEffect, useState } from 'react';
import styles from './Students.module.css';
import { supabase } from '../lib/supabase';

import AddStudentModal from '../components/AddStudentModal';
import EditStudentModal from '../components/EditStudentModal';
import DeleteModal from '../components/DeleteModal';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editConfig, setEditConfig] = useState({ open: false, student: null });
  const [deleteConfig, setDeleteConfig] = { open: false, id: null, name: '' };

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
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h1 className={styles.title}>Student Management</h1>
          <p className={styles.subtitle}>
            Manage student records and information
          </p>
        </div>

        <button
          className={styles.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          + Add Student
        </button>
      </div>

      {loading ? (
        <div style={{ marginTop: 50 }}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableHeader}>
            <span className={styles.headerText} style={{ flex: 2 }}>
              STUDENT
            </span>
            <span className={styles.headerText} style={{ flex: 1 }}>
              CLASS
            </span>
            <span
              className={styles.headerText}
              style={{ flex: 0.5, textAlign: 'right' }}
            >
              ACTIONS
            </span>
          </div>

          {students.map((student) => {
            const initials = student?.full_name
              ? student.full_name.substring(0, 2).toUpperCase()
              : '??';

            return (
              <div key={student.id} className={styles.row}>
                <div className={styles.studentCell}>
                  <div className={styles.avatar}>
                    <span className={styles.avatarText}>{initials}</span>
                  </div>
                  <span className={styles.studentName}>
                    {student.full_name}
                  </span>
                </div>

                <div className={styles.classCell}>
                  <div className={styles.badge}>
                    <span className={styles.badgeText}>
                      {student.class || 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className={styles.actionCell}>
                  <span
                    className={styles.editIcon}
                    onClick={() => setEditConfig({ open: true, student })}
                  >
                    ✎
                  </span>

                  <span
                    className={styles.deleteIcon}
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

export default Students;