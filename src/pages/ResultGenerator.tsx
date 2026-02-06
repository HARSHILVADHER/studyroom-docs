import GeneratorFlow from "@/components/generator/GeneratorFlow";
import { GeneratorConfig } from "@/lib/types";
import { generateResultHTML } from "@/lib/templates";

const resultConfig: GeneratorConfig = {
  title: "Result Generator",
  description: "Upload examination data and generate result slips as PDF",
  columns: [
    { key: "roll_no", label: "Roll Number", required: true },
    { key: "student_name", label: "Student Name", required: true },
    { key: "class", label: "Class", required: true },
    { key: "total_marks", label: "Total Marks", required: false },
    { key: "percentage", label: "Percentage", required: false },
    { key: "grade", label: "Grade", required: false },
    { key: "remarks", label: "Remarks", required: false },
  ],
  hasSubjectColumns: true,
  generateHTML: (data, mapping, subjectColumns) =>
    generateResultHTML(data, mapping, subjectColumns),
  filenamePrefix: "Result",
};

export default function ResultGenerator() {
  return <GeneratorFlow config={resultConfig} />;
}
