import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
interface TagInput {
  tag: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TagInput({ tag, onChange }: TagInput) {
  const [value, setValue] = useState<string>("");

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium leading-6">{tag}</label>

      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          id={tag}
          className="block w-full rounded-md border-0 py-1.5 px-2 dark:bg-neutral-900 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          aria-invalid="true"
          placeholder="Please enter..."
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e);
          }}
        />
        {!value && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
