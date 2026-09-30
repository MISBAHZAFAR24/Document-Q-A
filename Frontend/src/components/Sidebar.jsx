import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        📚 Document Q&A
      </div>

      <NavLink to="/dashboard" className="sidebar-link">
        🏠 Dashboard
      </NavLink>

      <NavLink to="/documents" className="sidebar-link">
        📄 Documents
      </NavLink>
    </aside>
  );
}

export default Sidebar;