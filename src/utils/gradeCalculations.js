import { supabase } from '../lib/supabase';

// ✅ Ensure this is a NAMED export: "export const ..."
export const fetchAndVerifyStudentReportData = async (studentId, currentYear) => {
  try {
    // 1. Fetch Student & Class Info
    const { data: student, error: sErr } = await supabase
      .from('students')
      .select('id, full_name, class')
      .eq('id', studentId)
      .single();

    if (sErr || !student) throw new Error("Student not found");

    // 2. Fetch Grades
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('score, subjects (name)')
      .eq('student_id', studentId);

    if (gErr) throw gErr;

    // 3. Process data for the 8 required subjects
    const required = [
      "Mathematics", "English", "Kiswahili", "Integrated science",
      "Creative Arts & Sports", "Pre-technical studies", "Social Studies", "Religious Studies"
    ];

    let totalScore = 0;
    const transformedSubjects = required.map(subName => {
      const record = grades.find(g => g.subjects?.name === subName);
      const score = record ? record.score : 0;
      totalScore += score;

      // Rubric Logic
      let rubric = 'BE 2', points = 0, remarks = 'No performance recorded';
      if (score >= 80) { rubric = 'EE 1'; points = 8; remarks = 'Exceptional performance'; }
      else if (score >= 60) { rubric = 'ME 1'; points = 6; remarks = 'Good performance'; }

      return { name: subName, score, outOf: 100, rubric, points, remarks };
    });

    return {
      name: student.full_name,
      className: student.class,
      term: "Term 1 Final Exam",
      year: currentYear,
      subjects: transformedSubjects,
      average: Math.round(totalScore / 8),
      totalPoints: transformedSubjects.reduce((acc, curr) => acc + curr.points, 0)
    };
  } catch (error) {
    throw error;
  }
};