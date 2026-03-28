import { useEffect, useRef, useState } from "react";

interface CountUpNumberProps {
  target: string;
  duration?: number;
}

const parseTarget = (val: string): { prefix: string; number: number; suffix: string; decimals: number } => {
  const match = val.match(/^([+]?)([0-9,.]+)(.*)$/);
  if (!match) return { prefix: "", number: 0, suffix: val, decimals: 0 };
  const prefix = match[1];
  const numStr = match[2].replace(/,/g, "");
  const number = parseFloat(numStr);
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  const suffix = match[3];
  return { prefix, number, suffix, decimals };
};

const formatNumber = (n: number, decimals: number, addCommas: boolean): string => {
  const fixed = n.toFixed(decimals);
  if (!addCommas) return fixed;
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const CountUpNumber = ({ target, duration = 2000 }: CountUpNumberProps) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const { prefix, number, suffix, decimals } = parseTarget(target);
  const hasCommas = target.includes(",");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * number;
            setDisplay(formatNumber(current, decimals, hasCommas));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [number, decimals, duration, hasCommas]);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
};

export default CountUpNumber;
