import React from "react";
import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 14, className = "", ...props }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.45, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export const RevealStagger = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-60px" }}
    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    className={className}
  >
    {children}
  </motion.div>
);

export const RevealItem = ({ children, className = "" }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 14 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);
