// Core React and Next.js imports
import React from "react";

// Icon imports
import { Shield } from "lucide-react";

/**
 * Footer component - Footer of the landing page
 * Includes the extra details which might be crutial
 */
const Footer = () => {
  return (
    <footer className="border-t py-4 bg-muted/30">
      <div className="container  md:px-5 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="h-6 w-6 text-primary" />
            <span>HRHub</span>
          </div>
          <div className="text-center md:text-right text-sm text-muted-foreground">
            <p>© 2025 PerformanceHub. All rights reserved.</p>
            <p>Privacy Policy • Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
