import React from "react";

type Option<T> = {
  value: T;
  label: string;
  color?: string;
};

type Props<T> = {
  name: string;
  id: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: T;
  options: Option<T>[];
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
};

const Select = <T extends string | number>({
  name,
  id,
  onChange,
  value,
  options = [],
  className = "",
  disabled = false,
  label,
  placeholder = "Select an option",
}: Props<T>) => {
  const selectedOption = options.find((o) => String(o.value) === String(value));
  const backgroundColor = selectedOption?.color || undefined;

  return (
    <div>
      {label && (
        <label htmlFor={id} className="font-semibold mb-0.5 text-gray-800">
          {label}
        </label>
      )}
      <div className={`relative ${className} min-w-[100px]`}>
        <select
          name={name}
          id={id}
          value={String(value)}
          onChange={onChange}
          disabled={disabled}
          className={`
          block w-full px-4 py-2 pr-8
          text-gray-900 bg-white  rounded-sm
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500
          transition duration-150 ease-in-out
          appearance-none
          ${disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}
        `}
          style={{
            backgroundColor: backgroundColor,
          }}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={String(option.value)}
              className="py-1"
              style={{ background: option.color }}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
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
      </div>
    </div>
  );
};

export default Select;
