import GeneratorFlow from "@/components/generator/GeneratorFlow";
import { GeneratorConfig } from "@/lib/types";
import { generateResultHTML } from "@/lib/templates";

const resultConfig: GeneratorConfig = {
  title: "Result Generator",
  description: "Upload examination data and generate result slips as PDF",
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
      key: "total_correct",
      label: "Total Correct Answer",
      required: false,
      matchHeaders: [
        "Total Correct Answer",
        "Correct Answer",
        "Correct",
        "total_correct",
      ],
    },
    {
      key: "total_incorrect",
      label: "Total Incorrect Answer",
      required: false,
      matchHeaders: [
        "Total Incorrect Answer",
        "Incorrect Answer",
        "Incorrect",
        "total_incorrect",
      ],
    },
    {
      key: "not_attempted",
      label: "Not Attempted Question",
      required: false,
      matchHeaders: [
        "Not Attempted Question",
        "Not Attempted",
        "not_attempted",
      ],
    },
    {
      key: "rank",
      label: "Rank",
      required: false,
      matchHeaders: ["Rank", "rank"],
    },
    {
      key: "physics",
      label: "Physics",
      required: false,
      matchHeaders: ["Physics", "physics"],
    },
    {
      key: "chemistry",
      label: "Chemistry",
      required: false,
      matchHeaders: ["Chemistry", "chemistry"],
    },
    {
      key: "maths_biology",
      label: "Maths / Biology",
      required: false,
      matchHeaders: [
        "Maths / Biology",
        "Maths/Biology",
        "Maths",
        "Biology",
        "maths_biology",
      ],
    },
    {
      key: "total",
      label: "Total",
      required: false,
      matchHeaders: ["Total", "total", "Total Marks"],
    },
    {
      key: "date",
      label: "Date",
      required: false,
      matchHeaders: ["Date", "date", "Result Date"],
    },
  ],
  generateHTML: (data, mapping, index, logoUrl) =>
    generateResultHTML(data, mapping, index, logoUrl),
  filenamePrefix: "Result",
};

export default function ResultGenerator() {
  return <GeneratorFlow config={resultConfig} />;
}
