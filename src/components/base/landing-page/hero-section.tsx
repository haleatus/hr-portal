// Core React and Next.js imports
import React from "react";
import Link from "next/link";

// Icon imports
import { ArrowRight } from "lucide-react";

// UI components imports
import { Button } from "@/components/ui/button";

// Animation Library imports
import { motion, Variants } from "framer-motion";

/**
 * HeroSection component - Main section of landing page for the HRHub application
 * Includes the key detail of the application in summary
 */
const HeroSection = ({
  isVisible,
  fadeIn,
}: {
  isVisible: boolean;
  fadeIn: Variants;
}) => {
  return (
    <section className="py-20 md:py-28">
      <div className="container">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-4"
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Streamline Your{" "}
            <span className="text-primary">Performance Reviews</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            A comprehensive HR portal for managing employee performance reviews,
            feedback, and growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href={"/signin"}>
              <Button size="lg" className="gap-2">
                Login
              </Button>
            </Link>

            <Link href={"/signup"}>
              <Button variant="outline" size="lg">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
