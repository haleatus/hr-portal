"use client";

// Core React and Next.js imports
import { useEffect, useState } from "react";

// Icon imports
import { ArrowRight } from "lucide-react";

// Animation Library imports
import { motion } from "framer-motion";

// UI components imports
import { Button } from "@/components/ui/button";

// Custom component imports
import Footer from "./footer";
import Header from "./header";
import HeroSection from "./hero-section";
import KeyFeaturesSection from "./key-features-section";
import DetailedFeaturesSection from "./detailed-features-section";
import UserRolesSection from "./user-roles-section";
import TestimonialsSection from "./testimonial-section";

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

        {/* Detailed Features Section */}
        <DetailedFeaturesSection
          staggerContainer={staggerContainer}
          fadeIn={fadeIn}
        />

        {/* User Roles Section */}
        <UserRolesSection staggerContainer={staggerContainer} fadeIn={fadeIn} />

        {/* Testimonials Section */}
        <TestimonialsSection
          staggerContainer={staggerContainer}
          fadeIn={fadeIn}
        />

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
