import React from "react";
import { Breadcrumb, Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MdFormatAlignLeft,
  MdFormatAlignJustify,
  MdDeleteOutline,
  MdCode,
} from "react-icons/md";
import { TbBandage, TbBandageFilled } from "react-icons/tb";
import { LuClipboardCopy } from "react-icons/lu";
import { AiOutlineSave } from "react-icons/ai";
import { IoMdShare } from "react-icons/io";
import "../css/HelpPage.css";

const iconComponents = {
  MdFormatAlignLeft,
  MdFormatAlignJustify,
  MdDeleteOutline,
  MdCode,
  TbBandage,
  TbBandageFilled,
  LuClipboardCopy,
  AiOutlineSave,
  IoMdShare,
};

const HelpPage = ({ data }) => {
  const { title, subtitle, sections } = data;
  const location = useLocation();

  const pathMap = {
    "/help/jsonify": "JSONify",
    "/help/encode-decode": "Encode/Decode",
    "/help/diff-editor": "Diff Editor",
  };

  return (
    <div className="hp-container">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="hp-breadcrumb">
        <Breadcrumb.Item>
          <Link to="/help">Help Center</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{pathMap[location.pathname] || "Help Page"}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Scrollable Main Content */}
      <div className="hp-main-content">
        {sections.map((section, index) => (
          <section key={index} className="hp-section">
            <h2 className="hp-section-title">{section.title}</h2>

            {/* Features Section */}
            {section.type === "features" && (
              <div className="hp-features">
                {section.items.map((item, idx) => {
                  const Icon = iconComponents[item.icon];
                  return (
                    <div key={idx} className="hp-feature-card">
                      <h3 className="hp-feature-title">
                        {Icon && <Icon className="hp-icon" />} {item.title}
                      </h3>
                      <p
                        className="hp-feature-description"
                        dangerouslySetInnerHTML={{
                          __html: item.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />

                      {/* Input Block */}
                      {item.input && (
                        <div className="hp-io-block hp-input">
                          <h4 className="hp-io-title">Input</h4>
                          <pre className="hp-io-content">{item.input}</pre>
                        </div>
                      )}

                      {/* Output Block */}
                      {item.output && (
                        <div className="hp-io-block hp-output">
                          <h4 className="hp-io-title">Output</h4>
                          <pre className="hp-io-content">{item.output}</pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* FAQ Section */}
            {section.type === "faq" && (
              <div className="hp-faqs">
                {section.items.map((item, idx) => (
                  <div key={idx} className="hp-faq-card">
                    <h3 className="hp-faq-question">{item.question}</h3>
                    <p
                      className="hp-faq-answer"
                      dangerouslySetInnerHTML={{
                        __html: item.answer.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Contact Section */}
            {section.type === "contact" && (
              <p
                className="hp-contact-text"
                dangerouslySetInnerHTML={{
                  __html: section.description.replace(
                    /\[(.*?)\]\((.*?)\)/g,
                    '<a href="$2" className="hp-contact-link">$1</a>'
                  ),
                }}
              />
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
