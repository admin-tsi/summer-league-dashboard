import React from "react";
import { Calendar } from "lucide-react";
import { motion } from "framer-motion";

const NoSchedules = () => {
  return (
    <motion.div
      className="h-[600px] w-full flex flex-col justify-center items-center rounded-lg shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Calendar className="w-16 h-16 text-primary mb-4" />
      </motion.div>
      <motion.h2
        className="text-2xl font-semibold text-gray-700 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        No Schedules Available
      </motion.h2>
      <motion.p
        className="text-gray-500 mb-6 text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        There are currently no schedules available for you. Check back later or
        contact the administrator for more information.
      </motion.p>
    </motion.div>
  );
};

export default NoSchedules;
