import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiSearch, FiBell, FiMessageSquare, FiMoon, FiSun, FiGlobe, FiMenu, FiUser, FiSettings, FiLogOut,
} from "react-icons/fi";
import { WiDaySunnyOvercast } from "react-icons/wi";
import { useTheme } from "../../context/ThemeContext";
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";
import { currentWeather } from "../../data/weather";
import { notificationsList } from "../../data/analytics";
import "./Navbar.css";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen, pushToast } = useUI();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [lang, setLang] = useState("EN");
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unreadCount = notificationsList.filter((n) => n.unread).length;
  return (
    <div className="topnav">
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <FiMenu />
      </button>

      <div className="search-wrap">
        <FiSearch size={16} />
        <input placeholder="Search crops, tools, reports…" />
      </div>

      <div className="topnav-spacer" />

      <div className="weather-pill">
        <WiDaySunnyOvercast size={20} />
        Demo · {currentWeather.tempC}°C · {currentWeather.location}
      </div>

      <button
        className="topnav-icon-btn"
        onClick={() => setLang((l) => (l === "EN" ? "HI" : "EN"))}
        title="Switch language"
      >
        <FiGlobe size={17} />
      </button>

      <button className="topnav-icon-btn" onClick={toggleTheme} title="Toggle dark mode">
        {theme === "dark" ? <FiSun size={17} /> : <FiMoon size={17} />}
      </button>

      <button
        className="topnav-icon-btn"
        onClick={() => pushToast("You're all caught up on messages", "info")}
        title="Messages"
      >
        <FiMessageSquare size={17} />
      </button>

      <div style={{ position: "relative" }} ref={notifRef}>
        <button className="topnav-icon-btn" onClick={() => setNotifOpen((o) => !o)} title="Notifications">
          <FiBell size={17} />
          {unreadCount > 0 && <span className="dot" />}
        </button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              className="notif-panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <div className="notif-panel-header">Notifications ({unreadCount} new)</div>
              {notificationsList.slice(0, 5).map((n) => (
                <div className="notif-row" key={n.id}>
                  <div className="notif-title">{n.title}</div>
                  <div>{n.body}</div>
                  <div className="notif-time">{n.time}</div>
                </div>
              ))}
              <div style={{ padding: 10 }}>
                <Link
                  to="/notifications"
                  className="btn-agri btn-agri-ghost btn-agri-sm w-100 justify-content-center"
                  onClick={() => setNotifOpen(false)}
                >
                  View all
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ position: "relative" }} ref={userRef}>
        <button className="user-menu-btn" onClick={() => setUserOpen((o) => !o)}>
          <span className="avatar-circle">{(user?.name || "F")[0].toUpperCase()}</span>
          <span className="user-name">{user?.name || "Farmer"}</span>
        </button>
        <AnimatePresence>
          {userOpen && (
            <motion.div
              className="dropdown-panel"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <Link to="/profile" onClick={() => setUserOpen(false)}>
                <FiUser /> My Profile
              </Link>
              <Link to="/settings" onClick={() => setUserOpen(false)}>
                <FiSettings /> Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setUserOpen(false);
                  navigate("/login");
                }}
              >
                <FiLogOut /> Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
