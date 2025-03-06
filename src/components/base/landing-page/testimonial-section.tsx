// Core React and Next.js imports
import React from "react";

// Animation Library imports
import { motion, Variants } from "framer-motion";

// UI component imports
import { Card, CardContent } from "@/components/ui/card";

/**
 * TestimonialsSection component - Shows the testimonials
 */
const TestimonialsSection = ({
  staggerContainer,
  fadeIn,
}: {
  staggerContainer: Variants;
  fadeIn: Variants;
}) => {
  return (
    <section id="testimonials" className="py-20">
      <div className="container  md:px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Trusted by HR Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience with our
            platform.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2"
        >
          {[
            {
              quote:
                "PerformanceHub has transformed our review process. What used to take weeks now takes days, and the quality of feedback has improved dramatically.",
              name: "Sarah Johnson",
              title: "HR Director, TechCorp",
            },
            {
              quote:
                "The role-based dashboards make it easy for everyone to stay on top of their responsibilities. Our completion rates have never been higher.",
              name: "Michael Chen",
              title: "People Operations Manager, Innovate Inc.",
            },
          ].map((testimonial, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p className="text-lg italic">{`"${testimonial.quote}"`}</p>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
