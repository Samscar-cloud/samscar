"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const indicators = [
  { value: 15, suffix: "+", label: "Années d'expérience" },
  { value: 5000, suffix: "+", label: "Véhicules réparés" },
  { value: 98, suffix: "%", label: "Satisfaction client" },
  { value: 6, suffix: "j", label: "Lun–Sam 08h–18h" },
];

function AnimatedNumber({
  value,
  suffix,
  active,
}: {
  readonly value: number;
  readonly suffix: string;
  readonly active: boolean;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 20,
    mass: 1,
  });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest).toString());
    });

    return () => unsubscribe();
  }, [springValue]);

  useEffect(() => {
    if (active) {
      motionValue.set(value);
    }
  }, [active, motionValue, value]);

  return (
    <motion.span className="text-5xl font-black text-secondary-500 tabular-nums">
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export function TrustIndicators() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section ref={ref} className="py-16 bg-carbon-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y divide-white/10 md:divide-y-0 md:divide-x md:divide-white/10">
          {indicators.map((indicator, index) => (
            <div
              key={indicator.label}
              className={`relative flex flex-col items-center px-8 py-6 border-r border-white/10 last:border-r-0 ${index > 0 ? "md:border-l-0" : ""}`}
            >
              <AnimatedNumber
                value={indicator.value}
                suffix={indicator.suffix}
                active={inView}
              />
              <span className="text-sm text-gray-400 uppercase tracking-widest mt-2 text-center">
                {indicator.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
