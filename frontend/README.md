# Personal Finance Frontend

Frontend application for Personal Finance Management System built with React and Vite.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your API URL if needed.

### Development

Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Build for production:

```bash
npm run build
```

### Preview Production Build

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── context/        # React context providers
│   ├── assets/         # Static assets
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML template
├── package.json
├── vite.config.js      # Vite configuration
└── .env                # Environment variables
```
