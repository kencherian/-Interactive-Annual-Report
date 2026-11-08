import { Variants } from 'motion/react';

/**
 * Editorial cubic-bezier curve providing a natural, physics-inspired deceleration
 * for smooth scroll reveals and UI state changes.
 */
export const fluidEase = [0.22, 1, 0.36, 1] as const;

/**
 * Parent container variant that coordinates staggered reveals of its child motion elements
 * via the browser's IntersectionObserver (whileInView).
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
};

/**
 * Faster stagger container for lists, pill badges, and compact metrics.
 */
export const fastStaggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

/**
 * Child item variant: subtle vertical glide with fluid opacity fade.
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: fluidEase,
    },
  },
};

/**
 * Child item variant: card or visual showcase with gentle scale-up and lift.
 */
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.96,
    y: 24,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: fluidEase,
    },
  },
};

/**
 * Directional horizontal glide from left.
 */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: fluidEase,
    },
  },
};

/**
 * Directional horizontal glide from right.
 */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: fluidEase,
    },
  },
};

/**
 * Standard IntersectionObserver viewport configuration for seamless scroll reveals.
 */
export const defaultViewport = {
  once: true,
  amount: 0.15,
  margin: '-40px 0px -40px 0px',
} as const;

/**
 * Viewport configuration for larger hero and showcase cards.
 */
export const cardViewport = {
  once: true,
  amount: 0.1,
  margin: '-60px 0px -60px 0px',
} as const;
