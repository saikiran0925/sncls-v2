import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axiosInstance from "../services/axiosInstance";
import { Spin, Alert } from "antd";
import TopNavBar from '../components/TopNavBar';
import '../css/SharedEditor.css';

const SharedEditor = () => {
  const { shareId } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const height = `${window.innerHeight - 65}px`;
  const width = `${window.innerWidth - 60}px`;

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        const response = await axiosInstance.get(`/shared/${shareId}`);
        if (response.data?.data) {
          setContent(response.data.data);
        } else {
          setError("Content not found or has expired.");
        }
      } catch (err) {
        setError("Failed to fetch shared content.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareId]);

  if (loading) return <Spin tip="Loading shared content..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div className="shared-editor-container">
      <TopNavBar title="Shared Editor" />
      <div className="editor-wrapper">
        <Editor
          height={height}
          width={width}
          defaultLanguage="json"
          value={content}
          options={{ readOnly: true, minimap: { enabled: false } }}
        />
      </div>
    </div>
  );
};

export default SharedEditor;

