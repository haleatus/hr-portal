"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { Star, TrendingUp, Brain, Users, Clock, Target } from "lucide-react";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";

interface OverallRatingCardProps {
  rating: number;
}

// Performance categories with sample data
// In a real app, these would come from the API
const performanceCategories = [
  { name: "Productivity", icon: TrendingUp, value: 0, color: "bg-blue-500" },
  { name: "Knowledge & Skills", icon: Brain, value: 0, color: "bg-indigo-500" },
  { name: "Teamwork", icon: Users, value: 0, color: "bg-purple-500" },
  { name: "Timeliness", icon: Clock, value: 0, color: "bg-pink-500" },
  { name: "Goal Achievement", icon: Target, value: 0, color: "bg-amber-500" },
];

const OverallRatingCard: React.FC<OverallRatingCardProps> = ({ rating }) => {
  const numRating = Number(rating);
  const [categories, setCategories] = useState(performanceCategories);
  const [animatedRating, setAnimatedRating] = useState(0);

  // Animation controls
  const controls = useAnimation();
  const circleControls = useAnimation();
  const categoryControls = useAnimation();
  const summaryControls = useAnimation();

  // Refs for intersection observer
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Generate realistic-looking category ratings based on overall rating
  useEffect(() => {
    // Only run once when component mounts
    const variance = 0.7; // How much categories can vary from overall rating
    const newCategories = categories.map((category) => {
      // Generate a value that's within variance of the overall rating
      // but still between 1 and 5
      let value = numRating + (Math.random() * variance * 2 - variance);
      value = Math.max(1, Math.min(5, value));
      return { ...category, value };
    });
    setCategories(newCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numRating]);

  // Start animations when component is in view
  useEffect(() => {
    if (isInView) {
      // Start main animations
      controls.start("visible");
      circleControls.start("visible");
      categoryControls.start("visible");
      summaryControls.start("visible");

      // Animate the rating number counting up
      const duration = 1500; // ms
      const interval = 15; // ms
      const steps = duration / interval;
      const increment = numRating / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= numRating) {
          current = numRating;
          clearInterval(timer);
        }
        setAnimatedRating(current);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [
    isInView,
    numRating,
    controls,
    circleControls,
    categoryControls,
    summaryControls,
  ]);

  // Function to get feedback message based on rating
  const getFeedbackMessage = (rating: number) => {
    if (rating >= 4.5) return "Outstanding Performance";
    if (rating >= 4) return "Excellent Work";
    if (rating >= 3) return "Good Performance";
    if (rating >= 2) return "Developing Skills";
    return "Needs Improvement";
  };

  // Function to get color scheme based on rating
  const getColorScheme = (rating: number) => {
    if (rating >= 4.5)
      return {
        text: "text-emerald-600",
        gradient: "emerald-gradient",
        colors: ["#059669", "#10b981", "#34d399"],
      };
    if (rating >= 4)
      return {
        text: "text-blue-600",
        gradient: "blue-gradient",
        colors: ["#1d4ed8", "#3b82f6", "#60a5fa"],
      };
    if (rating >= 3)
      return {
        text: "text-indigo-600",
        gradient: "indigo-gradient",
        colors: ["#4f46e5", "#6366f1", "#818cf8"],
      };
    if (rating >= 2)
      return {
        text: "text-amber-600",
        gradient: "amber-gradient",
        colors: ["#d97706", "#f59e0b", "#fbbf24"],
      };
    return {
      text: "text-red-600",
      gradient: "red-gradient",
      colors: ["#dc2626", "#ef4444", "#f87171"],
    };
  };

  const message = getFeedbackMessage(numRating);
  const colorScheme = getColorScheme(numRating);

  // Calculate the percentage for the circular progress
  const percentage = (numRating / 5) * 100;
  const circumference = 2 * Math.PI * 54; // 54 is the radius of the circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const circleVariants = {
    hidden: {
      strokeDashoffset: circumference,
      pathLength: 0,
    },
    visible: {
      strokeDashoffset: strokeDashoffset,
      pathLength: percentage / 100,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.5,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto"
    >
      <motion.h3
        className="text-xl font-semibold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={controls}
        variants={itemVariants}
      >
        Overall Performance Assessment
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        {/* Circular Rating Indicator */}
        <motion.div
          className="flex flex-col items-center justify-center col-span-1"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.div
            className="relative size-48 flex items-center justify-center"
            variants={itemVariants}
          >
            {/* SVG for circular progress */}
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Define gradient */}
              <defs>
                <linearGradient
                  id={colorScheme.gradient}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={colorScheme.colors[0]} />
                  <stop offset="50%" stopColor={colorScheme.colors[1]} />
                  <stop offset="100%" stopColor={colorScheme.colors[2]} />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="6"
              />

              {/* Animated progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={`url(#${colorScheme.gradient})`}
                strokeWidth="8"
                strokeDasharray={circumference}
                initial="hidden"
                animate={circleControls}
                variants={circleVariants}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />

              {/* Subtle glow effect */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={`url(#${colorScheme.gradient})`}
                strokeWidth="2"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference, opacity: 0 }}
                animate={
                  isInView
                    ? {
                        strokeDashoffset,
                        opacity: [0, 0.3, 0.1, 0.3],
                        scale: [1, 1.02, 1, 1.02],
                      }
                    : {}
                }
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                filter="blur(4px)"
              />
            </svg>

            {/* Rating text in the center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence>
                {isInView && (
                  <motion.span
                    className={`text-4xl font-bold ${colorScheme.text}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    {animatedRating.toFixed(1)}
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.div
                className="flex items-center mt-1"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <motion.div
                  animate={
                    isInView
                      ? {
                          rotate: [0, 10, 0, -10, 0],
                          scale: [1, 1.2, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 0.6,
                    delay: 1.2,
                    type: "tween", // Changed from "spring" to "tween"
                  }}
                >
                  <Star
                    className={`h-5 w-5 ${colorScheme.text} fill-current`}
                  />
                </motion.div>
                <span className="text-gray-500 text-sm ml-1">/ 5.0</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.h4
            className={`text-xl font-medium mt-4 mb-2 ${colorScheme.text}`}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            {message}
          </motion.h4>
        </motion.div>

        {/* Category Progress Bars */}
        <motion.div
          className="col-span-1 md:col-span-2 w-full space-y-4"
          initial="hidden"
          animate={categoryControls}
          variants={containerVariants}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="w-full"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                    type: "spring",
                    stiffness: 100,
                  },
                },
              }}
            >
              <div className="flex justify-between items-center mb-1">
                <motion.div
                  className="flex items-center"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.div
                    animate={
                      isInView
                        ? {
                            rotate: [0, 360],
                          }
                        : {}
                    }
                    transition={{
                      delay: 0.5 + index * 0.1,
                      duration: 0.6,
                      type: "tween", // Changed from "spring" to "tween"
                    }}
                  >
                    <category.icon className="h-4 w-4 mr-2 text-gray-600" />
                  </motion.div>
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </motion.div>
                <motion.span
                  className="text-sm font-medium text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                >
                  {category.value.toFixed(1)}
                </motion.span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className={`h-2.5 rounded-full ${category.color}`}
                  initial={{ width: 0 }}
                  animate={
                    isInView ? { width: `${(category.value / 5) * 100}%` } : {}
                  }
                  transition={{
                    duration: 0.8,
                    delay: 0.7 + index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Performance Summary */}
      <motion.div
        className="mt-8 p-5 bg-white rounded-lg border border-gray-200 shadow-sm w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={summaryControls}
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.7,
              delay: 1.4,
              type: "spring",
              stiffness: 50,
              damping: 15,
            },
          },
        }}
      >
        <motion.h5
          className="font-medium text-gray-800 mb-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          Performance Summary
        </motion.h5>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          {numRating >= 4
            ? "Consistently exceeds expectations and delivers exceptional results. Demonstrates strong leadership qualities and contributes innovative ideas. A valuable asset to the team with excellent technical and interpersonal skills."
            : numRating >= 3
            ? "Meets expectations and contributes positively to team goals. Demonstrates good understanding of responsibilities and delivers quality work. Shows potential for further growth with continued development in key areas."
            : numRating >= 2
            ? "Shows progress in key areas but has opportunities for improvement. Additional support and development recommended to enhance performance. With focused effort, can achieve consistent results across all responsibilities."
            : "Requires significant improvement in multiple areas. A focused development plan is recommended with regular check-ins and mentoring. Clear goals and expectations should be established to track progress."}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OverallRatingCard;
