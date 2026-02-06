import GeneratorFlow from "@/components/generator/GeneratorFlow";
import { GeneratorConfig } from "@/lib/types";
import { generateAdmitCardHTML } from "@/lib/templates";

const admitCardConfig: GeneratorConfig = {
  title: "Admit Card Generator",
  description: "Upload student data and generate printable admit cards as PDF",
  columns: [
    { key: "roll_no", label: "Roll Number", required: true },
    { key: "student_name", label: "Student Name", required: true },
    { key: "class", label: "Class", required: true },
    { key: "dob", label: "Date of Birth", required: false },
    { key: "father_name", label: "Father's Name", required: false },
    { key: "exam_center", label: "Exam Center", required: false },
    { key: "photo_url", label: "Photo URL", required: false },
    { key: "subjects", label: "Subjects (comma-separated)", required: false },
  ],
  hasSubjectColumns: false,
  generateHTML: (data, mapping) => generateAdmitCardHTML(data, mapping),
  filenamePrefix: "Admit",
};

export default function AdmitCardGenerator() {
  return <GeneratorFlow config={admitCardConfig} />;
}
