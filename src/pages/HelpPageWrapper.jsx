import { useParams } from "react-router-dom";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import HelpPage from "../pages/HelpPage";
import { helpPages } from "../data/helpData";
import TopNavBar from "../components/TopNavBar";
import "../css/HelpPageWrapper.css";

const HelpPageWrapper = () => {
  const { topic } = useParams();
  const data = helpPages[topic];

  if (!data) {
    return (
      <div className="hpw-container">
        <TopNavBar title="Help Center" />
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the help topic you are looking for does not exist."
          extra={
            <Link to="/help">
              <Button type="primary">Back to Help Center</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="hpw-container">
      <TopNavBar title="Help Center" />
      <HelpPage data={data} />
    </div>
  );
};

export default HelpPageWrapper;
