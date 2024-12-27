import React from 'react';
import './InboxSidebar.css';

const Card = ({ name, title, content, timestamp }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{name}</h3>
        <span className="card-timestamp">{timestamp}</span>
      </div>
      <h4 className="card-subtitle">{title}</h4>
      <p className="card-content">{content}</p>
    </div>
  );
};

const InboxSidebar = () => {
  const cardsData = [
    {
      name: "William Smith",
      title: "Meeting Tomorrow",
      content:
        "Hi, let's have a meeting tomorrow to discuss the project. I've been reviewing the project details and have some ideas I'd like to share. It's...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
    {
      name: "Alice Smith",
      title: "Re: Project Update",
      content:
        "Thank you for the project update. It looks great! I've gone through the report, and the progress is impressive. The team has done a fantastic...",
      timestamp: "about 1 year ago",
    },
    {
      name: "Bob Johnson",
      title: "Weekend Plans",
      content:
        "Any plans for the weekend? I was thinking of going hiking in the nearby mountains. It's been a while since we had some outdoor fun. If...",
      timestamp: "over 1 year ago",
    },
  ];

  return (
    <div className="sidebar-container">
      <div className="inbox-header">
        <h2>Inbox</h2>
        <div className="tabs">
          <button className="tab active">All mail</button>
          <button className="tab">Unread</button>
        </div>
      </div>
      <input className="search-bar" type="text" placeholder="Search" />
      <div className="card-list">
        {cardsData.map((card, index) => (
          <Card
            key={index}
            name={card.name}
            title={card.title}
            content={card.content}
            timestamp={card.timestamp}
          />
        ))}
      </div>
    </div>
  );
};

export default InboxSidebar;
