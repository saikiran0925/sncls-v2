import React, { useState, useEffect } from 'react';
import '../css/TimeForgeApp.css';
import { showNotification } from '../utilities/utils';
import TopNavBar from '../components/TopNavBar';
import { Helmet } from "react-helmet-async";

// Helper function to get the current epoch time
const getCurrentEpochTime = () => Math.floor(Date.now() / 1000);

// App container component
const AppContainer = ({ children }) => (
  <div className="tf-app-container">{children}</div>
);

// Current Epoch Time component
const CurrentEpochTime = () => {
  const [currentEpochTime, setCurrentEpochTime] = useState(getCurrentEpochTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEpochTime(getCurrentEpochTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tf-current-epoch-box">
      <p className="tf-epoch-text">{currentEpochTime}</p>
      <button
        className="tf-copy-epoch-button"
        onClick={() => {
          navigator.clipboard.writeText(currentEpochTime);
          showNotification("info", "Epoch time copied to clipboard!");
        }}
      >
        Copy Epoch Time
      </button>
    </div>
  );
};

const TimestampConverter = ({ addHistory }) => {
  const [timestamp, setTimestamp] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [convertedTime, setConvertedTime] = useState('');

  const handleConvert = () => {
    if (!timestamp || isNaN(timestamp)) {
      showNotification("warning", "Please enter a valid timestamp");
      return;
    }

    const timestampNumber = Number(timestamp);

    // Check if the timestamp is in milliseconds (13 digits) or seconds (10 digits)
    const isMilliseconds = timestamp.toString().length === 13;

    // Validate the timestamp range
    const currentEpochTime = getCurrentEpochTime();
    if (
      (isMilliseconds && timestampNumber < 0) ||
      (!isMilliseconds && timestampNumber < 0) ||
      (isMilliseconds && timestampNumber > currentEpochTime * 1000) ||
      (!isMilliseconds && timestampNumber > currentEpochTime)
    ) {
      showNotification("warning", "Timestamp is out of range");
      return;
    }

    try {
      // Convert to milliseconds if the input is in seconds
      const date = new Date(isMilliseconds ? timestampNumber : timestampNumber * 1000);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      const options = { timeZone: timezone, hour12: false };
      const formattedTime = new Intl.DateTimeFormat('en-US', {
        ...options,
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(date);

      setConvertedTime(formattedTime);
      addHistory('Timestamp Converter', { timestamp, formattedTime });
    } catch {
      setConvertedTime("Invalid timestamp");
    }
  };

  const clearFields = () => {
    setTimestamp('');
    setConvertedTime('');
  };

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
  ];

  return (
    <div className="tf-card-box">
      <h2 className="tf-card-title">Timestamp Converter</h2>
      <input
        className="tf-input-field"
        type="number"
        placeholder="Enter Epoch Timestamp (seconds or milliseconds)"
        value={timestamp}
        onChange={(e) => setTimestamp(e.target.value)}
      />
      <label htmlFor="timezone-select">Select Timezone:</label>
      <select
        id="timezone-select"
        className="tf-select-field"
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
      <div className="tf-inline-convert-output">
        <button className="tf-submit-button" onClick={handleConvert}>Convert</button>
        <button className="tf-clear-button" onClick={clearFields}>Clear</button>
        {convertedTime && (
          <div className="tf-converted-output">
            <p className="tf-converted-title">Converted Time:</p>
            <p className="tf-converted-time">{convertedTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Timezone Converter component
const TimezoneConverter = ({ addHistory }) => {
  const [selectedTime, setSelectedTime] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('UTC');
  const [targetTimezone, setTargetTimezone] = useState('Asia/Kolkata');
  const [convertedTime, setConvertedTime] = useState('');

  const handleConvert = () => {
    if (!selectedTime) {
      showNotification("error", "Please select a valid time");
      return;
    }
    try {
      const date = new Date(selectedTime + "Z"); // Treat as UTC
      const sourceTimeFormatted = new Intl.DateTimeFormat("en-US", {
        timeZone: sourceTimezone,
        hour12: false,
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(date);

      const convertedTimeFormatted = new Intl.DateTimeFormat("en-US", {
        timeZone: targetTimezone,
        hour12: false,
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(date);

      setConvertedTime(convertedTimeFormatted);
      addHistory('Timezone Converter', {
        selectedTime: sourceTimeFormatted,
        sourceTimezone,
        targetTimezone,
        convertedTime: convertedTimeFormatted,
      });
    } catch (error) {
      setConvertedTime("Invalid time format");
    }
  };

  const clearFields = () => {
    setSelectedTime('');
    setConvertedTime('');
  };

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
  ];

  return (
    <div className="tf-card-box">
      <h2 className="tf-card-title">Timezone Converter</h2>
      <input
        type="datetime-local"
        className="tf-input-field"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      />
      <label htmlFor="source-timezone">Select Source Timezone:</label>
      <select
        id="source-timezone"
        className="tf-select-field"
        value={sourceTimezone}
        onChange={(e) => setSourceTimezone(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>

      <label htmlFor="target-timezone">Select Target Timezone:</label>
      <select
        id="target-timezone"
        className="tf-select-field"
        value={targetTimezone}
        onChange={(e) => setTargetTimezone(e.target.value)}
      >
        {timezones.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>

      <div className="tf-inline-convert-output">
        <button className="tf-submit-button" onClick={handleConvert}>Convert</button>
        <button className="tf-clear-button" onClick={clearFields}>Clear</button>
        {convertedTime && (
          <div className="tf-converted-output">
            <p className="tf-converted-title">Converted Time:</p>
            <p className="tf-converted-time">{convertedTime}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Epoch History component
const EpochHistory = ({ history, handleDeleteHistory }) => (
  <div className="tf-card-box tf-epoch-history-container">
    <h2 className="tf-history-title">Conversion History</h2>
    <div className="tf-history-scroll">
      {history.length === 0 ? (
        <p className="tf-no-history">No history available</p>
      ) : (
        <ul className="tf-history-list">
          {history.map((entry) => (
            <li key={entry.id} className="tf-history-item">
              <span className="tf-history-type">{entry.type}:</span>
              <pre className="tf-history-details">
                {JSON.stringify(entry.data, null, 2)}
              </pre>
              <button
                className="tf-delete-history-button"
                onClick={() => handleDeleteHistory(entry.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

// Main TimeForgeApp component
const TimeForgeApp = () => {
  const [history, setHistory] = useState([]);

  const addHistory = (type, data) => {
    setHistory((prev) => [
      { type, data, id: Date.now() },
      ...prev,
    ]);
  };

  const handleDeleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AppContainer>
      <Helmet>
        <title>Time Forge - Epoch & Time Converter | SNCLS</title>
        <meta name="description" content="Convert epoch timestamps, adjust timezones, and perform precise date-time conversions. A powerful tool for developers." />
        <meta name="keywords" content="epoch time, timestamp converter, timezone conversion, UTC, time tools, developer utilities" />
        <meta name="author" content="SNCLS" />
        <meta property="og:title" content="Time Forge - Epoch & Time Converter | SNCLS" />
        <meta property="og:description" content="Easily convert epoch timestamps and timezones with Time Forge." />
        <meta property="og:url" content="https://sncls.com/time-forge" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Time Forge - Epoch & Time Converter | SNCLS" />
        <meta name="twitter:description" content="Easily convert timestamps and adjust timezones with Time Forge." />
      </Helmet>

      <TopNavBar title="TimeForge" />
      <div className="tf-main-content">
        <div className="tf-top-section-container">
          <div className="tf-left-section">
            <CurrentEpochTime />
            <TimestampConverter addHistory={addHistory} />
          </div>
          <TimezoneConverter addHistory={addHistory} />
        </div>
        <div className="tf-history-section">
          <EpochHistory history={history} handleDeleteHistory={handleDeleteHistory} />
        </div>
      </div>
    </AppContainer>
  );
};

export default TimeForgeApp;
