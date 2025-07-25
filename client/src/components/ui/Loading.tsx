import { motion } from "framer-motion";

/**
 * Loading component displays a centered spinning loader overlay.
 *
 * Uses Framer Motion for smooth infinite rotation animation.
 * Covers the entire viewport with a semi-transparent blurred background.
 *
 * @returns {JSX.Element} A fullscreen loading spinner with backdrop blur.
 */

const Loading = () => {
  return (
    <div className="absolute top-0 inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/40">
      <motion.div
        className="h-12 w-12 border-4 border-b-gray-700 border-t-transparent rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
};

export default Loading;
