"use client";

import { FileDropArea } from "@/components/FileDropArea";
import { TagInput } from "@/components/TagInput";
import { generateDocument, getTags } from "@/lib/docxtemplater";
import { ChangeEvent, useState } from "react";

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
    <main className="flex bg-stone-100 dark:bg-zinc-900 min-h-screen flex-col items-center justify-between p-24">
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
                    <TagInput key={tag} tag={tag} onChange={setTagValue} />
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
