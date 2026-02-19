# CLAUDE.md - BrightBook Educational Assessment Application

## Project Overview

BrightBook is a React-based educational assessment application designed for evaluating children's reading skills. The app guides children through an interactive assessment, determines their reading level, and provides personalized learning activities. This is a full-stack application with a React frontend and planned Python/SQLite backend.

## Technology Stack

### Core Technologies
- **React 19.2.0** - UI framework with JSX
- **Vite 7.2.4** - Build tool and development server
- **React Router DOM 7.12.0** - Client-side routing
- **ESLint 9.39.1** - Code linting with React plugins
- **JavaScript (ES6+)** - No TypeScript currently used

### Dependencies
- **canvas-confetti 1.9.4** - Celebration animations
- **lucide-react 0.562.0** - Icon library
- **React 19.2.0** - Core UI framework
- **react-dom 19.2.0** - DOM rendering
- **react-router-dom 7.12.0** - Navigation and routing

### Development Dependencies
- **@eslint/js 9.39.1** - ESLint core
- **@types/react 19.2.5** - React type definitions
- **@vitejs/plugin-react 5.1.1** - Vite React plugin
- **eslint-plugin-react-hooks 7.0.1** - React hooks linting
- **eslint-plugin-react-refresh 0.4.24** - React Fast Refresh linting
- **globals 16.5.0** - Global variables definition
- **vite 7.2.4** - Build tool

## Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Badges.jsx     # Achievement badges display
│   ├── ChildMap.jsx   # Child progress visualization
│   ├── NotificationBell.jsx # Notifications
│   ├── ProtectedRoute.jsx # Route protection
│   └── QuestionCard.jsx # Assessment question component
├── context/           # React context providers
│   └── AuthContext.jsx # Authentication state management
├── data/              # Static application data
│   ├── learningPlans.js # Learning progression data
│   ├── questions.js  # Assessment questions
│   └── rewards.js    # Badge/achievement system
├── pages/             # Route-level page components
│   ├── activities/    # Interactive learning activities
│   │   ├── LetterHunt.jsx
│   │   ├── LetterTracing.jsx
│   │   └── PhonicsMatch.jsx
│   ├── Assessment.jsx # Main assessment flow
│   ├── Dashboard.jsx  # Results dashboard
│   ├── Home.jsx       # Landing page
│   ├── Login.jsx      # Authentication
│   ├── Settings.jsx   # User settings
│   ├── SignUp.jsx     # Registration
│   └── activities/   # Learning activities
├── services/          # API services and external integrations
│   └── api.js        # Backend API integration
└── main.jsx          # Application entry point
```

### Application Flow
1. **Authentication Flow**: Home → Login/SignUp → Protected routes
2. **Assessment Flow**: Assessment page → 5 questions → Results → Dashboard
3. **Activity Flow**: Dashboard → Selected activities → Learning progress

## Key Architectural Patterns

### State Management
- **React Context**: Authentication state managed via `AuthContext`
- **Component State**: Local component state using `useState` hooks
- **Local Storage**: Persistent data storage for auth tokens and user data

### Component Architecture
- **Page Components**: Route-level components handling major app sections
- **Reusable Components**: Shared UI components for consistent design
- **Higher-Order Components**: `ProtectedRoute` for route protection

### Data Management
- **Static Data**: Questions, learning plans, and rewards defined in `src/data/`
- **API Integration**: Backend services via `src/services/api.js`
- **Local Storage**: Client-side data persistence

## Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run lint         # Run ESLint to check code quality
npm run preview      # Preview production build locally
```

## Styling System

### CSS Custom Properties
The application uses a comprehensive CSS custom property system defined in `src/index.css`:

**Color Palette**:
- `--color-primary: #FF6B6B` (Fun Orange/Red)
- `--color-secondary: #4ECDC4` (Calm Teal)
- `--color-accent: #FFE66D` (Bright Yellow)
- `--color-dark: #2D3436` (Dark Gray)
- `--color-light: #F7F9FC` (Light Background)

**Typography**:
- `--font-heading: 'Outfit', sans-serif` (Clean, modern)
- `--font-body: 'Comic Neue', cursive, sans-serif` (Child-friendly)

