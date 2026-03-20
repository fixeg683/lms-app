export const generateReportHTML = (data) => {
  const { name, className, term, year, subjects, average, totalPoints } = data;

  const subjectRows = subjects.map(sub => `
    <tr>
      <td>${sub.name}</td>
      <td class="center">${sub.score}</td>
      <td class="center">100</td>
      <td class="center">${sub.rubric}</td>
      <td class="center">${sub.points}</td>
      <td>${sub.remarks}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @media print { @page { margin: 0.5cm; } }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #111; }
        .report-card { width: 100%; max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; }
        .header { text-align: center; line-height: 1.2; }
        .header h1 { margin: 0; font-size: 26px; text-transform: uppercase; }
        .header p { margin: 2px 0; font-size: 12px; }
        .divider { border-top: 2px solid #000; margin: 15px 0 5px 0; }
        .sub-divider { border-top: 1px solid #000; margin-bottom: 15px; }
        .title { text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 20px; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .info-item { display: flex; border-bottom: 1px solid #333; padding-bottom: 2px; }
        .label { font-weight: bold; width: 120px; font-size: 13px; }
        .value { flex: 1; font-size: 13px; text-transform: lowercase; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #000; padding: 8px; font-size: 12px; text-align: left; }
        th { background-color: #f2f2f2; }
        .center { text-align: center; }
        .bold { font-weight: bold; }

        .remarks-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; }
        .remark-box { border: 1px solid #000; height: 80px; padding: 10px; }
        .remark-title { font-weight: bold; font-size: 12px; margin-bottom: 30px; }
        
        .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px; }
        .footer-item { font-size: 13px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="report-card">
        <div class="header">
          <h1>TASSIA SCHOOL</h1>
          <p>"Quest for Quality"</p>
          <p>P.O Box 35235-00200, Nairobi | Tel: +254 020 82 0017, Cellphone: 0722 803 400</p>
        </div>
        <div class="divider"></div>
        <div class="sub-divider"></div>
        <div class="title">PROGRESS REPORT FORM</div>

        <div class="info-grid">
           <div class="info-item"><span class="label">Learner's Name:</span><span class="value">${name}</span></div>
           <div class="info-item"><span class="label">Class:</span><span class="value">${className}</span></div>
           <div class="info-item"><span class="label">Term:</span><span class="value">${term}</span></div>
           <div class="info-item"><span class="label">Year:</span><span class="value">${year}</span></div>
        </div>

        <p style="font-size: 12px; font-weight: bold;">Type of Assessment: SUMMATIVE ASSESSMENT</p>

        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th class="center">Score</th>
              <th class="center">Out of</th>
              <th class="center">Rubric</th>
              <th class="center">Points</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${subjectRows}
            <tr class="bold">
              <td colspan="4">TOTAL</td>
              <td class="center">${totalPoints}</td>
              <td>AVERAGE: ${average}%</td>
            </tr>
          </tbody>
        </table>

        <div class="remarks-section">
          <div class="remark-box"><div class="remark-title">Deputy Head Teacher's Remarks:</div></div>
          <div class="remark-box"><div class="remark-title">Head Teacher's Remarks:</div></div>
          <div class="remark-box" style="height: 40px;"><div class="remark-title">School Fee Arrears:</div></div>
          <div class="remark-box" style="height: 40px;"><div class="remark-title">Next Term Fee:</div></div>
        </div>
      </div>
    </body>
    </html>
  `;
};