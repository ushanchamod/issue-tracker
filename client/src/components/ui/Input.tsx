import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

type InputProps<T extends FieldValues> = {
  id: string;
  name: Path<T>;
  type?: "text" | "number" | "email" | "password";
  label?: {
    content?: string;
    className?: string;
  };
  placeholder?: string;
  register: UseFormRegister<T>;
  errors?: FieldErrors<T>;
  required?: boolean;
  autoFocus?: boolean;
};

/**
 * Input component integrates with react-hook-form for form state management.
 * Supports text, number, email, and password types, including toggleable password visibility.
 * Displays label, placeholder, validation error messages, and required indicator.
 *
 * @template T - The form's field values type extending react-hook-form's FieldValues.
 *
 * @param {string} id - Unique identifier for the input element.
 * @param {Path<T>} name - The name/path of the form field, typed for react-hook-form.
 * @param {"text" | "number" | "email" | "password"} [type="text"] - The input type.
 * @param {Object} [label] - Optional label configuration.
 * @param {string} [label.content] - Text content of the label.
 * @param {string} [label.className] - Optional custom class for the label.
 * @param {string} [placeholder] - Placeholder text for the input.
 * @param {UseFormRegister<T>} register - React Hook Form's register function.
 * @param {FieldErrors<T>} [errors] - Validation errors object from react-hook-form.
 * @param {boolean} [required] - Whether the input is required; adds a red asterisk if true.
 * @param {boolean} [autoFocus] - Whether the input is autoFocus;
 *
 * @returns {JSX.Element} A styled input field with label, password toggle, and error display.
 */

const Input = <T extends FieldValues>({
  id,
  name,
  type = "text",
  label,
  placeholder,
  register,
  errors = {},
  required,
  autoFocus,
}: InputProps<T>) => {
  console.log("rerender", name);

  const [showPassword, setShowPassword] = useState(false);
  const error = errors?.[name];
  const errorMessage = error?.message as string | undefined;

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div>
      {label?.content && (
        <label
          htmlFor={id}
          className={
            label?.className || "block text-sm font-medium text-gray-700 mb-1"
          }
        >
          {label.content} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          autoFocus={autoFocus}
          type={inputType}
          {...register(name)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-lg border ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-gray-300 focus:border-gray-500"
          } focus:outline-none focus:ring-2 ${
            error ? "focus:ring-red-200" : "focus:ring-gray-200"
          } transition-all`}
        />

        {type === "password" && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
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

export default Input;
