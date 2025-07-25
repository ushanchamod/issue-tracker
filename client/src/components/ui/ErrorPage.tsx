import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "./Button";

type ErrorPageProps = {
  message?: string;
  retry?: () => void;
};

/**
 * ErrorPage component displays a full-screen error message with an optional retry button.
 *
 * @param {string} [message="Something went wrong."] - The error message to display.
 * @param {() => void} [retry] - Optional callback function to retry the failed action.
 *
 * @returns {JSX.Element} A centered error UI with icon, message, and retry button if provided.
 */
const ErrorPage: React.FC<ErrorPageProps> = ({
  message = "Something went wrong.",
  retry,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-800 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-600" />
        <h1 className="text-2xl font-semibold">Oops!</h1>
        <p className="text-base">{message}</p>
        {retry && (
          <Button
            activeText="Retry"
            onClick={retry}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          />
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
