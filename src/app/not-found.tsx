"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            type: "spring",
            stiffness: 200,
          }}
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="text-9xl font-bold text-primary mb-2"
            >
              404
            </motion.div>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="h-1 bg-primary/50 rounded-full"
            />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-2xl font-semibold"
        >
          Page not found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground"
        >
          {`The page you're looking for doesn't exist or has been moved.`}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button asChild>
            <Link href="/">
              <MoveLeft /> Return Home
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
