"use client";

import { showErrorToast } from "@/components/ErrorToast";
import { FileDropArea } from "@/components/FileDropArea";
import { TagInput } from "@/components/TagInput";
import { generateDocument, getTags } from "@/lib/docxtemplater";
import { isEmpty } from "ramda";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [tags, setTags] = useState<Record<string, unknown>>({});
  const [file, setFile] = useState<File>();
  const [fileUrl, setFileUrl] = useState<string>("");

  const scanDocumentForTags = async (file: File) => {
    const tags = await getTags(file);
    setTags(tags);
    setFile(file);
    setFileUrl(URL.createObjectURL(file));
  };

  const setTagValue = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setTags((tags) => ({ ...tags, [id]: value }));
  };

  const processTags = () => {
    const missingValue = [];

    for (const key in tags) {
      if (isEmpty(tags[key])) {
        missingValue.push(key);
      }
    }

    if (missingValue.length > 0) {
      showErrorToast(
        `Please fill in the following tags: ${missingValue.join(", ")}`
      );
      return;
    }

    generateDocument(file, tags);
  };

  console.log(fileUrl);

  return (
    <main className="flex bg-stone-100 dark:bg-zinc-900 min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="mt-8 mx-auto px-8">
          <h1 className="text-center">
            <span className="block text-5xl font-bold leading-none">
              Replace tags in Docx File
            </span>
          </h1>
          <div className="flex justify-center mt-12">
            <FileDropArea
              onFileAccepted={scanDocumentForTags}
              maxFileSizeMB={10}
            />
          </div>

          <div className="mt-12">
            {tags && Object.keys(tags).length > 0 && (
              <>
                <h2 className="text-center font-medium">
                  <span className="block text-3xl font-bold leading-none">
                    Replace all tags
                  </span>
                </h2>
                <div className="mt-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold">Found Curly Tags</h3>
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
                      {fileUrl && (
                        <iframe
                          className={"docx"}
                          width="100%"
                          height="600"
                          src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-8">
                  <button
                    onClick={processTags}
                    className="inline-block bg-gray-900 dark:bg-white hover:bg-gray-800 text-white dark:text-black dark:hover:bg-gray-100 font-medium rounded-lg px-6 py-4 leading-tight"
                  >
                    Generate document
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
