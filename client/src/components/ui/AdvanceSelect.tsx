import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

type Option<T = string> = {
  label: string;
  value: T;
};

type SelectProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  label?: {
    content?: string;
    className?: string;
  };
  placeholder?: string;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  required?: boolean;
  options: Option[];
  disabled?: boolean;
  className?: string;
};

/**
 * AdvancedSelect is a reusable and accessible select (dropdown) component
 * designed to integrate seamlessly with `react-hook-form`.
 *
 * ✅ Features:
 * - Full support for `react-hook-form`'s `register` and `errors`.
 * - Displays optional label with required asterisk.
 * - Supports a placeholder and disabled state.
 * - Shows validation error message with icon.
 * - Custom dropdown arrow icon styled with Tailwind CSS.
 * - Fully typed with generics using `FieldValues` and `Path<T>`.
 *
 * @template T - Form field values extending `FieldValues` from `react-hook-form`.
 *
 * @prop {string} id - Unique identifier for the select input (used for `htmlFor`).
 * @prop {Path<T>} name - Name/path of the form field (typed with react-hook-form `Path<T>`).
 * @prop {Object} [label] - Optional label configuration.
 * @prop {string} [label.content] - Text to display as label.
 * @prop {string} [label.className] - Optional custom class for the label.
 * @prop {string} [placeholder] - Optional placeholder text (shown as first disabled option).
 * @prop {UseFormRegister<T>} register - React Hook Form's `register` function.
 * @prop {FieldErrors<T>} [errors] - Error object from `useForm`, used to show field-specific error.
 * @prop {boolean} [required] - Whether the field is required; shows a red asterisk if true.
 * @prop {Option[]} options - Array of options to render inside the select.
 * @prop {boolean} [disabled=false] - Disables the select input when true.
 * @prop {string} [className] - Optional custom classes for the wrapper.
 *
 * @returns {JSX.Element} A fully controlled select input with label, validation, and styling.
 */

const AdvancedSelect = <T extends FieldValues>({
  id,
  name,
  label,
  placeholder,
  register,
  errors = {},
  required,
  options,
  disabled = false,
  className = "",
}: SelectProps<T>) => {
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      {label?.content && (
        <label
          htmlFor={id}
          className={
            label?.className ||
            `block text-sm font-medium ${
              disabled ? "text-gray-400" : "text-gray-700"
            } mb-1`
          }
        >
          {label.content} {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          {...register(name)}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-lg border appearance-none ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-gray-500"
          } focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-200" : "focus:ring-gray-200"
          } transition-all`}
          defaultValue=""
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown icon */}
        {!disabled && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-600 text-sm mt-1 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default AdvancedSelect;
