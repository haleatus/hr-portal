// Core React and Next.js imports
import React from "react";

// Animation Library imports
import { motion, Variants } from "framer-motion";

// Icon imports
import { LineChart, MessageSquare, Users } from "lucide-react";

/**
 * KeyFeaturesSection component - Shows the key feactures of the application
 */
const KeyFeaturesSection = ({
  staggerContainer,
  fadeIn,
}: {
  staggerContainer: Variants;
  fadeIn: Variants;
}) => {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container  md:px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          <motion.div variants={fadeIn}>
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Comprehensive Reviews</h3>
              <p className="text-muted-foreground">
                Support for peer reviews, manager evaluations, and
                self-assessments in one platform.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeIn}>
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Structured Feedback</h3>
              <p className="text-muted-foreground">
                Standardized templates with rating scales and comment sections
                for meaningful insights.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeIn}>
            <div className="flex flex-col items-center text-center space-y-2 p-4">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium">Actionable Analytics</h3>
              <p className="text-muted-foreground">
                Generate reports and identify trends to drive performance
                improvements.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
