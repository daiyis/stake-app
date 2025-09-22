# Stake App 📈

A modern mobile-first investment and trading application built with Ionic Angular. This app provides users with the ability to discover, invest in, and track stocks and other financial instruments.

## 🚀 Features

- **Stock Discovery**: Browse and discover various stocks and investment opportunities
- **Investment Management**: Invest in stocks and manage your portfolio
- **Real-time Data**: View real-time stock prices and market data
- **Responsive Design**: Mobile-first design that works across all devices
- **State Management**: Powered by NgRx for predictable state management

## 🛠️ Tech Stack

- **Frontend**: Ionic 8 + Angular 20
- **State Management**: NgRx (Store, Effects, DevTools)
- **API**: JSON Server for mock backend data
- **Testing**: Jest + Angular Testing Library

## 📱 Project Structure

```
stake-app/
├── src/
│   ├── app/
│   │   ├── shared/           # Shared components, models, and services
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── models/       # TypeScript interfaces and models
│   │   │   ├── services/     # Business logic and API services
│   │   │   └── shared.module.ts
│   │   ├── store/            # NgRx state management
│   │   ├── tab-discover/     # Stock discovery and browsing
│   │   ├── tab-invest/       # Investment management and portfolio
│   │   ├── tabs/             # Main tab navigation
│   │   ├── app-routing.module.ts
│   │   ├── app.component.*
│   │   └── app.module.ts
│   ├── assets/               # Static assets (images, icons, etc.)
│   ├── environments/         # Environment configurations
│   ├── theme/                # Global styling and CSS variables
│   ├── global.scss           # Global styles
│   ├── index.html            # Main HTML file
│   ├── main.ts               # Application bootstrap
│   └── polyfills.ts          # Browser compatibility
├── www/                      # Built application output
├── db.json                   # Mock API data (JSON Server)
├── ionic.config.json         # Ionic CLI configuration
├── angular.json              # Angular workspace configuration
├── package.json              # Dependencies and scripts
└── tsconfig.json             # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stake-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development environment**
   ```bash
   npm run dev
   ```
   This will start both the JSON Server (API) on port 3001 and the Ionic dev server.

## 🏗️ Architecture

### State Management (NgRx)
The app uses NgRx for state management, providing:
- Centralized state store
- Predictable state updates through actions and reducers
- Side effects handling with Effects
- Time-travel debugging with Redux DevTools

### Component Structure
- **Tab-based Navigation**: Main navigation between Discover and Invest tabs
- **Shared Components**: Reusable UI components in the shared module
- **Feature Modules**: Each tab has its own feature module for better organization

### API Layer
- **JSON Server**: Mock REST API for development
- **Services**: Angular services handle API communication and business logic
- **Models**: TypeScript interfaces define data structures

## 📊 Mock Data

The `db.json` file contains mock data for:
- Stock information (AAPL, GOOGL, MSFT, etc.)
- Market data and pricing
- Investment portfolios
- User data


## 🧪 Testing

Run tests with **Jest** and **Angular Testing Library**:

```bash
npm test              # Run tests once
```

**What's included:**
- Fast Jest test runner (replaces Karma)
- Angular Testing Library for user-focused testing
- Extended Jest matchers for DOM assertions
- Real user interaction simulation


## 🚀 Deployment

### StackBlitz Hosting

Try the app online: **[Open in StackBlitz](https://stackblitz.com/github/daiyis/stake-app)**

## 🔮 Future Improvements

### Technical Enhancements
- [ ] **Ngrx**: different feature store for each feature module
- [ ] **Performance**: Implement virtual scrolling for large lists

### Infrastructure
- [ ] **Backend Migration**: Move from JSON Server to production backend (Node.js/Express, NestJS)
- [ ] **Database**: Implement proper database (PostgreSQL, MongoDB)
- [ ] **CI/CD Pipeline**: Automated testing and deployment

