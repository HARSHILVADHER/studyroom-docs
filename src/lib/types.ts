export interface ColumnConfig {
  key: string;
  label: string;
  required: boolean;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface GeneratorConfig {
  title: string;
  description: string;
  columns: ColumnConfig[];
  hasSubjectColumns: boolean;
  generateHTML: (
    data: Record<string, string>,
    mapping: Record<string, string>,
    subjectColumns?: string[]
  ) => string;
  filenamePrefix: string;
}
