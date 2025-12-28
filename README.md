# 🚀 SaaS Seed - Micro SaaS Starter

> ⚠️ **Status:** This project is currently in active development. Features and APIs may change.

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Technologies Used](#️-technologies-used)
- [🚀 How to Run](#-how-to-run)
- [🌐 Internationalization](#-internationalization)
- [🎨 UI/UX](#-uiux)
- [🔒 Authentication](#-authentication)
- [💾 Database & Backend](#-database--backend)
- [📦 Project Structure](#-project-structure)
- [🛠️ Available Scripts](#-available-scripts)
- [📝 Code Conventions](#-code-conventions)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [🐛 Bug Reports](#-bug-reports)
- [📄 License](#-license)

## 💡 About the Project

**SaaS Seed** is a modern, production-ready starter template designed specifically for building **micro SaaS applications**. Built on top of **Next.js 16** and **Supabase**, this starter provides all the essential features and infrastructure that a micro SaaS needs to get up and running quickly.

This project is currently in **active development** and includes:

- 🔐 **Complete authentication system** with Better Auth
- 💾 **Database integration** with Supabase (PostgreSQL)
- 🌍 **Internationalization** (i18n) support
- 🎨 **Modern UI/UX** with Shadcn/UI components
- 📊 **Dashboard** with analytics and data visualization
- 👥 **Team management** features
- 🔔 **Notifications** and toast system
- 🌓 **Dark mode** support
- 📱 **Fully responsive** design
- ⚡ **Type-safe** with TypeScript
- 🎯 **Production-ready** architecture

Perfect for entrepreneurs and developers who want to focus on building their product features instead of setting up infrastructure from scratch.

## 🛠️ Technologies Used

### Core

- ⚡ [Next.js 16](https://nextjs.org/) - React framework with advanced features
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

- 🔐 [Better Auth](https://www.better-auth.com/) - Complete authentication solution
- 🍪 [js-cookie](https://github.com/js-cookie/js-cookie) - Cookie management

### Database & Backend

- 🐘 [Supabase](https://supabase.com/) - Open source Firebase alternative with PostgreSQL
- 🗄️ [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for database management
- 📧 [Resend](https://resend.com/) - Email API for transactional emails
- 🔌 [Postgres.js](https://github.com/porsager/postgres) - Fast PostgreSQL client

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

## ✨ Features

### Core Micro SaaS Features

- ✅ **User Authentication** - Complete auth system with email/password and magic links
- ✅ **Team Management** - Multi-user support with role-based access control
- ✅ **Dashboard** - Analytics dashboard with charts and metrics
- ✅ **Internationalization** - Multi-language support (PT/EN)
- ✅ **Theme System** - Light/dark mode with system preference detection
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Component Library** - Pre-built, accessible UI components following shadcn/ui patterns

### Infrastructure

- ✅ **Supabase Integration** - PostgreSQL database with real-time capabilities
- ✅ **Email Service** - Transactional emails with Resend
- ✅ **Environment Validation** - Type-safe environment variables with Zod
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **API Routes** - Serverless API endpoints
- ✅ **Route Protection** - Proxy-based authentication (Next.js 16)

## 🔒 Authentication

- Robust authentication system with Better Auth
- Support for multiple authentication providers (email/password, magic links, Google OAuth)
- **Stateless session management** - Sessions stored in encrypted cookies (JWE)
- **Cookie cache** - 7-day session duration with automatic refresh
- Secure session management with encrypted cookies
- Route protection for authenticated areas
- Proxy-based authentication flow (Next.js 16)
- Password reset and email verification flows
- No database required for authentication (stateless mode)

## 💾 Database & Backend

- **Supabase PostgreSQL** - Production-ready database
- **Drizzle ORM** - Type-safe database queries and migrations
- **Database Migrations** - Version-controlled schema management
- **Type-safe API** - Full TypeScript support for database operations
- **Real-time Capabilities** - Supabase real-time subscriptions (optional)

### Database Scripts

```bash
# Link to your Supabase project
pnpm db:link

# Create a new migration
pnpm db:migration:new

# Push migrations to database
pnpm db:push
```

## 📦 Project Structure

```
/
├── proxy.ts         # Proxy for authentication and i18n (Next.js 16)
└── src/
    ├── app/              # Next.js pages and layouts
    ├── components/       # Reusable components
    │   ├── container/   # Layout components and forms
    │   ├── features/     # Feature components
    │   ├── providers/    # Context providers
    │   └── ui/          # UI components (Shadcn/UI)
    ├── hooks/           # Custom hooks
    ├── lib/             # Utilities and configurations
    ├── locales/         # Translation files
    ├── models/          # TypeScript models
    │   ├── constants/   # Constants
    │   ├── enums/       # Enums
    │   ├── interfaces/  # TypeScript interfaces
    │   │   ├── components/  # Component interfaces
    │   │   └── services/    # Service interfaces
    │   ├── mocks/       # Mock data
    │   ├── schemas/     # Zod schemas
    │   └── types/       # TypeScript types
    ├── services/        # Services and APIs
    └── server/          # Server-side utilities
```

### Proxy (`proxy.ts`)

The proxy handles (Next.js 16):

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
- Runs on Node.js runtime

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

The application can be deployed to various platforms. For micro SaaS applications, we recommend:

### Vercel (Recommended for Frontend)

1. Connect your GitHub repository to Vercel
2. Configure environment variables (see `.env.example`)
3. Deploy with automatic preview deployments
4. Set up custom domain (optional)

### Supabase (Database & Backend)

- Database is already hosted on Supabase
- Configure connection string in environment variables
- Set up database migrations in Supabase dashboard

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

```env
# Better Auth
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://your-domain.com

# Supabase Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# API
NEXT_PUBLIC_API_URL=https://your-domain.com

# Optional: Supabase Client (if using Storage/Realtime)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

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

## ⚠️ Development Status

This project is **actively in development**. While it provides a solid foundation for building micro SaaS applications, please note:

- 🔄 Features may be added, removed, or changed
- 🐛 Some features may have bugs or incomplete implementations
- 📚 Documentation may be incomplete
- 🔧 Breaking changes may occur in future versions

We recommend:

- ⭐ Star the repository to stay updated
- 🐛 Report bugs and issues
- 💡 Suggest features and improvements
- 🤝 Contribute to make it better

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the micro SaaS community**
