import "../css/TopNavBar.css";
import { CiUser } from "react-icons/ci";

// We are not using this component
const TopNavBar = () => {
  return (
    <div className="top-navbar">
      <div className="navbar-logo">
        <img src="/path-to-logo.png" alt="Logo" className="logo" />
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>
      <div className="navbar-profile">
        <CiUser />
      </div>
    </div>
  );
};

export default TopNavBar;
