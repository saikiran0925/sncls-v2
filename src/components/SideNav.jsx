import React from "react";
import "../css/SideNav.css";
import { BsFiletypeJson } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { MdOutlineCompare, MdLockReset } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import logo from '/public/logo.svg';
import { IoMdShare } from "react-icons/io";
import { Tooltip } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegClock } from "react-icons/fa";
import { useAuth } from '../services/contexts/AuthContext';
import Logo from "../../public/logo.svg"

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
          <NavLink to="/" style={{ height: "36px" }}>
            <img src={Logo} alt="Page Logo" width={36} height={36} />
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

          <Tooltip placement="left" title="Time Forge">
            <NavLink
              to="/time-forge"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <FaRegClock className="icon" />
            </NavLink>
          </Tooltip>

          <Tooltip placement="left" title="Encode Decode Zone">
            <NavLink
              to="/encode-decode-zone"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <MdLockReset className="icon" />
            </NavLink>
          </Tooltip>

          <Tooltip placement="left" title="Shared List">
            <NavLink
              to="/shared-list"
              className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
            >
              <IoMdShare className="icon" />
            </NavLink>
          </Tooltip>

        </div>

        {/* <div className="divider"></div> */}

        {/* <div className="utility-menu"> */}
        {/*   <Tooltip placement="left" title="Log Out"> */}
        {/*     <NavLink className="utility-logo" onClick={handleLogout}> */}
        {/*       <IoIosLogOut className="icon" /> */}
        {/*     </NavLink> */}
        {/*   </Tooltip> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default SideNav;
