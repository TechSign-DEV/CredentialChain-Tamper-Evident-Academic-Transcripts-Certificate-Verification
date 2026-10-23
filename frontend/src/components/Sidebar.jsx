
import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  FileText,
  FileCheck,
  History,
  ClipboardList,
  Building2,
  LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const links = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "INSTITUTION", "RECRUITER"]
    },
    {
      label: "Institution Verification",
      to: "/admin/institutions",
      icon: Building2,
      roles: ["ADMIN"]
    },
    {
      label: "Certificates",
      to: "/certificates",
      icon: FileText,
      roles: ["ADMIN", "INSTITUTION"]
    },
    {
      label: "Verify Certificate",
      to: "/verify",
      icon: FileCheck,
      roles: ["RECRUITER"]
    },
    {
      label: "Verification History",
      to: "/history",
      icon: History,
      roles: ["RECRUITER"]
    },
   
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <ShieldCheck size={28} />
        <span>CredentialChain</span>
      </div>

      <p className="sidebar-caption">WORKSPACE</p>

      <nav className="sidebar-nav">
        {links
          .filter((link) => link.roles.includes(user?.role))
          .map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="user-details">
          <strong>{user?.name || "User"}</strong>
          <span>{user?.role}</span>
        </div>

        <button
          type="button"
          className="icon-button"
          title="Logout"
          aria-label="Logout"
          onClick={logout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
