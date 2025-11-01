# Quick Start Guide - Message Management System

## For Your Programmer (Immediate Steps)

### If Running Locally:

```bash
# 1. Navigate to project folder
cd /path/to/message-management-system

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open browser
# Go to: http://localhost:5173
```

**That's it!** The app should now be running.

---

## For Bolt.new Deployment:

### Option 1: Quick Copy-Paste Method

1. **Go to https://bolt.new**

2. **Tell Bolt to create the project:**

Paste this into Bolt's chat:

```
Create a Message Management System with React + TypeScript + Vite + Tailwind CSS + Supabase.

Use these exact Supabase credentials in .env:
VITE_SUPABASE_URL=https://tpgenpsfhlochdccpbje.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs

Install these dependencies:
- @supabase/supabase-js (version 2.57.4)
- lucide-react (version 0.344.0)
- react 18.3.1
- react-dom 18.3.1

The database tables already exist: text_messages, email_messages, categories, email_categories

Then I'll provide you the complete source code to copy.
```

3. **After Bolt creates the base project, copy these files one by one:**

**Critical files to copy (in this order):**

a. `src/lib/supabase.ts` - Database client
b. `src/App.tsx` - Main application
c. `src/components/MessageTable.tsx`
d. `src/components/MessageModal.tsx`
e. `src/components/CategoriesTab.tsx`
f. `src/components/BroadcastModal.tsx`
g. `tailwind.config.js` - Styling config
h. `vite.config.ts` - Build config

4. **Bolt will automatically install and run the app**

---

## Option 2: Import from GitHub

If your code is already on GitHub:

1. **Go to https://bolt.new**

2. **Click "Import from GitHub"**

3. **Paste your repository URL**

4. **Bolt automatically:**
   - Detects it's a Vite project
   - Installs dependencies
   - Starts dev server
   - Shows preview

---

## What Your Programmer Should See:

When working correctly, you'll see:

✅ **Header:** "Message Management" with icon
✅ **Two tabs:** Messages | Categories
✅ **Four filter buttons:** SMS Broadcast | SMS Funnel Content | Email Broadcast | Email Funnel Content
✅ **Action buttons:** Send Broadcast | Create New Message
✅ **Filters:** Category dropdown and search box
✅ **Message table:** Shows all messages with Edit/Copy/Delete/Send actions

---

## If You See a Blank Screen:

### Step 1: Check Browser Console
Press `F12` → Click "Console" tab

**Look for these errors:**

❌ **"Missing Supabase environment variables"**
- Solution: Check `.env` file exists and has correct values

❌ **"Failed to fetch"**
- Solution: Check internet connection and Supabase URL

❌ **"Cannot read property of undefined"**
- Solution: Database tables might not exist

### Step 2: Verify .env File

Create/check `.env` file in root directory:

```
VITE_SUPABASE_URL=https://tpgenpsfhlochdccpbje.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs
```

### Step 3: Restart Everything

```bash
# Stop the dev server (Ctrl+C)

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Restart
npm run dev
```

---

## File Checklist

Make sure these files exist:

```
✅ .env
✅ package.json
✅ vite.config.ts
✅ tailwind.config.js
✅ tsconfig.json
✅ index.html
✅ src/main.tsx
✅ src/App.tsx
✅ src/index.css
✅ src/lib/supabase.ts
✅ src/components/MessageTable.tsx
✅ src/components/MessageModal.tsx
✅ src/components/CategoriesTab.tsx
✅ src/components/BroadcastModal.tsx
```

---

## Testing the App

Once running, try these actions:

1. **Click "Create New Message"** → Modal should open
2. **Switch between filter tabs** → Table should update
3. **Click Categories tab** → Should show category management
4. **Use search/filter** → Should filter results

---

## Need Help?

**Error message in console?**
- Copy the full error
- Check DEPLOYMENT_INSTRUCTIONS.md for detailed troubleshooting

**App works but no data?**
- Database tables exist but are empty
- Click "Create New Message" to add test data

**Still stuck?**
- Share the exact error message
- Share what you see in browser console (F12)
- Confirm Node.js version: `node --version` (need 18+)

---

## Next: Build Sales Funnel Module

Once this Message Management system is running, use the **Sales Funnel Automation prompt** to build the automation module that will consume these messages.

The funnel module will:
- Reference messages from `text_messages` and `email_messages` tables
- Only use messages where `message_type = 'funnel_content'` or `'email_funnel_content'`
- Create automated, scheduled message sequences for customers
