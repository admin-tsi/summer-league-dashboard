# Summer League Dashboard

## Overview
The Summer League Dashboard is a comprehensive web application for managing basketball summer leagues. It offers features for team management, scheduling, real-time statistics tracking, and administrative tools.

## Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Adding a New Dashboard](#adding-a-new-dashboard)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- Team and Player Management
- Game Scheduling and Event Planning
- Real-Time Statistics Tracking
- User Role Management
- Reporting and Analytics
- Security and Compliance Measures

## Technology Stack
- **Frontend**: React.js, Next.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Vercel (Frontend), Railway (Backend)
- **Tools**: Git, ESLint, Prettier

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- pnpm
- Git

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/tailoringsportsinvestments/summer-league-dashboard.git
   ```
2. Navigate to the project directory:
   ```
   cd summer-league-dashboard
   ```
3. Install dependencies:
   ```
   pnpm install
   ```
4. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_API_URL=<your_api_url>
   MONGODB_URI=<your_mongodb_connection_string>
   ```
5. Start the development server:
   ```
   pnpm run dev
   ```

## Usage
After setup, use the dashboard to:
- Manage teams and players
- Create and update game schedules
- Track real-time game statistics
- Generate reports on league activities
- Manage user roles and access

## Project Structure
```
summer-league-dashboard/
├── app/                  # Next.js app directory
│   ├── (admin)/          # Admin-related pages
│   ├── (auth)/           # Authentication pages
│   └── api/              # API routes
├── components/           # Reusable React components
├── lib/                  # Utility functions and API calls
├── public/               # Static assets
├── styles/               # Global styles and Tailwind config
└── [Configuration Files] # next.config.js, package.json, etc.
```

## Adding a New Dashboard
1. Create a new page in `app/(admin)/`.
2. Update `lib/menu-list.ts` to include the new dashboard:
   ```typescript
   {
     href: "/new-dashboard",
     label: "New Dashboard",
     icon: YourChosenIcon,
     roles: ["admin", "manager"],
   }
   ```;
3. Implement role-based access control in the component.

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
Jordan Vitou - [Website](https://example.com) - [LinkedIn](https://linkedin.com/in/jordanvitou) - [GitHub](https://github.com/jordanvitou)

Project Link: [https://github.com/tailoringsportsinvestments/summer-league-dashboard](https://github.com/tailoringsportsinvestments/summer-league-dashboard)