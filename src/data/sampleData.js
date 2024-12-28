const sampleData = {
  jsonify: [
    {
      id: 1,
      name: "Alice Johnson",
      title: "Understanding JSON",
      content: "{\n  \"userId\": 1,\n  \"name\": \"Sai Kiran Bade\",\n  \"email\": \"alice@example.com\",\n  \"tasks\": [\n    \"Buy groceries\",\n    \"Read a book\",\n    \"Workout\"\n  ]\n}",
      timestamp: "3 days ago",
    },
    {
      id: 2,
      name: "Bob Williams",
      title: "API Mock Data",
      content: JSON.stringify({
        productId: 101,
        productName: "Wireless Headphones",
        price: 99.99,
        inStock: true,
      }, null, 2),
      timestamp: "5 days ago",
    },
  ],
  blankSpace: [
    {
      id: 1,
      name: "Charlie Davis",
      title: "The Art of Nothing",
      content: "Embrace the void. Sometimes, nothing is more powerful than words.",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      name: "Diana Scott",
      title: "Whitespace in Design",
      content: "Whitespace is like air: it is necessary for design to breathe.",
      timestamp: "1 week ago",
    },
    {
      id: 3,
      name: "Evan Harris",
      title: "Silent Notes",
      content: "In silence, we find the answers that words cannot provide.",
      timestamp: "10 days ago",
    },
  ],
  diffEditor: [
    {
      id: 1,
      name: "Frank Brown",
      title: "Compare Configuration Files",
      content: {
        left: `
        {
          "server": "prod.example.com",
          "port": 8080,
          "useSSL": true,
          "timeout": 30
        }
        `,
        right: `
        {
          "server": "dev.example.com",
          "port": 8080,
          "useSSL": false,
          "timeout": 60
        }
        `,
      },
      timestamp: "12 hours ago",
    },
    {
      id: 2,
      name: "Grace Lee",
      title: "Version Comparison",
      content: {
        left: `
        <html>
          <head>
            <title>Old Version</title>
          </head>
          <body>
            <h1>Welcome to our Website</h1>
          </body>
        </html>
        `,
        right: `
        <html>
          <head>
            <title>New Version</title>
          </head>
          <body>
            <h1>Welcome to our Amazing Website</h1>
            <p>Experience the best content here.</p>
          </body>
        </html>
        `,
      },
      timestamp: "2 days ago",
    },
  ],
};

export default sampleData;

