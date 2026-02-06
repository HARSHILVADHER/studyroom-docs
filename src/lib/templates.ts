function escapeHTML(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function generateAdmitCardHTML(
  data: Record<string, string>,
  mapping: Record<string, string>
): string {
  const get = (field: string) => escapeHTML(data[mapping[field]] || '');

  const subjectsRaw = data[mapping['subjects']] || '';
  const subjects = subjectsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return `
    <div style="width:750px; padding:32px; font-family:'Inter',system-ui,sans-serif; border:3px solid #D32F2F; background:#fff; box-sizing:border-box;">
      <div style="text-align:center; border-bottom:3px solid #D32F2F; padding-bottom:16px; margin-bottom:24px;">
        <div style="font-size:32px; font-weight:900; color:#1a1a1a; margin-bottom:2px;">
          Study<span style="background:#D32F2F; color:#fff; padding:2px 12px; border-radius:6px; margin-left:4px;">ROOM</span>
        </div>
        <div style="font-size:11px; color:#666; letter-spacing:2px; margin-bottom:12px; font-style:italic;">
          Direction : Solution : Education
        </div>
        <div style="display:inline-block; background:#D32F2F; color:#fff; padding:8px 40px; font-size:18px; font-weight:700; letter-spacing:3px; border-radius:4px;">
          ADMIT CARD
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; margin-bottom:24px;">
        <table style="border-collapse:collapse;">
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333; white-space:nowrap;">Roll No:</td><td style="padding:5px 0; color:#1a1a1a;">${get('roll_no')}</td></tr>
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Student Name:</td><td style="padding:5px 0; color:#1a1a1a; font-weight:600;">${get('student_name')}</td></tr>
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Class:</td><td style="padding:5px 0; color:#1a1a1a;">${get('class')}</td></tr>
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Date of Birth:</td><td style="padding:5px 0; color:#1a1a1a;">${get('dob')}</td></tr>
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Father's Name:</td><td style="padding:5px 0; color:#1a1a1a;">${get('father_name')}</td></tr>
          <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Exam Center:</td><td style="padding:5px 0; color:#1a1a1a;">${get('exam_center')}</td></tr>
        </table>
        <div style="width:120px; height:150px; border:2px solid #D32F2F; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-left:20px; border-radius:4px; overflow:hidden; background:#fafafa;">
          ${
            data[mapping['photo_url']]
              ? `<img src="${escapeHTML(data[mapping['photo_url']])}" style="width:100%; height:100%; object-fit:cover;" />`
              : '<span style="color:#bbb; font-size:11px; text-align:center;">Photo</span>'
          }
        </div>
      </div>

      ${
        subjects.length > 0
          ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:14px; font-weight:700; color:#D32F2F; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Subjects</div>
        <table style="width:100%; border-collapse:collapse; border:1px solid #e0e0e0;">
          <thead>
            <tr style="background:#D32F2F; color:#fff;">
              <th style="padding:8px 12px; text-align:left; font-size:13px; border:1px solid #c62828; width:60px;">S.No</th>
              <th style="padding:8px 12px; text-align:left; font-size:13px; border:1px solid #c62828;">Subject</th>
            </tr>
          </thead>
          <tbody>
            ${subjects
              .map(
                (s, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
                <td style="padding:7px 12px; border:1px solid #e0e0e0; font-size:13px; text-align:center;">${i + 1}</td>
                <td style="padding:7px 12px; border:1px solid #e0e0e0; font-size:13px;">${escapeHTML(s)}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
          : ''
      }

      <div style="display:flex; justify-content:space-between; margin-top:48px; padding-top:20px;">
        <div style="text-align:center;">
          <div style="border-top:1.5px solid #333; width:170px; padding-top:8px; font-size:12px; color:#666;">Student's Signature</div>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1.5px solid #333; width:170px; padding-top:8px; font-size:12px; color:#666;">Principal's Signature</div>
        </div>
      </div>
    </div>
  `;
}

export function generateResultHTML(
  data: Record<string, string>,
  mapping: Record<string, string>,
  subjectColumns: string[] = []
): string {
  const get = (field: string) => escapeHTML(data[mapping[field]] || '');

  return `
    <div style="width:750px; padding:32px; font-family:'Inter',system-ui,sans-serif; border:3px solid #D32F2F; background:#fff; box-sizing:border-box;">
      <div style="text-align:center; border-bottom:3px solid #D32F2F; padding-bottom:16px; margin-bottom:24px;">
        <div style="font-size:32px; font-weight:900; color:#1a1a1a; margin-bottom:2px;">
          Study<span style="background:#D32F2F; color:#fff; padding:2px 12px; border-radius:6px; margin-left:4px;">ROOM</span>
        </div>
        <div style="font-size:11px; color:#666; letter-spacing:2px; margin-bottom:12px; font-style:italic;">
          Direction : Solution : Education
        </div>
        <div style="display:inline-block; background:#D32F2F; color:#fff; padding:8px 40px; font-size:18px; font-weight:700; letter-spacing:3px; border-radius:4px;">
          EXAMINATION RESULT
        </div>
      </div>

      <table style="border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333; white-space:nowrap;">Roll No:</td><td style="padding:5px 0; color:#1a1a1a;">${get('roll_no')}</td></tr>
        <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Student Name:</td><td style="padding:5px 0; color:#1a1a1a; font-weight:600;">${get('student_name')}</td></tr>
        <tr><td style="padding:5px 16px 5px 0; font-weight:600; color:#333;">Class:</td><td style="padding:5px 0; color:#1a1a1a;">${get('class')}</td></tr>
      </table>

      ${
        subjectColumns.length > 0
          ? `
      <div style="margin-bottom:24px;">
        <div style="font-size:14px; font-weight:700; color:#D32F2F; margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Subject Marks</div>
        <table style="width:100%; border-collapse:collapse; border:1px solid #e0e0e0;">
          <thead>
            <tr style="background:#D32F2F; color:#fff;">
              <th style="padding:8px 12px; text-align:left; font-size:13px; border:1px solid #c62828; width:60px;">S.No</th>
              <th style="padding:8px 12px; text-align:left; font-size:13px; border:1px solid #c62828;">Subject</th>
              <th style="padding:8px 12px; text-align:center; font-size:13px; border:1px solid #c62828; width:120px;">Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            ${subjectColumns
              .map(
                (col, i) => `
              <tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'};">
                <td style="padding:7px 12px; border:1px solid #e0e0e0; font-size:13px; text-align:center;">${i + 1}</td>
                <td style="padding:7px 12px; border:1px solid #e0e0e0; font-size:13px;">${escapeHTML(col)}</td>
                <td style="padding:7px 12px; border:1px solid #e0e0e0; font-size:13px; text-align:center; font-weight:600;">${escapeHTML(data[col] || '—')}</td>
              </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>`
          : ''
      }

      <div style="display:flex; gap:16px; margin-bottom:24px; flex-wrap:wrap;">
        ${
          get('total_marks')
            ? `<div style="padding:10px 20px; background:#fafafa; border:1px solid #e0e0e0; border-radius:8px; font-size:14px;"><span style="font-weight:600; color:#333;">Total Marks:</span> <span style="color:#1a1a1a; font-weight:700;">${get('total_marks')}</span></div>`
            : ''
        }
        ${
          get('percentage')
            ? `<div style="padding:10px 20px; background:#fafafa; border:1px solid #e0e0e0; border-radius:8px; font-size:14px;"><span style="font-weight:600; color:#333;">Percentage:</span> <span style="color:#1a1a1a; font-weight:700;">${get('percentage')}%</span></div>`
            : ''
        }
        ${
          get('grade')
            ? `<div style="padding:10px 20px; background:#D32F2F; color:#fff; border-radius:8px; font-size:14px; font-weight:700;">Grade: ${get('grade')}</div>`
            : ''
        }
      </div>

      ${
        get('remarks')
          ? `
      <div style="padding:12px 16px; background:#fff5f5; border-left:4px solid #D32F2F; border-radius:0 8px 8px 0; margin-bottom:24px; font-size:14px;">
        <span style="font-weight:600; color:#333;">Remarks:</span> <span style="color:#1a1a1a;">${get('remarks')}</span>
      </div>`
          : ''
      }

      <div style="display:flex; justify-content:space-between; margin-top:48px; padding-top:20px;">
        <div style="text-align:center;">
          <div style="border-top:1.5px solid #333; width:170px; padding-top:8px; font-size:12px; color:#666;">Student's Signature</div>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1.5px solid #333; width:170px; padding-top:8px; font-size:12px; color:#666;">Principal's Signature</div>
        </div>
      </div>
    </div>
  `;
}
