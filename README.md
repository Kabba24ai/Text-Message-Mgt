# Text Message Management System

A comprehensive web application for managing broadcast and funnel content text messages with category management and sending capabilities.

## Features

### Message Management
- **Create, Edit, Delete Messages**: Full CRUD operations for text messages
- **Message Types**: Support for both broadcast and funnel content messages
- **Copy Messages**: Duplicate existing messages for quick content creation
- **Send Tracking**: Track when broadcast messages are sent

### Category Management
- **Create Categories**: Add new message categories on-the-fly
- **Quick Add**: Add categories directly from the message creation modal
- **Edit & Delete**: Full management of category library
- **Auto-populate**: Categories from existing messages are automatically imported

### Broadcast Sending
- **Send New Broadcast**: Select and send broadcast messages with preview
- **Message Preview**: Review message content before sending
- **Send History**: View when messages were last sent

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
The migrations are located in `supabase/migrations/` and need to be applied to your Supabase project.

5. Start the development server:
```bash
npm run dev
```

6. Build for production:
```bash
npm run build
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── BroadcastModal.tsx    # Modal for sending broadcasts
│   │   ├── CategoriesTab.tsx     # Category management interface
│   │   ├── MessageModal.tsx      # Message create/edit modal
│   │   └── MessageTable.tsx      # Message display table
│   ├── lib/
│   │   └── supabase.ts          # Supabase client configuration
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── supabase/
│   └── migrations/              # Database migration files
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Database Schema

### Tables

#### `text_messages`
- `id` (uuid, primary key)
- `context_category` (text) - Message category
- `content_name` (text) - Message identifier
- `content` (text) - Message body
- `message_type` (text) - Either 'broadcast' or 'funnel_content'
- `sent_date` (timestamptz) - When the message was sent (null if not sent)
- `created_at` (timestamptz) - Record creation timestamp

#### `categories`
- `id` (uuid, primary key)
- `name` (text, unique) - Category name
- `description` (text) - Optional category description
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### Security
All tables have Row Level Security (RLS) enabled with policies allowing anonymous access for demo purposes. Update these policies based on your authentication requirements.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Features in Detail

### Messages Tab
- Toggle between Broadcast and Funnel Content views
- Send broadcast messages directly from the table
- Edit existing messages
- Copy messages to create variations
- Delete messages with confirmation
- Sort broadcasts by sent date (most recent first)
- Sort funnel content by category and name

### Categories Tab
- View all message categories
- Create new categories with name and description
- Edit category details inline
- Delete categories with confirmation

### Send New Broadcast
- Select from available broadcast messages
- Preview message content before sending
- View message metadata (category, name, character count)
- See last sent date for previously sent messages
- One-click sending with confirmation

## Development Notes

- The application uses Supabase for backend services
- All database operations use Row Level Security (RLS)
- The UI is fully responsive and works on mobile devices
- TypeScript is used throughout for type safety
- Tailwind CSS provides utility-first styling

## Future Enhancements

- User authentication and authorization
- Scheduled broadcasts
- Message templates
- Analytics and reporting
- Bulk message operations
- Search and filtering capabilities
- Message versioning
- A/B testing for broadcasts

## Contributing

When contributing to this project:
1. Create a feature branch from master
2. Make your changes with clear commit messages
3. Test all functionality before submitting
4. Update documentation as needed
5. Submit a pull request for review

## License

[Specify your license here]
