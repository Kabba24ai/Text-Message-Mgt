# Message Management System - Deployment Instructions

## Overview
This Message Management system was built using Claude Code CLI (standard Vite + React + TypeScript). It can be deployed in multiple ways.

---

## Option 1: Deploy to Bolt.new (Recommended for Quick Setup)

### Method A: Import via GitHub

1. **Push your code to GitHub** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Message Management System"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Open Bolt.new**
   - Go to https://bolt.new
   - Click "Import from GitHub"
   - Paste your repository URL
   - Bolt will automatically detect it's a Vite project and set it up

3. **Verify Environment Variables**
   - Bolt should detect the `.env` file
   - Verify these values are present:
     ```
     VITE_SUPABASE_URL=https://tpgenpsfhlochdccpbje.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs
     ```

4. **Bolt will automatically:**
   - Run `npm install`
   - Start the dev server
   - Display the app in the preview pane

### Method B: Manual File Copy to Bolt.new

If you don't want to use GitHub:

1. **Go to https://bolt.new**

2. **Start a new project**
   - Click "New Project"
   - Choose "React + TypeScript + Vite"

3. **Copy your files manually**
   - Use Bolt's file browser to recreate the structure
   - Copy/paste contents from each file
   - Start with these critical files first:
     - `.env`
     - `package.json`
     - `src/main.tsx`
     - `src/App.tsx`
     - `src/lib/supabase.ts`
     - All component files in `src/components/`
     - `tailwind.config.js`
     - `vite.config.ts`

4. **Install dependencies**
   - Bolt should auto-install when it detects package.json changes
   - Or manually trigger: Click terminal → `npm install`

5. **Start dev server**
   - Click "Run" or type `npm run dev` in terminal

---

## Option 2: Run Locally (Standard Development)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (optional)

### Steps

1. **Clone or Download the Repository**
   ```bash
   git clone YOUR_REPO_URL
   cd message-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Environment Variables**
   - Check that `.env` file exists in root directory
   - Verify contents:
     ```
     VITE_SUPABASE_URL=https://tpgenpsfhlochdccpbje.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs
     ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:5173`
   - You should see the Message Management interface

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type checking
npm run typecheck
```

---

## Option 3: Deploy to Production

### Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Deploy to Netlify

1. **Install Netlify CLI** (optional)
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the project**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables in Netlify Dashboard**
   - Go to Site Settings → Environment Variables
   - Add the same variables as above

### Deploy to Other Platforms

The build output in `/dist` folder can be deployed to:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- Any static hosting service

**Build command:** `npm run build`
**Output directory:** `dist`

---

## Troubleshooting

### "No output" or blank screen

**Problem:** App loads but shows blank screen or console errors

**Solutions:**

1. **Check browser console** (F12 → Console tab)
   - Look for errors about missing environment variables
   - Look for Supabase connection errors

2. **Verify .env file**
   ```bash
   # Check if .env file exists
   ls -la .env

   # View contents
   cat .env
   ```

3. **Ensure environment variables are loaded**
   - For local development: Restart dev server after changing `.env`
   - For Bolt.new: Use Bolt's environment variable settings
   - For production: Set in hosting platform dashboard

4. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### "Module not found" errors

**Problem:** Import errors or missing dependencies

**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Database connection errors

**Problem:** Can't fetch messages from Supabase

**Solutions:**

1. **Verify Supabase credentials**
   - URL: `https://tpgenpsfhlochdccpbje.supabase.co`
   - Anon Key should match exactly

2. **Check Supabase database**
   - Go to https://supabase.com/dashboard
   - Navigate to your project
   - Check Table Editor → verify these tables exist:
     - `text_messages`
     - `email_messages`
     - `categories`
     - `email_categories`

3. **Check RLS policies**
   - Go to Authentication → Policies
   - Ensure anonymous access is enabled for development

### Port already in use

**Problem:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill process on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Or use a different port:
npm run dev -- --port 3000
```

---

## Project Structure

```
message-management-system/
├── src/
│   ├── components/
│   │   ├── BroadcastModal.tsx      # Send broadcast messages
│   │   ├── CategoriesTab.tsx       # Manage categories
│   │   ├── MessageModal.tsx        # Create/edit messages
│   │   └── MessageTable.tsx        # Display messages
│   ├── lib/
│   │   └── supabase.ts            # Supabase client & types
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── .env                            # Environment variables
├── package.json                    # Dependencies
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
└── tsconfig.json                   # TypeScript config
```

---

## Database Schema Reference

### text_messages
- `id` (uuid, primary key)
- `context_category` (text) - Category name
- `content_name` (text) - Message name
- `content` (text) - Message body
- `message_type` (text) - 'broadcast' or 'funnel_content'
- `created_date` (timestamp)
- `sent_date` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### email_messages
- `id` (uuid, primary key)
- `context_category` (text) - Category name
- `content_name` (text) - Email name
- `subject` (text) - Email subject
- `content` (text) - Email body (HTML)
- `message_type` (text) - 'email_broadcast' or 'email_funnel_content'
- `sent_date` (timestamp, nullable)
- `created_at` (timestamp)

### categories
- `id` (uuid, primary key)
- `name` (text) - Category name
- `created_at` (timestamp)

### email_categories
- `id` (uuid, primary key)
- `name` (text) - Email category name
- `created_at` (timestamp)

---

## Features

### Message Management
- ✅ Create, edit, delete SMS and email messages
- ✅ Four message types:
  - SMS Broadcast (one-time sends)
  - SMS Funnel Content (for automation)
  - Email Broadcast (one-time sends)
  - Email Funnel Content (for automation)
- ✅ Category organization
- ✅ Search and filter by category and content name
- ✅ Copy/duplicate messages
- ✅ Send broadcast messages
- ✅ Track sent date

### Category Management
- ✅ Create, edit, delete SMS categories
- ✅ Create, edit, delete email categories
- ✅ Separate management for each channel

---

## Next Steps

After getting the Message Management system running:

1. **Test the interface**
   - Create a few test messages
   - Try all four message types
   - Test filtering and search
   - Send a test broadcast

2. **Build the Sales Funnel Automation module**
   - Use the prompt provided earlier
   - This module will consume messages from this system

3. **Integration**
   - Funnel module will query `message_type = 'funnel_content'` and `'email_funnel_content'`
   - Broadcast functionality already built here

---

## Support

### Common Questions

**Q: Can I change the database?**
A: Yes, but you'll need to update the connection details in `.env` and ensure the same table structure exists.

**Q: How do I add more message types?**
A: Modify the TypeScript types in `src/lib/supabase.ts` and update the filter buttons in `App.tsx`.

**Q: Can I customize the styling?**
A: Yes, modify `tailwind.config.js` for theme changes and component files for specific styling.

**Q: How do I add authentication?**
A: This system uses anonymous access for development. For production, implement Supabase Auth and update RLS policies.

---

## Version Compatibility

- **Node.js:** 18.x or higher
- **React:** 18.3.1
- **TypeScript:** 5.5.3
- **Vite:** 5.4.2
- **Tailwind CSS:** 3.4.1
- **Supabase JS:** 2.57.4

Built with: Claude Code CLI (2024)
Compatible with: Bolt.new, StackBlitz, CodeSandbox, Local Development

---

## License

This project is for internal use. All rights reserved.
