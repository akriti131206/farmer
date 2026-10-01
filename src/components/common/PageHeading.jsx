import { motion } from "framer-motion";

export default function PageHeading({ eyebrow, title, subtitle, action }) {
  return (
    <motion.div
      className="page-heading"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
