# 🚀 Template - Frontend

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 How to Run](#-how-to-run)
- [🌐 Internationalization](#-internationalization)
- [🎨 UI/UX](#-uiux)
- [🔒 Authentication](#-authentication)
- [📦 Project Structure](#-project-structure)
- [🛠️ Available Scripts](#-available-scripts)
- [📝 Code Conventions](#-code-conventions)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🐛 Bug Reports](#-bug-reports)
- [📄 License](#-license)

## 💡 About the Project

Template is a modern web application developed with Next.js, designed to be a starting point for your next project. The project uses the latest technologies from the React and Next.js ecosystem to provide an exceptional development experience. This template includes features like authentication, internationalization, dark mode, and a component library, making it perfect for building modern web applications.

## 🛠️ Technologies Used

### Core

- ⚡ [Next.js 15](https://nextjs.org/) - React framework with advanced features
- ⚛️ [React 19](https://react.dev/) - JavaScript library for building interfaces
- 📘 [TypeScript](https://www.typescriptlang.org/) - JavaScript superset with static typing

### UI/UX

- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- 🎭 [Radix UI](https://www.radix-ui.com/) - Accessible primitive components
- 🎪 [Shadcn/UI](https://ui.shadcn.com/) - High-quality UI components built with Radix UI and Tailwind CSS
- 🌓 [next-themes](https://github.com/pacocoursey/next-themes) - Light/dark theme support
- ✨ [tw-animate-css](https://github.com/atomiks/tailwindcss-animate) - CSS animations
- 🔔 [Sonner](https://sonner.emilkowal.ski/) - Toast notification system

### Forms and Validation

- 📝 [React Hook Form](https://react-hook-form.com/) - Form management
- ✅ [Zod](https://zod.dev/) - Schema validation
- 🔄 [@hookform/resolvers](https://react-hook-form.com/api) - Validator integration

### Authentication and Security

- 🔐 [NextAuth.js](https://next-auth.js.org/) - Complete authentication
- 🍪 [js-cookie](https://github.com/js-cookie/js-cookie) - Cookie management

### Internationalization

- 🌍 [i18next](https://www.i18next.com/) - Internationalization framework
- 🗺️ [zod-i18n-map](https://github.com/aiji42/zod-i18n-map) - Internationalized validation

### Development

- 📦 [pnpm](https://pnpm.io/) - Fast and efficient package manager
- 🐶 [Husky](https://typicode.github.io/husky/) - Git hooks
- 📏 [ESLint](https://eslint.org/) - Code linting
- 💅 [Prettier](https://prettier.io/) - Code formatting
- 🔍 [commitlint](https://commitlint.js.org/) - Commit message linting

## 🚀 How to Run

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then update the values in `.env.local` with your actual credentials:

```env
# Better Auth (Required)
BETTER_AUTH_SECRET=your_secret_key_min_32_characters
BETTER_AUTH_URL=http://localhost:3000

# Supabase Database (Required)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# API URL (Required)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Supabase API (Optional - only if using Storage/Realtime)
# NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:**

- Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
- Get `DATABASE_URL` from: Supabase Dashboard > Settings > Database > Connection string
- Replace `[password]` with your Supabase database password

4. Run the development server

```bash
pnpm dev
```

5. For production build

```bash
pnpm build
```

6. To start in production

```bash
pnpm start
```

## 🌐 Internationalization

The project uses i18next for complete multi-language support. Translations are managed through JSON files located in `src/locales/`.

## 🎨 UI/UX

- Custom design system based on Tailwind CSS and Shadcn/UI
- Reusable and accessible components from Shadcn/UI library
- Light/dark theme support with next-themes
- Smooth and responsive animations with tw-animate-css
- Responsive layout for all devices
- Consistent design language across the application
- High-quality, accessible UI components
- Modern and clean interface design

## 🔒 Authentication

- Robust authentication system with NextAuth.js
- Support for multiple authentication providers
- Secure session management
- Route protection
- Middleware-based authentication flow

## 📦 Project Structure

```
src/
├── app/              # Next.js pages and layouts
├── components/       # Reusable components
├── hooks/           # Custom hooks
├── lib/             # Utilities and configurations
├── locales/         # Translation files
├── services/        # Services and APIs
├── styles/          # Global styles
├── types/           # TypeScript type definitions
└── middleware.ts    # Authentication and i18n middleware
```

### Middleware (`src/middleware.ts`)

The middleware handles:

- 🔒 Route protection for authenticated routes
- 🔄 Authentication redirects
- 🌐 Internationalization routing
- 🎯 Public route access

Key features:

- Protects `/dashboard/*` routes
- Redirects authenticated users from auth pages
- Redirects unauthenticated users to sign-in
- Handles locale detection and routing
- Supports multiple languages (pt, en)

### 🔧 Component Interfaces

For custom components that don't depend on Shadcn/UI updates, it's necessary to create specific interfaces:

```
src/
├── models/
│   ├── interfaces/
│   │   ├── component-name.ts  # Interface for the component
│   │   └── ...
│   └── ...
```

Example of interface structure:

```typescript
// src/models/interfaces/component-name.ts
import { ReactNode } from "react";

export interface ComponentNameProps {
  children?: ReactNode;
  className?: string;
  // Other component-specific props
}
```

Benefits of this approach:

- Clear separation between Shadcn/UI components and custom components
- Better maintainability and scalability
- Facilitates documentation and code understanding
- Allows independent evolution of custom components

## 🛠️ Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Creates production build
- `pnpm start` - Starts the production server
- `pnpm lint` - Runs the linter
- `pnpm format` - Formats code with Prettier
- `pnpm prepare` - Sets up git hooks

## 📝 Code Conventions

- ESLint for linting
- Prettier for formatting
- Conventional Commits for commit messages
- Husky for git hooks
- TypeScript for static typing

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic preview deployments

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Guidelines

- Follow the conventional commits format
- Update documentation as needed
- Ensure all checks pass

## 🐛 Bug Reports

Please use the GitHub issue tracker to report bugs. Include:

- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
