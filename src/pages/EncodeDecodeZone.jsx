import React, { useState } from "react";
import "../css/EncodeDecodeZone.css";
import { FiCode, FiLink, FiTerminal } from "react-icons/fi";
import { SiJsonwebtokens } from "react-icons/si";
import { Tooltip } from "antd";
import TopNavBar from "../components/TopNavBar";
import { Helmet } from "react-helmet-async";

const EncodeDecodeZone = () => {
  const [activeFeature, setActiveFeature] = useState("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const metadata = {
    base64: {
      title: "Base64 Encoder & Decoder | SNCLS",
      description: "Encode or decode Base64 strings effortlessly.",
    },
    url: {
      title: "URL Encoder & Decoder | SNCLS",
      description: "Encode or decode URLs for safe web usage.",
    },
    jwt: {
      title: "JWT Decoder | SNCLS",
      description: "Decode JSON Web Tokens (JWT) to view payload and headers.",
    },
    escape: {
      title: "String Escaper & Unescaper | SNCLS",
      description: "Escape and unescape strings for programming & security.",
    },
  };

  const handleAction = (actionType) => {
    if (!input.trim()) {
      setOutput("Error: Input is empty");
      return;
    }

    try {
      switch (activeFeature) {
        case "base64":
          try {
            if (actionType === "encode") setOutput(btoa(input));
            else setOutput(atob(input));
          } catch (err) {
            setOutput("Error: Invalid Base64 input");
          }
          break;

        case "url":
          try {
            if (actionType === "encode") setOutput(encodeURIComponent(input));
            else setOutput(decodeURIComponent(input));
          } catch (err) {
            setOutput("Error: Invalid URL input");
          }
          break;

        case "jwt":
          try {
            const parts = input.split(".");
            if (parts.length !== 3) throw new Error("Invalid JWT format");
            const header = JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));
            setOutput(JSON.stringify({ header, payload }, null, 2));
          } catch (err) {
            setOutput("Error: Invalid JWT");
          }
          break;

        case "escape":
          if (actionType === "escape")
            setOutput(input.replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0"));
          else setOutput(input.replace(/\\(.)/g, "$1"));
          break;

        default:
          setOutput("Unsupported feature");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // Icon Mapping with tooltips
  const featureIcons = {
    base64: {
      icon: <FiCode />,
      tooltip: "Base64 Encode/Decode",
    },
    url: {
      icon: <FiLink />,
      tooltip: "URL Encode/Decode",
    },
    jwt: {
      icon: <SiJsonwebtokens />,
      tooltip: "JWT Decode",
    },
    escape: {
      icon: <FiTerminal />,
      tooltip: "Escape/Unescape Strings",
    },
  };

  const currentMetadata = metadata[activeFeature] || {
    title: "Encode Decode Zone | SNCLS",
    description: "Encode and decode various formats effortlessly.",
  };

  const ActionButton = ({ actionType, label, onClick }) => (
    <button
      className="encode-decode-zone-button"
      onClick={() => onClick(actionType)}
      aria-label={`${label} ${activeFeature}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <Helmet>
        <title>{currentMetadata.title}</title>
        <meta name="description" content={currentMetadata.description} />
        <meta property="og:title" content={currentMetadata.title} />
        <meta property="og:description" content={currentMetadata.description} />
        <meta property="og:url" content={`https://sncls.com/encode-decode-zone`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={currentMetadata.title} />
        <meta name="twitter:description" content={currentMetadata.description} />
      </Helmet>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <TopNavBar title="Encode Decode Zone" />
        <div className="encode-decode-zone">
          <div className="encode-decode-zone-card">
            {/* Feature Tabs */}
            <div className="encode-decode-zone-tabs">
              {Object.keys(featureIcons).map((feature) => (
                <Tooltip key={feature} title={featureIcons[feature].tooltip} placement="right">
                  <button
                    className={`encode-decode-zone-tab ${activeFeature === feature ? "active" : ""}`}
                    onClick={() => {
                      setActiveFeature(feature);
                      setInput("");
                      setOutput("");
                    }}
                    aria-label={`Switch to ${feature}`}
                  >
                    {featureIcons[feature].icon}
                  </button>
                </Tooltip>
              ))}
            </div>

            {/* Input, Buttons, and Output */}
            <div className="encode-decode-zone-content">
              {/* Input */}
              <textarea
                className="encode-decode-zone-input"
                placeholder={`Enter ${activeFeature} input...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label={`${activeFeature} input`}
              ></textarea>

              {/* Buttons */}
              <div className="encode-decode-zone-buttons">
                {(activeFeature === "base64" || activeFeature === "url") && (
                  <>
                    <ActionButton actionType="encode" label="Encode" onClick={handleAction} />
                    <ActionButton actionType="decode" label="Decode" onClick={handleAction} />
                  </>
                )}
                {activeFeature === "jwt" && (
                  <ActionButton actionType="decode" label="Decode" onClick={handleAction} />
                )}
                {activeFeature === "escape" && (
                  <>
                    <ActionButton actionType="escape" label="Escape" onClick={handleAction} />
                    <ActionButton actionType="unescape" label="Unescape" onClick={handleAction} />
                  </>
                )}
              </div>

              {/* Output */}
              <textarea
                className="encode-decode-zone-output"
                placeholder="Output will appear here..."
                value={output}
                readOnly
                aria-label="Output"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EncodeDecodeZone;
