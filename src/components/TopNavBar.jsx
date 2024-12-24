import "./TopNavBar.css";
import { CiUser } from "react-icons/ci";

const TopNavBar = () => {
  return (
    <div className="top-navbar">
      {/* Left Side: Logo */}
      <div className="navbar-logo">
        <img src="/path-to-logo.png" alt="Logo" className="logo" />
      </div>

      {/* Middle: Search Bar */}
      <div className="navbar-search">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      {/* Right Side: User Profile */}
      <div className="navbar-profile">
        <CiUser />
      </div>
    </div>
  );
};

export default TopNavBar;
