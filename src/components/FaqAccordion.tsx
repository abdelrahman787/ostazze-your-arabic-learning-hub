import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
  defaultOpen?: number;
}

const FaqAccordion = ({ items, defaultOpen = -1 }: Props) => {
  const [open, setOpen] = useState<number>(defaultOpen);

  return (
    <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="card-base overflow-hidden"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between gap-4 p-5 text-start hover:bg-foreground/[0.02] transition-colors"
            >
              <span className="font-bold text-[15px] leading-relaxed" itemProp="name">
                {it.q}
              </span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-muted-foreground transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div
                    className="px-5 pb-5 text-[14px] leading-relaxed text-muted-foreground whitespace-pre-line"
                    itemProp="text"
                  >
                    {it.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default FaqAccordion;
