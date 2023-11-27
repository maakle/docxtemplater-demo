"use client";

import { FileDropArea } from "@/components/FileDropArea";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";

const generateDocument = async (file: File) => {
  const binaryFile = await file.arrayBuffer();
  const zip = new PizZip(binaryFile);

  // Create Docxtemplater instance
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
  });

  // Render document (replace all occurences of {{ XXX }}
  doc.render({
    company_firstname: "Hipp",
    company_lastname: "Edgar",
    employee_firstname: "Peter",
    employee_lastname: "Lustig",
    employee_address: "Sonnenalle 54, 12345 Berlin",
    employee_jobtitle_de: "Senior Software Engineer",
    employee_description_de: "Tut Dinge...",
    employee_jobtitle_en: "Senior Software Engineer",
    employee_description_en: "Doing things...",
    salary_annually: "100.000 EUR",
    salary_monthly: "8.000 EUR",
    holiday: "28",
    start_date: "1.1.2024",
    city_signature: "Berlin",
    date_signature: "1.2.2023",
  });

  // Export document
  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(blob, "output.docx");
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-8 max-w-xl mx-auto px-8">
          <h1 className="text-center">
            <span className="block text-5xl font-bold leading-none">
              Docxtemplater Demo
            </span>
          </h1>
          <div className="mt-12 text-center">
            <FileDropArea
              onFileAccepted={generateDocument}
              maxFileSizeMB={10}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
