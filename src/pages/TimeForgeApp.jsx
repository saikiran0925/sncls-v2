import React, { useState, useEffect } from 'react';
import '../css/TimeForgeApp.css';
import { showNotification } from "../utilities/utils";

const getCurrentEpochTime = () => Math.floor(Date.now() / 1000);

const AppContainer = ({ children }) => (
  <div className="tf-app-container">{children}</div>
);

const Header = () => (
  <header className="tf-app-header">
    <h1>TimeForge - Advanced Time Tool</h1>
  </header>
);

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
    if (!timestamp) {
      showNotification("warning", "Please enter a valid timestamp");
      return;
    }
    try {
      const date = new Date(Number(timestamp) * 1000);
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

  return (
    <div className="tf-card-box">
      <h2 className="tf-card-title">Timestamp Converter</h2>
      <input
        className="tf-input-field"
        type="number"
        placeholder="Enter Epoch Timestamp"
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
        <option value="UTC">UTC</option>
        <option value="Asia/Kolkata">India (IST)</option>
        <option value="America/New_York">New York (EST)</option>
        <option value="America/Los_Angeles">Los Angeles (PST)</option>
        <option value="Europe/London">London (GMT)</option>
      </select>
      <button className="tf-submit-button" onClick={handleConvert}>Convert</button>
      {convertedTime && (
        <div className="tf-converted-output">
          <p>{convertedTime}</p>
        </div>
      )}
    </div>
  );
};

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
      const date = new Date(selectedTime);
      const options = { timeZone: sourceTimezone, hour12: false };
      const sourceTimeFormatted = new Intl.DateTimeFormat("en-US", {
        ...options,
        dateStyle: 'full',
        timeStyle: 'medium',
      }).format(date);

      const targetOptions = { timeZone: targetTimezone, hour12: false };
      const convertedTimeFormatted = new Intl.DateTimeFormat("en-US", {
        ...targetOptions,
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

  return (
    <div className="tf-card-box">
      <h2 className="tf-card-title">Convert Time Between Timezones</h2>
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
        <option value="UTC">UTC</option>
        <option value="Asia/Kolkata">India (IST)</option>
        <option value="America/New_York">New York (EST)</option>
        <option value="America/Los_Angeles">Los Angeles (PST)</option>
        <option value="Europe/London">London (GMT)</option>
      </select>

      <label htmlFor="target-timezone">Select Target Timezone:</label>
      <select
        id="target-timezone"
        className="tf-select-field"
        value={targetTimezone}
        onChange={(e) => setTargetTimezone(e.target.value)}
      >
        <option value="UTC">UTC</option>
        <option value="Asia/Kolkata">India (IST)</option>
        <option value="America/New_York">New York (EST)</option>
        <option value="America/Los_Angeles">Los Angeles (PST)</option>
        <option value="Europe/London">London (GMT)</option>
      </select>

      <button className="tf-submit-button" onClick={handleConvert}>Convert Time</button>

      {convertedTime && (
        <div className="tf-converted-output">
          <p>Converted Time: {convertedTime}</p>
        </div>
      )}
    </div>
  );
};

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
              <span className="tf-history-details">{JSON.stringify(entry.data, null, 2)}</span>
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
      <Header />
      <div className="tf-main-content">
        <div className="tf-left-pane">
          <CurrentEpochTime />
          <TimestampConverter addHistory={addHistory} />
        </div>
        <div className="tf-right-pane">
          <TimezoneConverter addHistory={addHistory} />
          <EpochHistory history={history} handleDeleteHistory={handleDeleteHistory} />
        </div>
      </div>
    </AppContainer>
  );
};

export default TimeForgeApp;
