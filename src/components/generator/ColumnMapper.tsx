import { ColumnConfig } from "@/lib/types";

interface ColumnMapperProps {
  excelHeaders: string[];
  columns: ColumnConfig[];
  mapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
  hasSubjectColumns?: boolean;
  subjectColumns?: string[];
  onSubjectColumnsChange?: (cols: string[]) => void;
}

export default function ColumnMapper({
  excelHeaders,
  columns,
  mapping,
  onMappingChange,
  hasSubjectColumns = false,
  subjectColumns = [],
  onSubjectColumnsChange,
}: ColumnMapperProps) {
  const handleFieldChange = (fieldKey: string, excelHeader: string) => {
    onMappingChange({ ...mapping, [fieldKey]: excelHeader });
  };

  const mappedHeaders = new Set(Object.values(mapping).filter(Boolean));
  const unmappedHeaders = excelHeaders.filter((h) => !mappedHeaders.has(h));

  return (
    <div className="border border-border rounded-xl bg-card animate-fade-in">
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <h3 className="font-semibold text-foreground">Column Mapping</h3>
        <p className="text-sm text-muted-foreground">
          Map your Excel columns to template fields
        </p>
      </div>
      <div className="p-4 space-y-3">
        {columns.map((col) => (
          <div key={col.key} className="flex items-center gap-3">
            <label className="w-48 text-sm font-medium text-foreground flex items-center gap-1 shrink-0">
              {col.label}
              {col.required && <span className="text-destructive">*</span>}
            </label>
            <select
              value={mapping[col.key] || ''}
              onChange={(e) => handleFieldChange(col.key, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            >
              <option value="">— Select column —</option>
              {excelHeaders.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            {col.required && mapping[col.key] && (
              <span className="text-primary text-sm">✓</span>
            )}
          </div>
        ))}

        {hasSubjectColumns && onSubjectColumnsChange && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm font-semibold text-foreground mb-1">Subject Columns</p>
            <p className="text-xs text-muted-foreground mb-3">
              Select which unmapped columns contain subject marks
            </p>
            {unmappedHeaders.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {unmappedHeaders.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      if (subjectColumns.includes(h)) {
                        onSubjectColumnsChange(subjectColumns.filter((c) => c !== h));
                      } else {
                        onSubjectColumnsChange([...subjectColumns, h]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      subjectColumns.includes(h)
                        ? 'border-primary bg-primary/10 text-primary shadow-sm'
                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                All columns are mapped. Unmap a field above to make it available as a subject.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
