import type { LucideProps } from "lucide-react";

type buttonProps = {
  activeText?: string;
  disableText?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  Icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>;
};

/**
 * Button component with optional icon, loading state, and disabled state.
 *
 * @param {string} [activeText] - Text to display when the button is active (not loading).
 * @param {string} [disableText] - Text to display when the button is in loading state.
 * @param {() => void} [onClick] - Click event handler function.
 * @param {"button" | "submit"} [type="button"] - Button type attribute.
 * @param {boolean} [isLoading=false] - If true, shows disableText instead of activeText.
 * @param {boolean} [disabled=false] - If true, disables the button.
 * @param {string} [className] - Optional custom CSS classes for styling the button.
 * @param {React.ForwardRefExoticComponent<Omit<LucideProps, "ref">>} [Icon] - Optional icon component from lucide-react.
 *
 * @returns {JSX.Element} A styled button with optional icon and loading text handling.
 */

const Button = ({
  activeText,
  disableText,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  className,
  Icon,
}: buttonProps) => {
  return (
    <button
      type={type}
      className={
        className ||
        `w-full py-3 px-4 rounded-md justify-center font-medium text-white bg-gray-900 hover:bg-gray-800 cursor-pointer`
      }
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {Icon && <Icon size={20} />}
      {(activeText || disableText) && (
        <span>{!isLoading ? activeText : disableText}</span>
      )}
    </button>
  );
};

export default Button;
