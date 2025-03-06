"use client";

// Core React and Next.js imports
import { useEffect, useState } from "react";

// Icon imports
import { ArrowRight, CheckCircle } from "lucide-react";

// Animation Library imports
import { motion } from "framer-motion";

// UI components imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Custom component imports
import Footer from "./footer";
import Header from "./header";
import HeroSection from "./hero-section";
import KeyFeaturesSection from "./key-features-section";

/**
 * LandingPage component - Main landing page for the HRHub application
 * Includes hero section, features, role-specific info, testimonials, and CTA
 */
export default function LandingPage() {
  // State for controlling initial animation visibility
  const [isVisible, setIsVisible] = useState(false);

  // Trigger initial animation on component mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animation variants for fade-in effects
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Animation variants for staggered content
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="flex flex-col">
      {/* Main header with navigation */}
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection isVisible={isVisible} fadeIn={fadeIn} />

        {/* Key Features Section */}
        <KeyFeaturesSection
          staggerContainer={staggerContainer}
          fadeIn={fadeIn}
        />

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
                Our platform provides all the tools you need to manage the
                entire performance review process.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3  md:px-5 lg:px-8"
            >
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
                Our platform provides role-specific features to meet the needs
                of everyone in your organization.
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
                See what our customers have to say about their experience with
                our platform.
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
                        <p className="text-lg italic">
                          {`"${testimonial.quote}"`}
                        </p>
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
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Book a Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