**Spacing System**:
- `--spacing-xs: 0.5rem`, `--spacing-sm: 1rem`, `--spacing-md: 2rem`, `--spacing-lg: 3rem`

**Border Radius**:
- `--radius-sm: 8px`, `--radius-md: 16px`, `--radius-lg: 24px`, `--radius-full: 9999px`

**Shadows**:
- `--shadow-sm`, `--shadow-md`, `--shadow-lg` for depth

## Authentication System

### AuthContext Features
- **Token-based authentication** with Bearer tokens
- **Automatic token persistence** in localStorage
- **Route protection** via `ProtectedRoute` component
- **Login/logout functionality** with state management

### API Integration
- **Base URL**: Configurable via `import.meta.env.DEV`
- **Authentication headers**: Automatic Bearer token injection
- **Error handling**: Consistent error handling across API calls

## Assessment System

### Question Structure
```javascript
{
    id: number,
    type: 'multiple-choice' | 'image-choice',
    prompt: string,
    options: Array<{id: string, text: string, label?: string}>,
    correctId: string,
    skill: string  // letter_recognition, phonics, rhyming, grammar, reading_fluency
}
```

### Assessment Flow
1. **Question Display**: Sequential question presentation
2. **Answer Collection**: State management for user responses
3. **Progress Tracking**: Visual progress bar
4. **Results Calculation**: Scoring and level determination
5. **Celebration**: Animated feedback and results display

### Learning Level System
- **Beginner**: Focus on letter recognition and basic phonics
- **Advanced Reader**: Focus on reading fluency and more complex skills

## Current Limitations

### Development Status
- **Backend**: Python/SQLite backend in development
- **Database**: Local database file exists (`database.db`)
- **Testing**: No test framework currently configured
- **TypeScript**: Not implemented (pure JavaScript)
- **Global State**: No Redux or Zustand implementation

### Functional Limitations
- **Dashboard**: Currently placeholder/underdeveloped
- **Real-time Updates**: No live data synchronization
- **Offline Support**: Limited offline functionality
- **Mobile Optimization**: Basic responsive design, needs improvement

## Code Quality Standards

### ESLint Configuration
- **React Hooks**: Rules for hook usage
- **React Refresh**: Optimization for Fast Refresh
- **Unused Variables**: Configured to ignore uppercase constants
- **ECMAScript**: Latest features enabled

### Coding Conventions
- **Inline Styles**: Extensive use of inline styles (no CSS modules)
- **Component Organization**: Functional components with hooks
- **File Naming**: PascalCase for components, camelCase for utilities
- **Consistent Spacing**: 2-space indentation, consistent line breaks

## Environment Configuration

### Development
- **Development Server**: Vite with hot reload
- **API Endpoint**: `http://localhost:8000` (when DEV=true)
- **Build Tool**: Vite for optimized production builds

### Production
- **Static Files**: Optimized and minified
- **API Integration**: Configurable production endpoints
- **Local Storage**: Persistent data across sessions

## Development Workflow

### Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Backend API running on port 8000
4. Frontend available at `http://localhost:5173`

### Adding New Features
1. **Pages**: Add to `src/pages/` and configure routes in `App.jsx`
2. **Components**: Create reusable components in `src/components/`
3. **Data**: Static data goes in `src/data/`
4. **API**: Add service functions to `src/services/api.js`

### Code Quality
- Run `npm run lint` before commits
- Follow ESLint rules for JavaScript/React
- Use consistent naming conventions
- Test with actual devices for mobile responsiveness

## Future Development

### Planned Features
- **Real-time Progress Tracking**: WebSocket integration
- **Advanced Analytics**: Detailed progress reports
- **Parent Dashboard**: Monitoring child's progress
- **Content Management**: Dynamic question loading
- **Multi-child Support**: Family account management

### Technical Improvements
- **TypeScript Migration**: Type safety and better IDE support
- **State Management**: Redux or Zustand for complex state
- **Testing**: Jest + React Testing Library
- **CI/CD**: Automated deployment and testing
- **Performance**: Code splitting and lazy loading

---

*BrightBook v1.0 | Educational Assessment Application | React + Vite Stack*
