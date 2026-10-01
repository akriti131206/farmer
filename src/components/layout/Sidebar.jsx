import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { GiPlantRoots } from "react-icons/gi";
import { navSections } from "../../data/navigation";
import { useUI } from "../../context/UIContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useUI();

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="logo-mark">
            <GiPlantRoots />
          </div>
          {!collapsed && (
            <div className="brand-text">
              Agri<span>Sense</span> AI
            </div>
          )}
        </div>

        <nav className="sidebar-scroll">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && <div className="sidebar-section-label">{section.label}</div>}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="nav-icon">
                    <item.icon />
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <button className="sidebar-collapse-btn d-none d-lg-flex" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronsRight /> : <><FiChevronsLeft /> <span>Collapse</span></>}
        </button>
      </aside>
    </>
  );
}
