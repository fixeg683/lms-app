import { supabase } from '../lib/supabase';

// Define the 8 subjects to track (from image_2.png abbreviations)
const TRACKED_SUBJECTS = {
  'Mathematics': 'mat',
  'English': 'eng',
  'Kiswahili': 'kis',
  'Integrated science': 'int',
  'Creative Arts & Sports': 'cre',
  'Pre-technical studies': 'pre',
  'Social Studies': 'soc',
  'Religious Studies': 'rel'
};

export const fetchAndVerifyClassReportData = async (className, currentYear) => {
  try {
    // 1. Fetch all students in the selected class
    const { data: students, error: sErr } = await supabase
      .from('students')
      .select('id, full_name')
      .eq('class', className);
    if (sErr || !students || students.length === 0) throw new Error("No students found in this class.");

    // 2. Fetch all grades for these students and the current year
    const studentIds = students.map(s => s.id);
    const { data: grades, error: gErr } = await supabase
      .from('grades')
      .select('student_id, score, subjects (name)')
      .in('student_id', studentIds)
      .filter('created_at', 'gte', `${currentYear}-01-01`)
      .filter('created_at', 'lte', `${currentYear}-12-31`);

    if (gErr) throw gErr;

    // 3. Process Data for Rankings Table
    const subjectAverages = {}; // For calculating lowest subject stat
    Object.values(TRACKED_SUBJECTS).forEach(abbr => subjectAverages[abbr] = { sum: 0, count: 0 });

    let classTotalScore = 0;
    let totalGradeEntries = 0;
    let totalPasses = 0; // Using 50% as pass mark

    const rankingData = students.map(student => {
      // Find grades for this specific student
      const studentGrades = (grades || []).filter(g => g.student_id === student.id);
      
      const subjectScores = {};
      let studentTotal = 0;
      let subjectsCount = 0;

      // Initialize all tracked subjects with 0 (as per image behavior for missing grades)
      Object.values(TRACKED_SUBJECTS).forEach(abbr => subjectScores[abbr] = 0);

      // Map actual grades to subject abbreviations
      studentGrades.forEach(g => {
        const subjectName = g.subjects?.name;
        if (TRACKED_SUBJECTS[subjectName]) {
          const abbr = TRACKED_SUBJECTS[subjectName];
          const score = g.score || 0;
          subjectScores[abbr] = score;
          studentTotal += score;
          subjectsCount++;
          
          // Add to class-level subject averages
          subjectAverages[abbr].sum += score;
          subjectAverages[abbr].count++;
          
          // Track class total and passes
          classTotalScore += score;
          totalGradeEntries++;
          if (score >= 50) totalPasses++;
        }
      });

      // Calculate student average based on all 8 subjects (as per image behavior)
      const studentAvg = subjectsCount > 0 ? Math.round((studentTotal / (8 * 100)) * 100) : 0;

      return {
        id: student.id,
        name: student.full_name,
        ...subjectScores,
        total: studentTotal,
        avg: studentAvg
      };
    });

    // Sort students by Total score (descending) to get rankings
    rankingData.sort((a, b) => b.total - a.total);

    // 4. Calculate Stats for Cards from image_2.png
    const averageScore = totalGradeEntries > 0 ? Math.round((classTotalScore / (totalGradeEntries))): 0;
    const passRate = totalGradeEntries > 0 ? Math.round((totalPasses / totalGradeEntries) * 100) : 0;
    const topPerformer = rankingData.length > 0 ? rankingData[0].name : "N/A";

    // Find the Lowest Subject
    let lowestSubject = { name: "N/A", avg: 100 };
    Object.entries(TRACKED_SUBJECTS).forEach(([name, abbr]) => {
      const stats = subjectAverages[abbr];
      if (stats.count > 0) {
        const avg = Math.round(stats.sum / stats.count);
        if (avg < lowestSubject.avg) {
          lowestSubject = { name, avg };
        }
      }
    });

    // Final data structure for the class report template
    return {
      className: className,
      term: "Term 1 Final Exam", // Hardcoded term
      year: currentYear,
      stats: {
        averageScore,
        passRate,
        topPerformer,
        lowestSubject
      },
      rankings: rankingData
    };

  } catch (error) {
    console.error("Class Report Generation Error:", error.message);
    throw error;
  }
};