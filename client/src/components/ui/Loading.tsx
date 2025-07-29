import { motion } from "framer-motion";

type LoadingProps = {
  size?: number; // Optional spinner size in pixels
};

/**
 * Loading component displays a centered spinning loader overlay.
 *
 * Uses Framer Motion for smooth infinite rotation animation.
 * Covers the entire viewport with a semi-transparent blurred background.
 *
 * @param {number} [size] - Optional size (in pixels) for the spinner circle.
 *
 * @returns {JSX.Element} A fullscreen loading spinner with backdrop blur.
 */
const Loading = ({ size = 48 }: LoadingProps) => {
  return (
    <div className="absolute top-0 inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/10">
      <motion.div
        className="border-4 border-b-gray-700 border-t-transparent rounded-full animate-spin"
        style={{ width: size, height: size }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default Loading;
