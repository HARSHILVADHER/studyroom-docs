interface DataPreviewProps {
  headers: string[];
  data: Record<string, string>[];
  maxRows?: number;
}

export default function DataPreview({ headers, data, maxRows = 10 }: DataPreviewProps) {
  const previewData = data.slice(0, maxRows);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card animate-fade-in">
      <div className="px-4 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Data Preview</h3>
        <span className="text-sm text-muted-foreground font-medium">
          Total students: <span className="text-primary font-bold">{data.length}</span>
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                #
              </th>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/20 transition-colors">
                <td className="px-3 py-2 text-muted-foreground font-mono text-xs">{i + 1}</td>
                {headers.map((h) => (
                  <td
                    key={h}
                    className="px-3 py-2 whitespace-nowrap max-w-[200px] truncate"
                    title={row[h] || ''}
                  >
                    {row[h] || <span className="text-muted-foreground/50">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > maxRows && (
        <div className="px-4 py-2 border-t border-border bg-muted/30 text-center text-xs text-muted-foreground">
          Showing first {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
}
