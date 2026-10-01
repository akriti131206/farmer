import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hoverable = true,
  strong = false,
  as: Component = motion.div,
  delay = 0,
  ...rest
}) {
  return (
    <Component
      className={`${strong ? "glass-card-strong" : "glass-card"} ${hoverable ? "hoverable" : ""} ${className}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Component>
  );
}
