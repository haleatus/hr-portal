// Core React and Next.js imports
import React from "react";

// Animation Library imports
import { motion, Variants } from "framer-motion";

// UI component imports
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * DetailedFeaturesSection component - Shows the key feactures of the application in detail
 */
const DetailedFeaturesSection = ({
  staggerContainer,
  fadeIn,
}: {
  staggerContainer: Variants;
  fadeIn: Variants;
}) => {
  return (
    <section id="features" className="py-20">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Powerful Features for Every Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools you need to manage the entire
            performance review process.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3  md:px-5 lg:px-8"
        >
          {/* Feature Cards with detailed descriptions */}
          {[
            {
              title: "Customizable Review Templates",
              description:
                "Create structured templates with rating scales and open-ended questions.",
            },
            {
              title: "Real-time Progress Tracking",
              description:
                "Monitor review status and completion rates across your organization.",
            },
            {
              title: "Automated Notifications",
              description:
                "Send timely reminders about pending reviews and upcoming deadlines.",
            },
            {
              title: "Comprehensive Dashboards",
              description:
                "Role-specific dashboards provide relevant information at a glance.",
            },
            {
              title: "Historical Performance Data",
              description:
                "Access past reviews to track employee growth and development over time.",
            },
            {
              title: "Exportable Reports",
              description:
                "Generate and download performance reports in PDF or Excel formats.",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;
