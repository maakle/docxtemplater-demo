"use client";

import { showErrorToast } from "@/components/ErrorToast";
import { FileDropArea } from "@/components/FileDropArea";
import { TagInput } from "@/components/TagInput";
import { createDocxWithTags, getTags } from "@/lib/docxtemplater";
import * as docx from "docx-preview";
import { isEmpty } from "ramda";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [tags, setTags] = useState<Record<string, unknown>>({});
  const [file, setFile] = useState<File>();

  const tagsExist = tags && Object.keys(tags).length > 0;

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

  useEffect(() => {
    if (file) {
      const container = document.getElementById("preview") as HTMLElement;
      docx.renderAsync(file, container);
    }
  }, [file]);

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
            <FileDropArea
              onFileAccepted={scanDocumentForTags}
              maxFileSizeMB={10}
            />
          </div>

          <div className="mt-12">
            {tagsExist && (
              <>
                <h2 className="text-center font-medium">
                  <span className="block text-3xl font-bold leading-none">
                    Step 2: Replace all tags
                  </span>
                </h2>
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-10">
                    <div>
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
                          <div
                            className="mt-8"
                            id="preview"
                            style={{
                              height: "1000px",
                              width: "800px",
                              overflowY: "auto",
                            }}
                          />
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
