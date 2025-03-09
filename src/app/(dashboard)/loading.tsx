"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative flex">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 mx-1 rounded-full bg-primary"
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 relative"
          >
            <motion.div
              animate={{
                width: ["0%", "100%", "0%"],
                left: ["0%", "0%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              className="h-1 bg-primary/50 absolute top-0 rounded-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
