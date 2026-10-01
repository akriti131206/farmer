import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";
import { useUI } from "../../context/UIContext";

const icons = {
  success: <FiCheckCircle color="var(--color-primary)" size={18} />,
  warning: <FiAlertTriangle color="#f5b942" size={18} />,
  info: <FiInfo color="var(--color-sky)" size={18} />,
};

export default function ToastStack() {
  const { toasts } = useUI();
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className="toast-item"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {icons[t.variant] || icons.success}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
