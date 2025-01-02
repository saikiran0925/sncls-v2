import React from "react";
import "../css/SideNav.css";
import { BsFiletypeJson } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { SiTheboringcompany } from "react-icons/si";
import { MdOutlineCompare } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import { Tooltip } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../services/contexts/AuthContext';

const SideNav = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  }
  return (
    <div className="side-nav-container">
      <div className="nav-box">
        <div className="company-logo">
          <NavLink to="/">
            <SiTheboringcompany className="icon" />
          </NavLink>
        </div>

        <div className="divider"></div>

        <div className="feature-menu">
          <Tooltip placement="left" title="JSONify">
            <NavLink
              to="/jsonify"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <BsFiletypeJson className="icon" />
            </NavLink>
          </Tooltip>

          <Tooltip placement="left" title="Blank Space">
            <NavLink
              to="/blank-space"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <GrNotes className="icon" />
            </NavLink>
          </Tooltip>

          <Tooltip placement="left" title="Diff Editor">
            <NavLink
              to="/diff-editor"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <MdOutlineCompare className="icon" />
            </NavLink>
          </Tooltip>
        </div>

        <div className="divider"></div>

        <div className="utility-menu">
          <Tooltip placement="left" title="Log Out">
            <NavLink className="utility-logo" onClick={handleLogout}>
              <IoIosLogOut className="icon" />
            </NavLink>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
