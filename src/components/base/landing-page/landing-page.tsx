"use client";

// Core React and Next.js imports
import { useEffect, useState } from "react";

// Custom component imports
import Footer from "./footer";
import Header from "./header";
import HeroSection from "./hero-section";
import KeyFeaturesSection from "./key-features-section";
import DetailedFeaturesSection from "./detailed-features-section";
import UserRolesSection from "./user-roles-section";
import TestimonialsSection from "./testimonial-section";
import FinalCallToActionSection from "./final-call-to-action-section";

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

        {/* Final CTA Section */}
        <FinalCallToActionSection fadeIn={fadeIn} />
      </main>
      <Footer />
    </div>
  );
}
