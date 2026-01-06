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

- 🔐 **Complete authentication system** with Better Auth (stateless)
- 👤 **User management** with Supabase Auth
- 💳 **Payment processing** with Stripe (subscriptions and trials)
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

- 🐘 [Supabase](https://supabase.com/) - Open source Firebase alternative with PostgreSQL (Auth only)
- 📧 [Resend](https://resend.com/) - Email API for transactional emails
- 💳 [Stripe](https://stripe.com/) - Payment processing and subscription management

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

Copy the `env.example.txt` file to `.env.local`:

```bash
cp env.example.txt .env.local
```

Or create `.env.local` manually using `env.example.txt` as a reference.

Then update the values in `.env.local` with your actual credentials:

```env
# Better Auth (Required)
BETTER_AUTH_SECRET=your_secret_key_min_32_characters
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (Required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Supabase Auth (Required)
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe (Required)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_DEFAULT_PRICE_ID=price_your_default_price_id

# Resend (Required)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# API URL (Required)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important:**

- Generate `BETTER_AUTH_SECRET` with: `openssl rand -base64 32`
- Get Supabase credentials from: Supabase Dashboard > Settings > API
- Get Stripe credentials from: Stripe Dashboard > Developers > API keys
- Get `STRIPE_DEFAULT_PRICE_ID` from: Stripe Dashboard > Products > Your Product > Pricing
- Get Resend API key from: Resend Dashboard > API Keys

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

The project uses a custom i18n strategy based on JSON dictionaries and route segments for complete multi-language support.

### Features

- **Route-based localization** - URLs include locale (`/en/dashboard`, `/pt/dashboard`)
- **JSON dictionaries** - Translation files organized by namespace in `src/locales/`
- **Zod i18n integration** - Form validation messages automatically translated
- **Cookie persistence** - Language preference stored in `NEXT_LOCALE` cookie
- **Type-safe translations** - Full TypeScript support for all dictionaries
- **Lazy loading** - Translations loaded only when needed

### Supported Languages

- English (en)
- Portuguese (pt)

### Usage

**Server Components:**

```typescript
const dict = await getDictionary(locale);
return <h1>{dict.dashboard.title}</h1>;
```

**Client Components:**

```typescript
<AuthForm translation={dict} mode="sign-in" />
```

See [ADR-007: Internationalization Strategy](./docs/adr/007-i18n-strategy.md) for detailed implementation.

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

- ✅ **User Authentication** - Complete auth system with magic links and Google OAuth
- ✅ **Team Management** - Multi-user support with role-based access control
- ✅ **Dashboard** - Analytics dashboard with charts and metrics
- ✅ **Internationalization** - Multi-language support (PT/EN)
- ✅ **Theme System** - Light/dark mode with system preference detection
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Component Library** - Pre-built, accessible UI components following shadcn/ui patterns

### Infrastructure

- ✅ **Supabase Auth Integration** - User management and authentication via Supabase Auth
- ✅ **Stripe Integration** - Payment processing, subscriptions, and trial management
- ✅ **Email Service** - Transactional emails with Resend (magic links, notifications)
- ✅ **Environment Validation** - Type-safe environment variables with Zod
- ✅ **API Routes** - Serverless API endpoints
- ✅ **Route Protection** - Proxy-based authentication (Next.js 16)

## 🔒 Authentication

- Robust authentication system with Better Auth
- Support for multiple authentication providers (magic links, Google OAuth)
- **Stateless session management** - Sessions stored in encrypted cookies (JWE)
- **Cookie cache** - 7-day session duration with automatic refresh
- **Automatic user sync** - Users are automatically synced to Supabase Auth and Stripe
- **Trial subscriptions** - New users automatically get a 14-day free trial
- Secure session management with encrypted cookies
- Route protection for authenticated areas
- Proxy-based authentication flow (Next.js 16)
- Magic link authentication (passwordless)
- No database required for Better Auth (stateless mode)

### Authentication Flow

When a user signs in (via magic link or OAuth), the following happens automatically:

1. **Better Auth** - Creates/validates session in encrypted cookies
2. **Supabase Auth** - User is synced to `auth.users` table
3. **Stripe** - Customer is created/updated in Stripe
4. **Subscription** - Trial subscription is created (14 days) if it doesn't exist
5. **Metadata** - User metadata is updated with Stripe customer ID and subscription info

All of this happens automatically via the `after` hook in Better Auth configuration.

## 💾 Database & Backend

### Supabase Auth

- **User Management** - User accounts stored in Supabase Auth (`auth.users`)
- **User Metadata** - Payment and subscription data stored in `user_metadata`
- **Service Role Key** - Required for server-side user management operations
- **Type-safe API** - Full TypeScript support for Supabase operations

### Stripe Integration

- **Customer Management** - Automatic customer creation/update on user sign-up
- **Subscription Management** - Trial subscriptions with automatic creation
- **Payment Processing** - Ready for payment method collection and billing
- **Webhook Support** - Webhook handlers for subscription events

### Supabase Scripts

```bash
# Link to your Supabase project
pnpm db:link

# Create a new migration (for Supabase database schema changes)
pnpm db:migration:new

# Push migrations to database
pnpm db:push
```

**Note:** These scripts are for Supabase database migrations (if you need custom tables). Better Auth runs in stateless mode and doesn't require database migrations.

## 📦 Project Structure

```
/
├── proxy.ts         # Proxy for authentication and i18n (Next.js 16)
└── src/
    ├── app/              # Next.js pages and layouts
    │   ├── api/          # API routes
    │   │   ├── auth/     # Better Auth API routes
    │   │   ├── webhooks/ # Webhook handlers (Stripe)
    │   │   └── ...       # Other API routes
    │   └── [lang]/       # Internationalized routes
    ├── components/       # Reusable components
    │   ├── container/    # Layout components and forms
    │   ├── features/     # Feature components
    │   ├── providers/   # Context providers
    │   └── ui/          # UI components (Shadcn/UI)
    ├── hooks/           # Custom hooks
    ├── lib/             # Utilities and configurations
    │   ├── auth/        # Better Auth configuration
    │   └── ...          # Other utilities
    ├── locales/         # Translation files
    ├── models/          # TypeScript models
    │   ├── constants/   # Constants
    │   ├── emails/      # Email templates
    │   ├── enums/       # Enums
    │   ├── interfaces/  # TypeScript interfaces
    │   │   ├── components/  # Component interfaces
    │   │   └── services/    # Service interfaces
    │   ├── mocks/       # Mock data
    │   ├── schemas/     # Zod schemas
    │   └── types/       # TypeScript types
    ├── services/        # Services and APIs
    │   ├── auth/        # Authentication services (Supabase sync)
    │   ├── payment/     # Payment services (Stripe)
    │   └── ...          # Other services
    └── server/          # Server-side utilities
        ├── actions.ts    # Server actions
        ├── resend.ts    # Resend email client
        ├── stripe.ts    # Stripe client
        └── supabase.ts  # Supabase clients (anon + admin)
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

### Development

- `pnpm dev` - Starts the development server
- `pnpm build` - Creates production build
- `pnpm start` - Starts the production server

### Code Quality

- `pnpm lint` - Runs ESLint and fixes issues
- `pnpm format` - Formats code with Prettier

### Testing

- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests with UI
- `pnpm test:e2e:headed` - Run E2E tests in headed mode
- `pnpm test:e2e:debug` - Run E2E tests in debug mode
- `pnpm test:e2e:report` - Show test report

### Database

- `pnpm db:link` - Link to Supabase project
- `pnpm db:migration:new` - Create new migration
- `pnpm db:push` - Push migrations to database

### Authentication

- `pnpm auth:generate` - Generate Better Auth types

### Setup

- `pnpm prepare` - Sets up git hooks (Husky)

## 📝 Code Conventions & Patterns

### Code Style

- **ESLint** - Code linting with Next.js config
- **Prettier** - Automatic code formatting
- **TypeScript** - Full type safety across the codebase
- **Conventional Commits** - Standardized commit messages

### State Management

The project uses a hybrid state management approach:

| State Type       | Solution                     | Usage                    | Persistence     |
| ---------------- | ---------------------------- | ------------------------ | --------------- |
| Server State     | React Query (TanStack Query) | API calls, subscriptions | In-memory cache |
| UI State         | Zustand                      | Modals, loading states   | No              |
| User Preferences | Zustand + persist            | Locale, sidebar state    | localStorage    |
| Form State       | React Hook Form              | Form inputs              | No              |
| Theme            | next-themes                  | Light/dark mode          | localStorage    |
| Session          | Better Auth                  | Authentication           | Cookie          |

**Example:**

```typescript
// UI Store
const { isOpen, open, close } = useCommandDialog();

// User Preferences (persisted)
const { locale, setLocale } = useLocale();
```

See [ADR-008: State Management](./docs/adr/008-state-management.md) for details.

### Component Patterns

1. **Shadcn/UI Components** - Located in `src/components/ui/`
2. **Custom Components** - Located in `src/components/containers/` and `src/components/features/`
3. **Component Interfaces** - Defined in `src/models/interfaces/components/`
4. **Type Safety** - All components have TypeScript interfaces

### Caching & Rate Limiting

- **Upstash Redis** - Distributed cache and rate limiting
- **Sliding Window Algorithm** - For rate limiting
- **Fail Open Strategy** - Application continues if Redis fails
- **Rate Limit Configurations**:
  - STRICT: 10 req/min (Resend API)
  - MODERATE: 30 req/min (Checkout, Subscription)
  - RELAXED: 100 req/min (Webhooks)

See [ADR-004: Caching & Rate Limiting](./docs/adr/004-caching-upstash-redis.md) for details.

### Monitoring & Error Tracking

- **Sentry** - Error tracking and performance monitoring
- **Session Replay** - For debugging user sessions
- **Core Web Vitals** - Performance metrics (LCP, FID, CLS, INP, TTFB)
- **Source Maps** - Readable stack traces in production
- **Privacy-First** - Text masking and media blocking in replays

See [ADR-006: Monitoring](./docs/adr/006-monitoring-sentry.md) for details.

### Styling Patterns

- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/UI** - Component library built on Radix UI
- **CSS Variables** - For theming (light/dark mode)
- **Class Variance Authority (CVA)** - Component variants
- **Responsive Design** - Mobile-first approach

See [ADR-005: Styling](./docs/adr/005-styling-tailwind-shadcn.md) for details.

## 🚀 Deployment

The application can be deployed to various platforms. For micro SaaS applications, we recommend:

### Vercel (Recommended for Frontend)

1. Connect your GitHub repository to Vercel
2. Configure environment variables (see `.env.example`)
3. Deploy with automatic preview deployments
4. Set up custom domain (optional)

### Supabase (Auth & Backend)

- Supabase Auth is used for user management
- Configure Supabase credentials in environment variables
- Set up Supabase project and get API keys from dashboard
- Optional: Set up database migrations if you need custom tables

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

```env
# Better Auth
BETTER_AUTH_SECRET=your_production_secret
BETTER_AUTH_URL=https://your-domain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_production_google_client_id
GOOGLE_CLIENT_SECRET=your_production_google_client_secret

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_production_stripe_secret_key
STRIPE_DEFAULT_PRICE_ID=price_your_production_price_id

# Resend
RESEND_API_KEY=re_your_production_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# API
NEXT_PUBLIC_API_URL=https://your-domain.com
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

## 🧪 Testing

The project includes E2E testing infrastructure with Playwright.

### E2E Tests

- **Playwright** - End-to-end testing framework
- **Test Coverage** - Authentication and checkout flows
- **Global Setup** - Test environment configuration
- **Test Reports** - HTML reports with screenshots

### Running Tests

```bash
pnpm test:e2e        # Run E2E tests
pnpm test:e2e:ui    # Run E2E tests with UI
pnpm test:e2e:headed # Run E2E tests in headed mode
pnpm test:e2e:debug # Run E2E tests in debug mode
pnpm test:e2e:report # Show test report
```

### Test Structure

```
e2e/
├── auth.spec.ts          # Authentication tests
├── checkout.spec.ts       # Payment flow tests
└── global.setup.ts        # Test environment setup
```

### Future Testing Plans

- **Unit Tests** - Vitest for utility functions and business logic
- **Integration Tests** - API route testing with mocked services
- **Component Tests** - React Testing Library for UI components

## 📚 Architecture Decision Records (ADRs)

This project documents all major architectural decisions in ADR format. See [docs/adr/](./docs/adr/) for complete documentation.

### Key Decisions

| ADR                                                 | Decision                        | Status      |
| --------------------------------------------------- | ------------------------------- | ----------- |
| [001](./docs/adr/001-authentication-better-auth.md) | Authentication with Better Auth | ✅ Accepted |
| [002](./docs/adr/002-database-supabase.md)          | Supabase as Database            | ✅ Accepted |
| [003](./docs/adr/003-payments-stripe.md)            | Stripe for Payments             | ✅ Accepted |
| [004](./docs/adr/004-caching-upstash-redis.md)      | Upstash Redis for Cache         | ✅ Accepted |
| [005](./docs/adr/005-styling-tailwind-shadcn.md)    | Tailwind CSS + shadcn/ui        | ✅ Accepted |
| [006](./docs/adr/006-monitoring-sentry.md)          | Sentry for Monitoring           | ✅ Accepted |
| [007](./docs/adr/007-i18n-strategy.md)              | Internationalization Strategy   | ✅ Accepted |
| [008](./docs/adr/008-state-management.md)           | State Management                | ✅ Accepted |

See [ADR README](./docs/adr/README.md) for more information.

## 📡 API Documentation

Complete API documentation is available in [docs/API.md](./docs/API.md).

### Key Endpoints

- `/api/auth/[...all]` - Better Auth endpoints
- `/api/checkout` - Stripe checkout session
- `/api/subscription` - User subscription data
- `/api/resend` - Transactional emails
- `/api/webhooks/stripe` - Stripe webhook handler
- `/api/health` - Health check

All endpoints include:

- Rate limiting
- Input validation
- Error handling
- Type-safe responses

## 🔐 Security Features

- **Encrypted Sessions** - JWE cookies for stateless auth
- **Input Validation** - Zod schemas for all inputs
- **HTML Sanitization** - XSS protection
- **Rate Limiting** - Redis-based sliding window
- **Security Headers** - CSP, HSTS, X-Frame-Options
- **Environment Validation** - Type-safe env variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the micro SaaS community**
