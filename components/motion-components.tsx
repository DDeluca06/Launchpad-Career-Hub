"use client";

import { motion } from "framer-motion";

// Export motion components with proper types
export const MotionDiv = motion.div as typeof motion.div;
export const MotionSpan = motion.span as typeof motion.span;
export const MotionButton = motion.button as typeof motion.button;
export const MotionUl = motion.ul as typeof motion.ul;
export const MotionLi = motion.li as typeof motion.li;

// Re-export AnimatePresence for convenience
export { AnimatePresence } from "framer-motion";
