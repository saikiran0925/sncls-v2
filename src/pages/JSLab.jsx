import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { Layout, Button, Typography, Card } from "antd";
import '../css/JSLab.css'

const { Header, Content } = Layout;
const { Title } = Typography;

const JSLab = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [cssCode, setCssCode] = useState("");
  const [jsCode, setJsCode] = useState("");

  const generatePreview = () => {
    const iframe = document.getElementById("jslab-preview");
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <style>${cssCode}</style>
        </head>
        <body>
          ${htmlCode}
          <script>${jsCode}<\/script>
        </body>
      </html>
    `);
    doc.close();
  };

  return (
    <Layout className="jslab-container">
      <Header className="jslab-header">
        <Title level={3} className="jslab-title">JSLab - Code Playground</Title>
      </Header>

      <Content className="jslab-content">
        <div className="jslab-editors">
          <Card title="HTML" className="jslab-card">
            <CodeMirror value={htmlCode} extensions={[html()]} onChange={setHtmlCode} />
          </Card>

          <Card title="CSS" className="jslab-card">
            <CodeMirror value={cssCode} extensions={[css()]} onChange={setCssCode} />
          </Card>

          <Card title="JavaScript" className="jslab-card">
            <CodeMirror value={jsCode} extensions={[javascript()]} onChange={setJsCode} />
          </Card>
        </div>

        <Button type="primary" className="jslab-run-button" onClick={generatePreview}>
          Run Code
        </Button>

        <Card title="Live Preview" className="jslab-preview-card">
          <iframe id="jslab-preview" className="jslab-iframe"></iframe>
        </Card>
      </Content>
    </Layout>
  );
};

export default JSLab;

