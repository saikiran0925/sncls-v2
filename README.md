# SNCLS (essentials)

Welcome to the SNCLS (pronounced as essentials)! This tool is designed to consolidate the most commonly used tools by developers into one convenient location. Currently, we have implemented the JSON Editor, and more tools will be added soon. Stay tuned for updates!

## Table of Contents

- [Features](#features)
  - [JSON Editor](#json-editor)
- [Upcoming Tools](#upcoming-tools)
- [Installation](#installation)
- [Contributing](#contributing)

## Features

### JSON Editor

The JSON Editor is a versatile tool that allows you to edit and format JSON data with ease. Here are the features currently available:

1. **Prettify**: This feature prettifies the actual string JSON, making it more readable and easier to understand.
2. **Stringify**: Converts JSON to a string, which is essentially the reverse of the Prettify function.
3. **Vim Mode**: Enables Vim mode in the editor for those who prefer using Vim keybindings.
4. **Copy**: Copies the content of the editor to your clipboard with a single click.
5. **Error Annotations**: The editor highlights errors in the JSON and suggests resolutions, helping you debug your JSON quickly.
6. **Store Data**: We are storing your data in your local storage. Our tool is able to retrieve your previous data even if you restart.

## Upcoming Tools

We are actively working on adding the following tools to the SNCLS:

1. **JWT Decoder**: Decode JSON Web Tokens to view the payload and header.
2. **Base64 Encoder/Decoder**: Encode and decode Base64 strings.
3. **URL Encoder/Decoder**: Encode and decode URLs.
4. **Text Compare**: Compare two pieces of text to highlight differences.

## Installation

### Method 1: Cloning and running in local

To get started with the SNCLS, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/saikiran0925/sncls.git
cd sncls
npm install
```

After installing the dependencies, you can start the application with:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to access the SNCLS.

### Method 2: Run using Docker

We have depoyed this code in our own Docker Hub so to run SNCLS using Docker, you can use either of these ways.

#### Option 1: Docker command

Pull the Docker image:

```bash
docker pull saikiran0925/sncls:latest
```

Run the Docker container:

```
docker run -d -p 5173:5173 saikiran0925/sncls:latest
```

Open your browser and navigate to `http://localhost:5173` to access the SNCLS.

#### Option 2: Docker Compose

Create docker-compose.yml file with the below contents

```yml
version: "3"
services:
  sncls:
    image: saikiran0925/sncls:latest
    ports:
      - "5173:5173"
```

Pull and recreate container using below commands

```bash
docker-compose pull saikiran0925/sncls:latest
docker-compose up -d saikiran0925/sncls:latest
```

Open your browser and navigate to `http://localhost:5173` to access the SNCLS.

## Contributing

We welcome contributions from the community! If you have a feature request, bug report, or want to contribute code, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a Pull Request.
