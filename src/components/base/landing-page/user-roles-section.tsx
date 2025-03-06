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

// Icon imports
import { CheckCircle } from "lucide-react";

/**
 * UserRolesSection component - Shows the roles available in the application
 */
const UserRolesSection = ({
  staggerContainer,
  fadeIn,
}: {
  staggerContainer: Variants;
  fadeIn: Variants;
}) => {
  return (
    <section id="roles" className="py-20 bg-muted/50">
      <div className="container  md:px-5 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Tailored for Every Role
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides role-specific features to meet the needs of
            everyone in your organization.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-3"
        >
          {[
            {
              role: "Admin",
              description:
                "Complete control over the review process, user management, and organization-wide reporting.",
              features: [
                "Configure review cycles and templates",
                "Manage user roles and permissions",
                "Access comprehensive analytics",
              ],
            },
            {
              role: "Manager",
              description:
                "Tools to effectively evaluate team members and track their development.",
              features: [
                "Conduct performance reviews",
                "Track team progress",
                "Provide structured feedback",
              ],
            },
            {
              role: "Employee",
              description:
                "Simple interface for completing self-assessments and peer reviews.",
              features: [
                "Submit self-reviews",
                "Provide peer feedback",
                "Track personal growth",
              ],
            },
          ].map((role, index) => (
            <motion.div key={index} variants={fadeIn}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{role.role}</CardTitle>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UserRolesSection;
