import * as XLSX from 'xlsx';

export interface ParseResult {
  headers: string[];
  data: Record<string, string>[];
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
          reject(new Error('No sheets found in file'));
          return;
        }

        const sheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
          defval: '',
        });

        if (jsonData.length === 0) {
          reject(new Error('No data found in file'));
          return;
        }

        const headers = Object.keys(jsonData[0]);
        const cleanData = jsonData.map((row) => {
          const cleaned: Record<string, string> = {};
          for (const [key, val] of Object.entries(row)) {
            cleaned[key] = val != null ? String(val) : '';
          }
          return cleaned;
        });

        resolve({ headers, data: cleanData });
      } catch (err) {
        reject(new Error('Failed to parse the file. Please ensure it is a valid Excel or CSV file.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}
