import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axiosInstance from "../services/axiosInstance";
import { Spin, Empty } from "antd";
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
        if (err.response) {
          if (err.response.status === 404) {
            setError("Content not found or has expired.");
          } else {
            setError(`Error: ${err.response.status} - ${err.response.statusText}`);
          }
        } else if (err.request) {
          setError("No response from server. Please try again.");
        } else {
          setError("Failed to fetch shared content.");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedContent();
  }, [shareId]);

  if (loading) return <Spin tip="Loading shared content..." />;
  if (error) return (
    <div className="shared-editor-container">
      <TopNavBar title="Shared Viewer" />
      <div className="error-container">
        <Empty description={error} />
      </div>
    </div>
  );

  return (
    <div className="shared-editor-container">
      <TopNavBar title="Shared Viewer" />
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
