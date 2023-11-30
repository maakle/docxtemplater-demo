"use client";

import { useEffect, useRef } from "react";

interface DocxPreviewerProps {
  file: File;
}

export function DocxPreviewer({ file }: DocxPreviewerProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPreviewLibraryAsync() {
      const { renderAsync } = await import("docx-preview");
      const container = ref.current;

      if (file && container) {
        renderAsync(file, container);
      }
    }

    loadPreviewLibraryAsync();
  }, [file]);

  return (
    <div
      className="mt-8"
      ref={ref}
      style={{
        height: "1000px",
        width: "800px",
        overflowY: "auto",
      }}
    />
  );
}
