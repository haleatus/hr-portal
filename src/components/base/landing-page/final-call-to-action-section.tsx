// Core React and Next.js imports
import React from "react";

// Animation Library imports
import { motion, Variants } from "framer-motion";

// Icon imports
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * FinalCallToActionSection component - Includes CTA Buttons
 */
const FinalCallToActionSection = ({ fadeIn }: { fadeIn: Variants }) => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container  md:px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your Performance Reviews?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of companies that have streamlined their review
            process with PerformanceHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={"/signup"}>
              <Button size="lg" variant="secondary" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href={"/signin"}>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCallToActionSection;
