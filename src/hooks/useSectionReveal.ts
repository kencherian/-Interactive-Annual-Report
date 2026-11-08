import { useEffect, useRef, type RefObject } from 'react';
import { useInView, useAnimation, type Variants } from 'motion/react';

export type AnimationControls = ReturnType<typeof useAnimation>;

export interface UseSectionRevealOptions {
  /**
   * Amount of the section that must be in view to trigger the animation.
   * Can be a number between 0 and 1, or 'some' / 'all'. Defaults to 0.15.
   */
  amount?: number | 'some' | 'all';
  /**
   * Root margin string to offset the trigger point (e.g. '-50px 0px').
   * Defaults to '-40px 0px -40px 0px'.
   */
  margin?: string;
  /**
   * Trigger the animation only once when entering the viewport. Defaults to true.
   */
  once?: boolean;
  /**
   * Subtle slide distance in pixels. Defaults to 24px.
   */
  distance?: number;
  /**
   * Direction of the slide animation ('up' | 'down' | 'left' | 'right' | 'none').
   * Defaults to 'up'.
   */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  /**
   * Animation transition duration in seconds. Defaults to 0.75s.
   */
  duration?: number;
  /**
   * Delay before animation initiates in seconds. Defaults to 0.
   */
  delay?: number;
  /**
   * Stagger interval between child elements in seconds. Defaults to 0.12s.
   */
  staggerChildren?: number;
  /**
   * Delay before children start staggering in seconds. Defaults to 0.05s.
   */
  delayChildren?: number;
  /**
   * Whether the container itself should slide as well as fade. Defaults to true.
   */
  slideContainer?: boolean;
}

export interface UseSectionRevealReturn<T extends HTMLElement = HTMLDivElement> {
  /**
   * Ref to attach to the target section or container element.
   */
  ref: RefObject<T | null>;
  /**
   * Boolean flag indicating if the target element is currently within the viewport.
   */
  isInView: boolean;
  /**
   * Framer Motion AnimationControls instance driving the animation state.
   */
  controls: AnimationControls;
  /**
   * Container variants supporting staggered child animations and smooth fade/slide.
   */
  containerVariants: Variants;
  /**
   * Alias for containerVariants for semantic clarity on full-section roots.
   */
  sectionVariants: Variants;
  /**
   * Item variants for child elements (fade-in and subtle slide-up).
   */
  itemVariants: Variants;
  /**
   * Convenient bundle of props to spread directly onto a motion component:
   * `<motion.div {...motionProps}>...</motion.div>`
   */
  motionProps: {
    ref: RefObject<T | null>;
    initial: 'hidden';
    animate: AnimationControls;
    variants: Variants;
  };
}

/**
 * Editorial cubic-bezier deceleration curve providing natural physics for subtle section reveals.
 */
export const SUBTLE_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Computes coordinate offsets based on direction and distance.
 */
function getDirectionOffset(direction: 'up' | 'down' | 'left' | 'right' | 'none', distance: number) {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance };
    case 'down':
      return { x: 0, y: -distance };
    case 'left':
      return { x: distance, y: 0 };
    case 'right':
      return { x: -distance, y: 0 };
    case 'none':
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * Custom hook to trigger subtle fade-in and slide-up entrance animations
 * for content sections as they enter the viewport using Framer Motion.
 */
export function useSectionReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseSectionRevealOptions = {}
): UseSectionRevealReturn<T> {
  const {
    amount = 0.15,
    margin = '-40px 0px -40px 0px',
    once = true,
    distance = 24,
    direction = 'up',
    duration = 0.75,
    delay = 0,
    staggerChildren = 0.12,
    delayChildren = 0.05,
    slideContainer = true,
  } = options;

  const ref = useRef<T | null>(null);
  const controls = useAnimation();

  // Track viewport intersection using Framer Motion's useInView hook
  const isInView = useInView(ref, {
    amount,
    margin: margin as any,
    once,
  });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const offset = getDirectionOffset(direction, distance);

  // Container variants with configurable stagger, delay, and smooth transition
  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      ...(slideContainer ? { x: offset.x, y: offset.y } : {}),
    },
    visible: {
      opacity: 1,
      ...(slideContainer ? { x: 0, y: 0 } : {}),
      transition: {
        duration,
        ease: SUBTLE_EASE,
        delay,
        staggerChildren,
        delayChildren,
      },
    },
  };

  // Item variants for child elements (fade-in and subtle directional slide)
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease: SUBTLE_EASE,
      },
    },
  };

  return {
    ref,
    isInView,
    controls,
    containerVariants,
    sectionVariants: containerVariants,
    itemVariants,
    motionProps: {
      ref,
      initial: 'hidden',
      animate: controls,
      variants: containerVariants,
    },
  };
}

// Re-export hook with alias for convenience
export const useScrollReveal = useSectionReveal;
