function esc(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function upper(str: string): string {
  return esc(str).toUpperCase();
}

function seatNumber(index: number): string {
  return `2026${String(index + 1).padStart(2, '0')}`;
}

export function generateAdmitCardHTML(
  data: Record<string, string>,
  mapping: Record<string, string>,
  index: number,
  logoUrl: string
): string {
  const get = (field: string) => upper(data[mapping[field]] || '');
  const seatNo = seatNumber(index);

  return `
    <div style="width:750px; padding:0; font-family:Arial,Helvetica,sans-serif; border:3px solid #000; background:#fff; box-sizing:border-box;">
      <div style="padding:24px 28px 0 28px;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; padding-bottom:14px;">
        <div>
          <img src="${logoUrl}" style="height:72px; display:block;" crossorigin="anonymous" />
        </div>
        <div style="text-align:right;">
          <div style="font-size:26px; font-weight:900; color:#000; letter-spacing:1px;">STUDY ROOM</div>
          <div style="font-size:17px; font-weight:700; color:#000; margin-top:2px;">SCHOLARSHIP TEST - 2026</div>
        </div>
      </div>

      <hr style="border:none; border-top:2px solid #000; margin:0 0 20px 0;" />

      <!-- Admit Card Table -->
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000;">
        <tr>
          <td colspan="2" style="padding:12px 14px; border:1.5px solid #000; text-align:center; font-size:20px; font-weight:900; letter-spacing:3px;">
            ADMIT CARD
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700; width:68%;">
            NAME : ${get('student_name')}
          </td>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            SEAT NO : ${seatNo}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            SCHOOL NAME : ${get('school_name')}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            MEDIUM : ${get('medium')}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            GROUP : ${get('group')}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            EXAM TIMING : 10:00 AM TO 12:20 PM
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px;">
            <div style="font-weight:700; margin-bottom:6px;">EXAMINATION CENTER :</div>
            <ul style="margin:0; padding-left:22px;">
              <li style="font-size:13px;">STUDYROOM CLASSES, Near Akshar School, Gopal Chowk, Paradise Hall Road, Rajkot-360005. <span style="text-decoration:underline; color:#0066cc;">CLICK HERE FOR MAP</span></li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 14px 10px; border:1.5px solid #000; font-size:13px; font-weight:600; vertical-align:bottom;">
            Candidate Signature :
          </td>
          <td style="padding:36px 14px 10px; border:1.5px solid #000; font-size:13px; font-weight:600; vertical-align:bottom;">
            Invigilator Signature :
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:12px 14px; border:1.5px solid #000; font-size:13px;">
            <div style="font-weight:900; margin-bottom:8px; font-size:14px;">RULES:</div>
            <ul style="margin:0; padding-left:22px; line-height:1.7;">
              <li>Arrive 15 minutes before the examination time</li>
              <li>Bring your School ID proof along with this hall ticket</li>
              <li>Electronic devices (calculator, smart watch etc.) are not allowed in the examination hall</li>
              <li>Use Black / Blue Ball point pen only for marking responses.</li>
              <li>Use of Whitener for correction is not permissible on the Answer Sheet.</li>
              <li>Follow all instructions given by the invigilator</li>
            </ul>
          </td>
        </tr>
      </table>
      </div>
    </div>
  `;
}

export function generateResultHTML(
  data: Record<string, string>,
  mapping: Record<string, string>,
  index: number,
  logoUrl: string
): string {
  const get = (field: string) => upper(data[mapping[field]] || '');
  const seatNo = seatNumber(index);
  const date = data[mapping['date']] ? upper(data[mapping['date']]) : '';

  const physics = data[mapping['physics']] || '—';
  const chemistry = data[mapping['chemistry']] || '—';
  const mathsBiology = data[mapping['maths_biology']] || '—';
  const total = data[mapping['total']] || '—';

  const divider = `<div style="text-align:center; padding:14px 0; font-size:16px; color:#555; letter-spacing:2px;">♦———♦—◇◆◇—♦———♦</div>`;

  return `
    <div style="width:750px; padding:0; font-family:Arial,Helvetica,sans-serif; border:3px solid #000; background:#fff; box-sizing:border-box;">
      <div style="padding:24px 28px 0 28px;">
      <!-- Header centered -->
      <div style="text-align:center; padding-bottom:8px;">
        <img src="${logoUrl}" style="height:80px; display:inline-block;" crossorigin="anonymous" />
        <div style="font-size:11px; color:#333; letter-spacing:1px; margin-top:2px; font-weight:600; font-style:italic;">
          A PERFECT PLACE FOR SCIENCE
        </div>
        <div style="font-size:22px; font-weight:900; color:#000; margin-top:10px; letter-spacing:1px;">
          STUDY ROOM SCHOLARSHIP TEST - 2026
        </div>
      </div>

      <!-- Student Info -->
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; margin-top:16px;">
        <tr>
          <td colspan="2" style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            STUDENT NAME: ${get('student_name')}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700; width:60%;">
            SEAT NO: ${seatNo}
          </td>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            DATE: ${date}
          </td>
        </tr>
      </table>

      ${divider}

      <!-- Results -->
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000;">
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            TOTAL CORRECT ANSWER: ${get('total_correct')}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            TOTAL INCORRECT ANSWER: ${get('total_incorrect')}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            NOT ATTEMPTED QUESTION: ${get('not_attempted')}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:700;">
            RANK: ${get('rank')}
          </td>
        </tr>
      </table>

      <!-- Subject Marks -->
      <table style="width:100%; border-collapse:collapse; border:1.5px solid #000; margin-top:16px;">
        <tr>
          <th style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:900; text-align:center;">PHYSICS</th>
          <th style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:900; text-align:center;">CHEMISTRY</th>
          <th style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:900; text-align:center;">MATHS / BIOLOGY</th>
          <th style="padding:10px 14px; border:1.5px solid #000; font-size:14px; font-weight:900; text-align:center;">TOTAL</th>
        </tr>
        <tr>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; text-align:center; font-weight:600;">${esc(physics)}</td>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; text-align:center; font-weight:600;">${esc(chemistry)}</td>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; text-align:center; font-weight:600;">${esc(mathsBiology)}</td>
          <td style="padding:10px 14px; border:1.5px solid #000; font-size:14px; text-align:center; font-weight:600;">${esc(total)}</td>
        </tr>
      </table>

      ${divider}

      <!-- Footer -->
      <div style="text-align:center; margin-top:60px;">
        <div style="font-weight:900; font-size:15px; color:#000;">STUDY ROOM</div>
        <div style="font-size:12px; color:#333; margin-top:4px;">
          Near Akshar School, Paradise Hall Road, Gopal Chowk, Rajkot-360005
        </div>
      </div>
      </div>
    </div>
  `;
}
