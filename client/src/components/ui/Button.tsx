type buttonProps = {
  activeText: string;
  disableText?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button = ({
  activeText,
  disableText,
  onClick,
  type = "button",
  isLoading = false,
  disabled = false,
  className,
}: buttonProps) => {
  return (
    <button
      type={type}
      className={
        className ||
        `w-full py-3 px-4 rounded-md font-medium text-white bg-gray-900 hover:bg-gray-800 cursor-pointer`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {!isLoading ? activeText : disableText}
    </button>
  );
};

export default Button;
