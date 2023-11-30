"use client";

import { DocxPreviewer } from "@/components/DocxPreviewer";
import { showErrorToast } from "@/components/ErrorToast";
import { FileDropArea } from "@/components/FileDropArea";
import { TagInput } from "@/components/TagInput";
import { createDocxWithTags, getTags } from "@/lib/docxtemplater";
import { isEmpty } from "ramda";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [tags, setTags] = useState<Record<string, unknown>>({});
  const [file, setFile] = useState<File>();

  const scanDocumentForTags = async (file: File) => {
    const newTags = await getTags(file);

    if (Object.keys(newTags).length > 0) {
      setTags(newTags);
      setFile(file);
    } else {
      showErrorToast(`No tags found. Please try another document.`);
    }
  };

  const setTagValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setTags((tags) => ({ ...tags, [id]: value }));
  };

  const generateDocument = () => {
    const missingValue = [];

    for (const key in tags) {
      if (isEmpty(tags[key])) {
        missingValue.push(key);
      }
    }

    if (missingValue.length === 0) {
      createDocxWithTags(file, tags);
    } else {
      showErrorToast(
        `Please fill in the following tags: ${missingValue.join(", ")}`
      );
    }
  };

  const resetFile = () => {
    setFile(undefined);
    setTags({});
  };

  return (
    <main className="flex bg-stone-100 dark:bg-zinc-900 min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-8 mx-auto px-8">
          <h1 className="text-center">
            <span className="block text-5xl font-bold leading-none">
              Replace {`{{ tag}}`} in Docx File
            </span>
          </h1>
          <h2 className="mt-12 text-center font-medium">
            <span className="block text-3xl font-bold leading-none">
              Step 1: Upload a .docx file
            </span>
          </h2>
          <div className="flex justify-center mt-12">
            {file ? (
              <button
                className="inline-block border bg-white dark:bg-black hover:bg-stone-100 text-black dark:text-white dark:hover:bg-gray-900 font-medium rounded-lg px-6 py-4 leading-tight"
                onClick={resetFile}
              >
                Reset File
              </button>
            ) : (
              <div className="w-96">
                <FileDropArea
                  onFileAccepted={scanDocumentForTags}
                  maxFileSizeMB={10}
                />
              </div>
            )}
          </div>

          <div className="mt-12">
            {tags && Object.keys(tags).length > 0 && (
              <>
                <h2 className="text-center font-medium">
                  <span className="block text-3xl font-bold leading-none">
                    Step 2: Replace all tags
                  </span>
                </h2>
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <h3 className="font-bold">Replace tags</h3>
                      <ul className="list-disc list-inside">
                        {Object.keys(tags).map((tag) => (
                          <TagInput
                            key={tag}
                            tag={tag}
                            onChange={setTagValue}
                          />
                        ))}
                      </ul>
                    </div>
                    <div>
                      {file && (
                        <>
                          <h3 className="font-bold">Preview Document</h3>
                          <DocxPreviewer file={file} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-12">
                  <h2 className="text-center font-medium">
                    <span className="block text-3xl font-bold leading-none">
                      Step 3: Generate export
                    </span>
                  </h2>
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={generateDocument}
                    className="inline-block bg-gray-900 dark:bg-white hover:bg-gray-800 text-white dark:text-black dark:hover:bg-gray-100 font-medium rounded-lg px-6 py-4 leading-tight"
                  >
                    Generate Document
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
