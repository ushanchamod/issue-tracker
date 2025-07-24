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
