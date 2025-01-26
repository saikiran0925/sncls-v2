import "../css/TopNavBar.css";

const TopNavBar = ({ title }) => {
  return (
    <header className="tf-app-header">
      <div className="tf-sncls">SNCLS</div>
      <div className="tf-title">{title}</div>
    </header>
  );
};

export default TopNavBar;
