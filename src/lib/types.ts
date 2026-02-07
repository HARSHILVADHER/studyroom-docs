export interface FieldMapping {
  key: string;
  label: string;
  required: boolean;
  matchHeaders: string[];
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface GeneratorConfig {
  title: string;
  description: string;
  fields: FieldMapping[];
  generateHTML: (
    data: Record<string, string>,
    mapping: Record<string, string>,
    index: number,
    logoUrl: string
  ) => string;
  filenamePrefix: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function autoMapFields(
  excelHeaders: string[],
  fields: FieldMapping[]
): Record<string, string> {
  const mapping: Record<string, string> = {};

  for (const field of fields) {
    for (const header of excelHeaders) {
      const nh = normalize(header);
      const match = field.matchHeaders.some((mh) => normalize(mh) === nh);
      if (match) {
        mapping[field.key] = header;
        break;
      }
    }
  }

  return mapping;
}
