import SideNav from "./components/SideNav";
import TopNavBar from "./components/TopNavBar";
import Card from "./components/Card";
import InboxSideBar from "./components/InboxSideBar";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <SideNav />
      <InboxSideBar />
    </div>
  );
}

export default App;
