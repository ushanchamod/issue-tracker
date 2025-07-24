import { motion } from "framer-motion";

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
