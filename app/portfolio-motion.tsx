"use client";

import {
  type HTMLMotionProps,
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-40 h-px w-full origin-left bg-signal"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

export function HeroSignal() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.25], [0, 72]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.28]);

  return (
    <motion.div
      className="pointer-events-none absolute right-0 top-[18%] hidden h-[42rem] w-[42rem] translate-x-1/3 rounded-full border border-signal/20 bg-[radial-gradient(circle_at_40%_40%,rgba(145,214,203,0.18),rgba(145,214,203,0.035)_34%,transparent_68%)] lg:block"
      style={{ y, opacity }}
      aria-hidden="true"
    />
  );
}

type MagneticAnchorProps = HTMLMotionProps<"a"> & {
  children: ReactNode;
};

export function MagneticAnchor({
  children,
  className,
  onMouseMove,
  onMouseLeave,
  ...props
}: MagneticAnchorProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.25 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.25 });

  return (
    <motion.a
      {...props}
      className={className}
      style={{ x: smoothX, y: smoothY }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.16);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        x.set(0);
        y.set(0);
        onMouseLeave?.(event);
      }}
      whileTap={{ scale: 0.98, y: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {children}
    </motion.a>
  );
}
