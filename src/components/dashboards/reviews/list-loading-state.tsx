"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function ListLoadingState({
  message = "Loading data...",
  className = "",
}: LoadingStateProps) {
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      className={`flex flex-col items-center justify-center p-8 space-y-4 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="relative" variants={itemVariants}>
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="text-primary"
        >
          <Loader2 className="h-10 w-10" />
        </motion.div>

        <motion.div
          className="absolute -inset-1 rounded-full opacity-30 blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{ backgroundColor: "hsl(var(--primary) / 0.2)" }}
        />
      </motion.div>

      <motion.p
        className="text-muted-foreground text-sm font-medium"
        variants={itemVariants}
      >
        {message}
      </motion.p>
    </motion.div>
  );
}
