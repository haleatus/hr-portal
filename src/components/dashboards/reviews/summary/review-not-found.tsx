"use client";

import type React from "react";
import { motion } from "framer-motion";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ReviewNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card border border-border rounded-lg shadow-sm w-full max-w-md overflow-hidden"
      >
        <motion.div
          className="bg-muted/50 p-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.5,
              type: "spring",
              stiffness: 100,
            }}
          >
            <FileQuestion
              className="h-20 w-20 text-muted-foreground"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>

        <div className="p-6">
          <motion.h2
            className="text-xl font-semibold text-foreground mb-3 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            Review Not Found
          </motion.h2>

          <motion.p
            className="text-muted-foreground mb-6 text-center"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            {`The review you're looking for doesn't exist or you don't have
            permission to view it.`}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <Link href="/reviews">
              <Button variant="outline" className="w-full group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Reviews
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewNotFound;
