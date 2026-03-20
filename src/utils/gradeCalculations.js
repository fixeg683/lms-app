import { supabase } from '../lib/supabase';

const REQUIRED_SUBJECTS = [
  "Mathematics", "English", "Kiswahili", "Integrated science",
  "Creative Arts & Sports", "Pre-technical studies", "Social Studies", "Religious Studies"
];

const getGradeAttributes = (score) => {
  if (score >= 80) return { rubric: 'EE 1', points: 8, remarks: 'Exceptional performance' };
  if (score >= 70) return { rubric: 'EE 2', points: 7, remarks: 'Excellent performance' };
  if (score >= 60) return { rubric: 'ME 1', points: 6, remarks: 'Good performance' };
  if (score >= 50) return { rubric: 'ME 2', points: 5, remarks: 'Meeting expectations' };
  return { rubric: 'BE 2', points: 0, remarks: 'No performance recorded' };
};

export const fetchStudentReportData = async (studentId) => {
  try {
    // 1. Get Student Info
    const { data: student, error: sErr } = await supabase
      .from('students')
      .select('full_name, class')
      .eq('id', studentId)
      .single();

    if (sErr) throw sErr;

    // 2. Get Grades for this student joined with subject names
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select(`score, subjects(name)`)
      .eq('student_id', studentId);

    if (gErr) throw gErr;

    // 3. Map grades to the 8 required subjects
    let totalScore = 0;
    let totalPoints = 0;

    const subjectsData = REQUIRED_SUBJECTS.map(reqSub => {
      const record = grades.find(g => g.subjects.name === reqSub);
      const score = record ? record.score : 0;
      const attr = getGradeAttributes(score);
      
      totalScore += score;
      totalPoints += attr.points;

      return {
        name: reqSub,
        score: score,
        rubric: attr.rubric,
        points: attr.points,
        remarks: attr.remarks
      };
    });

    const average = (totalScore / REQUIRED_SUBJECTS.length).toFixed(0);

    return {
      name: student.full_name,
      className: student.class,
      term: "Term 1 Final Exam, 2025",
      year: "2026",
      subjects: subjectsData,
      average,
      totalPoints
    };
  } catch (error) {
    console.error("Calculation Error:", error);
    throw new Error("Could not calculate report data.");
  }
};