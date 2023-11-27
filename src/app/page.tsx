"use client";

import { FileDropArea } from "@/components/FileDropArea";
import Docxtemplater from "docxtemplater";
import InspectModule from "docxtemplater/js/inspect-module";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import { ChangeEvent, useState } from "react";

const getTags = async (file: File) => {
  const binaryFile = await file.arrayBuffer();
  const zip = new PizZip(binaryFile);
  const iModule = new InspectModule();

  // Create Docxtemplater instance with delimiters
  new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    modules: [iModule],
  });

  // Get all placeholder tags
  const tags = iModule.getAllTags();
  console.log(tags);
  return tags;
};

const generateDocument = async (
  file: File | undefined,
  tags: Record<string, unknown>
) => {
  if (!file) return;

  const binaryFile = await file.arrayBuffer();
  const zip = new PizZip(binaryFile);
  const iModule = new InspectModule();

  // Create Docxtemplater instance
  const doc = new Docxtemplater(zip, {
    delimiters: { start: "{{", end: "}}" },
    modules: [iModule],
  });

  // Render document (replace all occurences of {{ XXX }}
  doc.render(tags);

  // Export document
  const blob = doc.getZip().generate({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });

  saveAs(blob, "output.docx");
};

export default function Home() {
  const [tags, setTags] = useState<Record<string, unknown>>({});
  const [file, setFile] = useState<File>();

  const scanDocumentForTags = async (file: File) => {
    const tags = await getTags(file);
    setTags(tags);
    setFile(file);
  };

  const setTagValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setTags((tags) => ({ ...tags, [id]: value }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-8 max-w-xl mx-auto px-8">
          <h1 className="text-center">
            <span className="block text-5xl font-bold leading-none">
              Docxtemplater Demo
            </span>
          </h1>
          <div className="mt-12">
            <FileDropArea
              onFileAccepted={scanDocumentForTags}
              maxFileSizeMB={10}
            />
          </div>

          {tags && Object.keys(tags).length > 0 && (
            <div className="mt-12">
              <h2 className="text-center">
                <span className="block text-3xl font-bold leading-none">
                  Placeholder Tags
                </span>
              </h2>
              <div className="mt-8">
                <ul className="list-disc list-inside">
                  {Object.keys(tags).map((tag) => (
                    <div key={tag} className="mt-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6"
                      >
                        {tag}
                      </label>
                      <div className="mt-2">
                        <input
                          id={tag}
                          className="block w-full rounded-md border-0 py-1.5 px-2 dark:bg-black text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder={tag}
                          onChange={setTagValue}
                        />
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => generateDocument(file, tags)}
                  className="inline-block bg-gray-900 dark:bg-white hover:bg-gray-800 text-white dark:text-black dark:hover:bg-gray-100 font-medium rounded-lg px-6 py-4 leading-tight"
                >
                  Generate document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
