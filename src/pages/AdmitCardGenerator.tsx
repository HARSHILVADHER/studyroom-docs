import GeneratorFlow from "@/components/generator/GeneratorFlow";
import { GeneratorConfig } from "@/lib/types";
import { generateAdmitCardHTML } from "@/lib/templates";

const admitCardConfig: GeneratorConfig = {
  title: "Admit Card Generator",
  description: "Upload student data and generate printable admit cards as PDF",
  fields: [
    {
      key: "student_name",
      label: "Student Name",
      required: true,
      matchHeaders: [
        "Student's Full Name (In capital)",
        "Student's Full Name",
        "Student Full Name",
        "Student Name",
        "student_name",
        "Name",
        "Full Name",
      ],
    },
    {
      key: "school_name",
      label: "School Name",
      required: true,
      matchHeaders: [
        "School Name",
        "school_name",
        "School",
      ],
    },
    {
      key: "medium",
      label: "Medium",
      required: true,
      matchHeaders: [
        "Medium",
        "medium",
      ],
    },
    {
      key: "group",
      label: "Group",
      required: true,
      matchHeaders: [
        "Group",
        "group",
      ],
    },
  ],
  generateHTML: (data, mapping, index, logoUrl) =>
    generateAdmitCardHTML(data, mapping, index, logoUrl),
  filenamePrefix: "Admit",
};

export default function AdmitCardGenerator() {
  return <GeneratorFlow config={admitCardConfig} />;
}
