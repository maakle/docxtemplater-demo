import Docxtemplater from "docxtemplater";
import InspectModule from "docxtemplater/js/inspect-module";
import saveAs from "file-saver";
import PizZip from "pizzip";

export const getTags = async (file: File) => {
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
  return tags;
};

export const createDocxWithTags = async (
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
