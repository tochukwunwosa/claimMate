# ClaimMate SaaS Starter

> AI-powered Insurance claim drafting platform for independent insurance agents.

Built with:
- ✅ Next.js 14 (App Router)
- ✅ Supabase Auth, Database & Storage
- ✅ OpenRouter for AI drafting
- ✅ `react-pdf` and `docx` for export
- ✅ Tailwind CSS + ShadCN UI

---

## 🔧 Setup Instructions

### 1. Clone the Repo
```bash
git clone https://github.com/tochukwunwosa/claimmate.git
cd claimmate
```

### 2. Install Dependencies
```bash
pnpm install # or npm / yarn
```

### 3. Create Supabase Project
- Go to [https://supabase.com/](https://supabase.com/) and create a new project
- Copy your project URL and Anon/Public API Key
- Enable **Email Auth** in Authentication settings
- Create a storage bucket called `exports`

### 4. Configure OpenRouter
- Go to [https://openrouter.ai](https://openrouter.ai) and create a free account
- Generate your API key from dashboard

### 5. Set Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

OPENROUTER_API_KEY=your-openrouter-key
```

### 6. Run Locally
```bash
pnpm dev
```

Go to [http://localhost:3000](http://localhost:3000) 🎉

---

## ✨ Features in This Starter

### ✅ Authentication
- Email + Password login with Supabase
- Magic Link enabled
- Email verification built-in

### ✍️ AI Drafting
- Prompt Claude/GPT to draft claims
- Edit drafts before export

### 📄 Export
- PDF: via `react-pdf`
- DOCX: via `docx` package
- Upload final docs to Supabase Storage

### 🧩 UI/UX
- TailwindCSS
- ShadCN components (Card, Button, Form, Dialog, etc)

---

## 💡 Roadmap
- [ ] Dashboard filtering
- [ ] Team collaboration
- [ ] AI feedback editor
- [ ] Templates marketplace

---

## 📜 License
MIT License.

---

Need help? DM me on Twitter @devtoo or file an issue.
