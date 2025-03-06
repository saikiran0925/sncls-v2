import React from "react";
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

  return (
    <div className="hp-container">
      <header className="hp-header">
        <h1 className="hp-title">{title}</h1>
        <p className="hp-subtitle">{subtitle}</p>
      </header>

      {sections.map((section, index) => (
        <section key={index} className="hp-section">
          <h2 className="hp-section-title">{section.title}</h2>

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
                  </div>
                );
              })}
            </div>
          )}

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
  );
};

export default HelpPage;
