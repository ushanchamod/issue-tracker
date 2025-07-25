import { SquareX } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Loading from "./Loading";

type Props = {
  children: ReactNode;
  title: string;
  setAddNewPopup: (x: boolean) => void;
  loading: boolean;
};

/**
 * PopUp component renders a modal dialog with a title, close button, and content.
 * Includes an optional loading overlay with spinner.
 * Uses Framer Motion for fade and slide-in animation.
 *
 * @param {ReactNode} children - The content to display inside the popup.
 * @param {string} title - The title text displayed at the top of the popup.
 * @param {(x: boolean) => void} setAddNewPopup - Function to control the popup visibility (called with false to close).
 * @param {boolean} loading - If true, shows a fullscreen loading overlay inside the popup.
 *
 * @returns {JSX.Element} A modal popup component with backdrop, title, close icon, loading state, and scrollable content.
 */

const PopUp = ({
  children,
  title = "title",
  setAddNewPopup,
  loading,
}: Props) => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="bg-white backdrop-blur-md p-8 rounded-lg shadow-lg max-w-md text-gray-800 max-h-[95%] overflow-auto relative">
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 z-2">
            <Loading />
          </div>
        )}
        <div className="flex justify-between items-center pb-5.5 gap-5.5">
          <p className="font-bold text-2xl">{title}</p>
          <SquareX
            size={25}
            strokeWidth={2}
            color="red"
            className="cursor-pointer"
            onClick={() => setAddNewPopup(false)}
          />
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
};

export default PopUp;
