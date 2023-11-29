import { UploadIcon } from "@radix-ui/react-icons";
import { clamp } from "ramda";
import Dropzone, {
  ErrorCode as DzErrorCode,
  FileRejection,
} from "react-dropzone";
import { twMerge } from "tailwind-merge";

const acceptOptions = {
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  // "application/pdf": [".pdf"],
};

export enum ErrorCode {
  TooManyFiles,
  FileTooLarge,
  FileTypeInvalid,
  Unknown,
}

export function FileDropArea({
  onFileAccepted,
  onError = showFileDropErrorToast,
  loading,
  progress,
  maxFileSizeMB,
  invalid,
  onFileDialogCancel,
}: {
  onFileAccepted: (file: File) => void;
  onError?: (errorCode: ErrorCode) => void;
  onFileDialogCancel?: () => void;
  disabled?: boolean;
  loading?: boolean;
  progress?: number;
  maxFileSizeMB: number;
  invalid?: boolean;
}) {
  progress = clamp(0, 100, progress);

  return (
    <Dropzone
      multiple={false}
      accept={acceptOptions}
      maxSize={maxFileSizeMB * 1024 * 1024}
      onFileDialogCancel={onFileDialogCancel}
      onDrop={(acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length + acceptedFiles.length > 1) {
          onError(ErrorCode.TooManyFiles);
        } else if (rejectedFiles.length === 1) {
          onError(getRejectedFileErrorCode(rejectedFiles[0]));
        } else if (acceptedFiles.length === 1) {
          onFileAccepted(acceptedFiles[0]);
        } else {
          // Logically, this code is unreachable:
          // If the sum of both acceptedFiles & rejectedFiles is 1,
          // One of them must contain at least on element,
          // Hence one of the two previous ifs should be evaluated.
          onError(ErrorCode.Unknown);
        }
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="flex items-center justify-center w-full"
        >
          <div
            className={twMerge(
              "relative overflow-hidden flex flex-col items-center justify-center w-full py-4 border rounded-md cursor-pointer",
              "bg-white dark:hover:bg-bray-800 dark:bg-neutral-900 hover:bg-stone-50 dark:border-zinc-800 dark:hover:bg-neutral-800",
              invalid && "border-rose-600 dark:border-rose-500"
            )}
          >
            {loading ? (
              <div className="py-4 flex items-center space-x-5">
                <div className="w-5 h-5 mb-2">Loading</div>
                <div>
                  <p className="mb-1 text-xs text-stone-500 dark:text-stone-400">
                    Uploading...
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4 flex items-center space-x-5">
                <UploadIcon className="h-5 w-5 self-center text-stone-500 dark:text-stone-400" />
                <div>
                  <p className="mb-1 text-xs text-stone-500 dark:text-stone-400">
                    Drop your file here
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Maximum 10 mb
                  </p>
                </div>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              {...getInputProps()}
            />
            {loading && progress ? (
              <div
                className="absolute w-full h-full left-[-100%] bg-green-400 opacity-25 transform-gpu"
                style={{
                  transform: `translateX(${progress}%)`,
                }}
              />
            ) : null}
          </div>
        </div>
      )}
    </Dropzone>
  );
}

function showFileDropErrorToast(errorCode: ErrorCode): void {
  const messages = {
    [ErrorCode.TooManyFiles]: "Please upload 1 file only.",
    [ErrorCode.FileTypeInvalid]: "This file type is not supported.",
    [ErrorCode.FileTooLarge]: "This file is too big.",
    [ErrorCode.Unknown]: "We could not process this file, please try another.",
  };

  console.error(messages[errorCode]);
}

function getRejectedFileErrorCode(rejectedFile: FileRejection): ErrorCode {
  if (
    rejectedFile.errors.some(
      (error) => error.code === DzErrorCode.FileInvalidType.toString()
    )
  ) {
    return ErrorCode.FileTypeInvalid;
  }

  if (
    rejectedFile.errors.some(
      (error) => error.code === DzErrorCode.FileTooLarge.toString()
    )
  ) {
    return ErrorCode.FileTooLarge;
  }

  return ErrorCode.Unknown;
}
