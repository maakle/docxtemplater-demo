import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

interface TagInput {
  tag: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TagInput({ tag, onChange }: TagInput) {
  return (
    <div className="mt-4">
      <label htmlFor="email" className="block text-sm font-medium leading-6">
        {tag}
      </label>
      <div className="mt-2">
        <input
          id={tag}
          className="block w-full rounded-md border-0 py-1.5 px-2 dark:bg-black text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={tag}
          onChange={onChange}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ExclamationCircleIcon
            className="h-5 w-5 text-red-500"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
