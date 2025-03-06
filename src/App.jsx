import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SideNav from "./components/SideNav";
import "./App.css";
import EditorRouter from "./services/EditorRouter";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { AuthProvider, useAuth } from "./services/contexts/AuthContext";
import PrivateRoute from "./services/PrivateRoute";
import TimeForgeApp from "./pages/TimeForgeApp";
import SharedEditor from "./pages/SharedEditor";
import EncodeDecodeZone from "./pages/EncodeDecodeZone";
import { HelmetProvider } from "react-helmet-async";
import SharedLinksList from "./pages/SharedLinksList";
import HelpPage from "./pages/HelpPage";

const App = () => {

  const jsonEditorData = {
    title: "JSON Editor Help",
    subtitle: "Learn how to use the JSON Editor to format, validate, and manipulate JSON data.",
    sections: [
      {
        title: "Features",
        type: "features",
        items: [
          {
            icon: "MdFormatAlignLeft",
            title: "Prettify",
            description: "The **Prettify** button formats your JSON or text content to make it more readable.",
          },
          {
            icon: "MdFormatAlignJustify",
            title: "Stringify",
            description: "The **Stringify** button converts a JSON object into a compact string format.",
          },
        ],
      },
      {
        title: "FAQ",
        type: "faq",
        items: [
          {
            question: "How do I prettify JSON?",
            answer: "Use the **Prettify** button to format your JSON with proper indentation.",
          },
        ],
      },
    ],
  };
  const location = useLocation();

  const pathsWithUIContainer = [
    "/jsonify",
    "/blank-space",
    "/diff-editor",
    "/time-forge",
    "/encode-decode-zone",
    "/shared-list",
  ];

  const showUIContainer = pathsWithUIContainer.some(path => location.pathname.startsWith(path))
    || location.pathname.startsWith("/shared");

  return (
    <div className={showUIContainer ? "ui-container" : ""}>
      {showUIContainer && <SideNav />}
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<RedirectIfLoggedIn component={<LoginPage />} />} />
        <Route path="/signup" element={<RedirectIfLoggedIn component={<SignUpPage />} />} />
        <Route path="/shared-list/" element={<SharedLinksList />} />
        <Route path="/shared/:shareId" element={<SharedEditor />} />

        <Route element={<PrivateRoute />}>
          <Route path="/jsonify" element={<EditorRouter />} />
          <Route path="/blank-space" element={<EditorRouter />} />
          <Route path="/diff-editor" element={<EditorRouter />} />
          <Route path="/time-forge" element={<TimeForgeApp />} />
          <Route path="/encode-decode-zone" element={<EncodeDecodeZone />} />
          <Route path="/help-page" element={<HelpPage data={jsonEditorData} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </div>
  );
};

const RedirectIfLoggedIn = ({ component }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" />;
  }

  return component;
};

const AppWrapper = () => (
  <HelmetProvider>
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </HelmetProvider>
);

export default AppWrapper;
