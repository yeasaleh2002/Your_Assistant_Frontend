import { Variants } from "framer-motion";
import gsap from "gsap";

/**
 * ============================================================================
 * FRAMER MOTION VARIANTS
 * Clean, minimalist, flat-vector micro-interactions & smooth transitions
 * ============================================================================
 */

// Accordion Expand/Collapse for Job Card skill details
export const accordionVariants: Variants = {
  collapsed: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.28, ease: [0.32, 0, 0.67, 0] },
      opacity: { duration: 0.2, ease: "easeOut" },
    },
  },
  expanded: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      opacity: { duration: 0.25, delay: 0.05, ease: "easeIn" },
    },
  },
};

// Card Lift & Hover State (Minimalist Flat Vector)
export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
  },
  hover: {
    y: -3,
    boxShadow: "0 12px 28px -6px rgba(99, 102, 241, 0.12), 0 6px 12px -4px rgba(0, 0, 0, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

// Primary Action Button Tap & Hover State
export const buttonInteractionVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.025,
    transition: {
      type: "spring",
      stiffness: 450,
      damping: 18,
    },
  },
  tap: {
    scale: 0.96,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15,
    },
  },
};

// Step Transitions in Resume Builder
export const stepSlideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 32 : -32,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 32 : -32,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.25,
      ease: "easeInOut",
    },
  }),
};

// Staggered list container
export const staggerListVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// Staggered list item
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/**
 * ============================================================================
 * GSAP ANIMATION TIMELINE CONFIGURATIONS
 * Dedicated multi-phase vector RAG loading state
 * ============================================================================
 */

export interface RagTimelineElements {
  container: HTMLElement;
  scannerBeam: HTMLElement;
  pulseRings: HTMLElement[];
  stepItems: HTMLElement[];
  progressNumber: HTMLElement;
  documentSvg?: HTMLElement;
}

export function createRagLoadingTimeline(elements: RagTimelineElements): gsap.core.Timeline {
  const { container, scannerBeam, pulseRings, stepItems, progressNumber } = elements;

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5,
  });

  // 1. Initial State Setup
  gsap.set(container, { opacity: 1 });
  gsap.set(scannerBeam, { yPercent: -100, opacity: 0 });
  gsap.set(pulseRings, { scale: 0.85, opacity: 0 });
  gsap.set(stepItems, { opacity: 0.35, x: 0 });

  // 2. Pulse Waves Sequence
  tl.to(
    pulseRings,
    {
      scale: 1.35,
      opacity: 0.45,
      duration: 1.2,
      stagger: 0.25,
      ease: "power2.out",
    },
    0
  ).to(
    pulseRings,
    {
      opacity: 0,
      scale: 1.6,
      duration: 0.8,
      stagger: 0.25,
      ease: "power2.in",
    },
    0.6
  );

  // 3. Document Scanning Laser Sweep
  tl.to(
    scannerBeam,
    {
      opacity: 0.9,
      duration: 0.2,
      ease: "power1.in",
    },
    0.2
  )
    .to(
      scannerBeam,
      {
        yPercent: 280,
        duration: 2.2,
        ease: "power1.inOut",
      },
      0.3
    )
    .to(
      scannerBeam,
      {
        opacity: 0,
        duration: 0.3,
      },
      2.4
    );

  // 4. Step Items Sequential Highlight & Checkmark Transition
  stepItems.forEach((item, index) => {
    const startTime = 0.3 + index * 0.7;
    tl.to(
      item,
      {
        opacity: 1,
        x: 4,
        duration: 0.35,
        ease: "back.out(1.7)",
      },
      startTime
    );
  });

  // 5. Counter Number Simulation (0% -> 100%)
  const progressProxy = { val: 0 };
  tl.to(
    progressProxy,
    {
      val: 100,
      duration: 3.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (progressNumber) {
          progressNumber.innerText = `${Math.round(progressProxy.val)}%`;
        }
      },
    },
    0.2
  );

  return tl;
}
