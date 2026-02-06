import { useState, useCallback } from "react";
import { ArrowLeft, Loader2, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { GeneratorConfig, ValidationError } from "@/lib/types";
import { parseExcelFile } from "@/lib/excel-parser";
import { generatePDFFromHTML, downloadBlob, generateBulkZip } from "@/lib/pdf-generator";
import FileUpload from "./FileUpload";
import DataPreview from "./DataPreview";
import ColumnMapper from "./ColumnMapper";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface GeneratorFlowProps {
  config: GeneratorConfig;
}

type Step = "upload" | "preview" | "results";

export default function GeneratorFlow({ config }: GeneratorFlowProps) {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [subjectColumns, setSubjectColumns] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [previewHTMLs, setPreviewHTMLs] = useState<string[]>([]);
  const [generatedBlobs, setGeneratedBlobs] = useState<{ blob: Blob; filename: string }[]>([]);

  const handleFileSelected = useCallback(
    async (f: File) => {
      try {
        const { headers: h, data: d } = await parseExcelFile(f);
        setFile(f);
        setHeaders(h);
        setData(d);

        // Auto-map columns by matching header names
        const autoMapping: Record<string, string> = {};
        for (const col of config.columns) {
          const normalizedKey = col.key.toLowerCase().replace(/[_\s]/g, "");
          const match = h.find(
            (header) => header.toLowerCase().replace(/[_\s]/g, "") === normalizedKey
          );
          if (match) autoMapping[col.key] = match;
        }
        setMapping(autoMapping);

        // Auto-detect subject columns for results
        if (config.hasSubjectColumns) {
          const mappedValues = new Set(Object.values(autoMapping));
          const possibleSubjects = h.filter((header) => !mappedValues.has(header));
          setSubjectColumns(possibleSubjects);
        }

        setStep("preview");
        toast.success(`Loaded ${d.length} student records`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to parse file");
      }
    },
    [config]
  );

  const handleClearFile = () => {
    setFile(null);
    setHeaders([]);
    setData([]);
    setMapping({});
    setSubjectColumns([]);
    setErrors([]);
    setStep("upload");
  };

  const validateData = (): ValidationError[] => {
    const errs: ValidationError[] = [];
    const requiredFields = config.columns.filter((c) => c.required);
    const rollNos = new Map<string, number>();

    data.forEach((row, i) => {
      requiredFields.forEach((field) => {
        const excelCol = mapping[field.key];
        if (!excelCol || !row[excelCol]?.toString().trim()) {
          errs.push({
            row: i + 1,
            field: field.label,
            message: `${field.label} is missing`,
          });
        }
      });

      const rollCol = mapping["roll_no"];
      if (rollCol && row[rollCol]) {
        const roll = row[rollCol].trim();
        if (rollNos.has(roll)) {
          errs.push({
            row: i + 1,
            field: "Roll No",
            message: `Duplicate roll number: ${roll} (also in row ${rollNos.get(roll)})`,
          });
        } else {
          rollNos.set(roll, i + 1);
        }
      }
    });

    return errs;
  };

  const isReadyToGenerate = () => {
    const requiredFields = config.columns.filter((c) => c.required);
    return requiredFields.every((f) => mapping[f.key]);
  };

  const handleGenerate = async () => {
    const validationErrors = validateData();
    setErrors(validationErrors);

    const requiredFields = config.columns.filter((c) => c.required);
    const criticalErrorRows = new Set(
      validationErrors
        .filter((e) => requiredFields.some((f) => f.label === e.field))
        .map((e) => e.row)
    );

    setIsGenerating(true);
    setGeneratedCount(0);

    const htmls: string[] = [];
    const blobs: { blob: Blob; filename: string }[] = [];

    try {
      for (let i = 0; i < data.length; i++) {
        if (criticalErrorRows.has(i + 1)) continue;

        const row = data[i];
        const html = config.generateHTML(row, mapping, subjectColumns);
        htmls.push(html);

        const blob = await generatePDFFromHTML(html);
        const rollNo = row[mapping["roll_no"]] || String(i + 1);
        const name = row[mapping["student_name"]] || "Student";
        const cleanName = name.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
        const filename = `${config.filenamePrefix}_${rollNo}_${cleanName}.pdf`;
        blobs.push({ blob, filename });

        setGeneratedCount(blobs.length);
      }

      setPreviewHTMLs(htmls);
      setGeneratedBlobs(blobs);
      setStep("results");
      toast.success(`Generated ${blobs.length} ${config.filenamePrefix.toLowerCase()} cards!`);
    } catch (err) {
      toast.error("An error occurred during generation.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSingle = (index: number) => {
    const { blob, filename } = generatedBlobs[index];
    downloadBlob(blob, filename);
    toast.success(`Downloaded ${filename}`);
  };

  const handleDownloadAll = async () => {
    try {
      await generateBulkZip(generatedBlobs, `${config.filenamePrefix}_Cards`);
      toast.success("Downloaded all as ZIP!");
    } catch {
      toast.error("Failed to create ZIP file.");
    }
  };

  const handleStartOver = () => {
    setFile(null);
    setHeaders([]);
    setData([]);
    setMapping({});
    setSubjectColumns([]);
    setErrors([]);
    setPreviewHTMLs([]);
    setGeneratedBlobs([]);
    setGeneratedCount(0);
    setStep("upload");
  };

  const steps: { key: Step; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "preview", label: "Preview & Map" },
    { key: "results", label: "Download" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground mt-1">{config.description}</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => {
            const isActive = step === s.key;
            const isDone = currentStepIndex > i;
            return (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className={`h-px w-6 sm:w-10 transition-colors ${
                      isDone ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : isDone
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {isDone ? "✓" : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upload step */}
        {step === "upload" && (
          <div className="animate-fade-in">
            <FileUpload file={file} onFileSelected={handleFileSelected} onClear={handleClearFile} />
          </div>
        )}

        {/* Preview & Map step */}
        {step === "preview" && (
          <div className="space-y-6 animate-fade-in">
            <DataPreview headers={headers} data={data} />

            <ColumnMapper
              excelHeaders={headers}
              columns={config.columns}
              mapping={mapping}
              onMappingChange={setMapping}
              hasSubjectColumns={config.hasSubjectColumns}
              subjectColumns={subjectColumns}
              onSubjectColumnsChange={setSubjectColumns}
            />

            {errors.length > 0 && (
              <div className="border border-destructive/30 rounded-xl p-4 bg-destructive/5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                  <h3 className="font-semibold text-destructive">
                    Validation Warnings ({errors.length})
                  </h3>
                </div>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {errors.slice(0, 20).map((e, i) => (
                    <li key={i} className="text-sm text-destructive/80">
                      Row {e.row}: {e.message}
                    </li>
                  ))}
                  {errors.length > 20 && (
                    <li className="text-sm text-destructive/60">
                      …and {errors.length - 20} more
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleClearFile}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Change File
              </button>
              <button
                onClick={handleGenerate}
                disabled={!isReadyToGenerate() || isGenerating}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating ({generatedCount}/{data.length})…
                  </>
                ) : (
                  <>Generate {data.length} Cards</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results step */}
        {step === "results" && (
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="border border-border rounded-xl p-6 bg-card">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Generation Complete</h2>
                  <p className="text-muted-foreground text-sm">
                    Generated {generatedBlobs.length} cards
                    {errors.filter((e) =>
                      config.columns
                        .filter((c) => c.required)
                        .some((c) => c.label === e.field)
                    ).length > 0 &&
                      ` • ${
                        new Set(
                          errors
                            .filter((e) =>
                              config.columns
                                .filter((c) => c.required)
                                .some((c) => c.label === e.field)
                            )
                            .map((e) => e.row)
                        ).size
                      } rows skipped due to errors`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDownloadAll}
                className="w-full px-6 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-accent transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download All as ZIP ({generatedBlobs.length} files)
              </button>
            </div>

            {/* Preview grid */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewHTMLs.slice(0, 6).map((html, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="overflow-hidden" style={{ height: "280px" }}>
                      <div
                        className="origin-top-left"
                        style={{
                          transform: "scale(0.38)",
                          width: "calc(100% / 0.38)",
                          pointerEvents: "none",
                        }}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    </div>
                    <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground truncate max-w-[60%]">
                        {generatedBlobs[i]?.filename}
                      </span>
                      <button
                        onClick={() => handleDownloadSingle(i)}
                        className="text-primary hover:text-accent text-sm font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {previewHTMLs.length > 6 && (
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Showing 6 of {previewHTMLs.length} cards. Download all to view the rest.
                </p>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleStartOver}
                className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary border border-border hover:border-primary/30 rounded-xl transition-all"
              >
                ← Start Over
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
