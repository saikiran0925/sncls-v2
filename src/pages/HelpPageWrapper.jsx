import { useParams, Navigate } from "react-router-dom";
import HelpPage from "../pages/HelpPage";
import { helpPages } from "../data/helpData";
import TopNavBar from "../components/TopNavBar";
import "../css/HelpPageWrapper.css";

const HelpPageWrapper = () => {
  const { topic } = useParams();
  const data = helpPages[topic];

  if (!data) return <Navigate to="/" />;

  return (
    <div className="hpw-container">
      <TopNavBar title="Help Page" />
      <HelpPage data={data} />
    </div>
  );
};

export default HelpPageWrapper;
