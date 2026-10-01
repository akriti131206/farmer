import { Link, useLocation } from "react-router-dom";
import "./FarmModulesNav.css";

const moduleLinks = [
  ["/crop-calendar", "Crop Calendar"],
  ["/weather-intelligence", "Weather Intelligence"],
  ["/farm-calculator", "Farm Calculator"],
  ["/government-schemes", "Government Schemes"],
  ["/nearby-services", "Nearby Services"],
];

export default function FarmModulesNav() {
  const { pathname } = useLocation();

  return (
    <nav className="farm-modules-nav mb-4" aria-label="Farmer tools">
      <span>Farmer tools</span>
      <div>
        {moduleLinks.map(([path, label]) => (
          <Link key={path} to={path} aria-current={pathname === path ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
