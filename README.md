# SiteMint 🚀

**A no-code website builder for small business owners and non-technical users.**

Create professional, responsive websites using a visual drag-and-drop editor — no coding required.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase)

---

## ✨ Features

- **Drag & Drop Builder** — 12 section types: Navbar, Hero, Features, About, Services, Gallery, Testimonials, FAQ, Contact, Footer, Spacer, Divider
- **8 Professional Templates** — Restaurant, Coffee Shop, Salon, Portfolio, Freelancer, Agency, Small Business, Landing Page
- **Theme Editor** — Custom colors, fonts, button styles, dark mode
- **Responsive Preview** — Desktop, tablet, and mobile viewports
- **Authentication** — Sign up, sign in, password reset (Supabase or local fallback)
- **Media Library** — Upload and reuse images
- **Contact Forms** — Capture and store submissions
- **Page Management** — Add, rename, delete pages
- **SEO Tools** — Meta tags, sitemap.xml, robots.txt
- **Auto-Save** — Changes saved every 15 seconds
- **One-Click Publishing** — Draft → Published workflow with unpublish/republish

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) patterns with [Radix UI](https://www.radix-ui.com/) |
| Backend / Auth | [Supabase](https://supabase.com/) (with local storage fallback) |
| Drag & Drop | [dnd-kit](https://dndkit.com/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Forms | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| Icons | [Lucide React](https://lucide.dev/) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sitemint.git
cd sitemint

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Then edit .env.local with your Supabase credentials (optional)
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## 🔧 Supabase Setup

SiteMint works out of the box with **local storage auth** — no backend required.

To enable real authentication and data persistence:

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your `Project URL` and `anon public key`
4. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The app automatically detects real Supabase credentials and switches from local fallback to the real backend.

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/          # Login, Register, Forgot Password
│   ├── builder/       # Visual drag-and-drop editor
│   ├── dashboard/     # Project management dashboard
│   ├── media/         # Media library
│   ├── settings/      # User settings
│   └── page.tsx       # Landing page
├── components/
│   ├── builder/       # ThemeEditor, ContactForm
│   └── ui/            # Button, Card, Dialog, Input, Label, Toast
├── hooks/             # useAuth, use-toast
├── lib/               # supabase client, local-auth, templates, utils, uuid
└── types/             # TypeScript types and Zod schemas
```

## 📄 License

MIT
