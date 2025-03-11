"use client";

import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We encountered an error while loading the data",
  onRetry,
  onBack,
}: ErrorStateProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <motion.div
        className="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 10,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            duration: 2,
            ease: "easeInOut",
          }}
        >
          <AlertCircle className="h-12 w-12 text-foreground" />
        </motion.div>

        <div className="space-y-3">
          <motion.h3
            className="text-xl font-medium text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        {onRetry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex gap-2 items-center"
          >
            {onBack && (
              <Button
                variant="default"
                onClick={onBack}
                className="font-normal cursor-pointer"
              >
                Back
              </Button>
            )}
            <Button
              variant="default"
              onClick={onRetry}
              className="font-normal cursor-pointer"
            >
              Try Again
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
