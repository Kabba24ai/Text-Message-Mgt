# Message Management System

A comprehensive web application for managing SMS and email broadcast and funnel content messages with category management, CRM functionality, and automated sales funnel capabilities for rental businesses.

## Overview

This system provides a complete solution for:
- Managing broadcast and funnel content messages (SMS and Email)
- Category organization for messages
- CRM for tracking customers, equipment, and rentals
- Automated sales funnel workflows triggered by rental events

## Features

### Message Management
- **Dual Channel Support**: Manage both SMS and email messages
- **Message Types**: Support for broadcast and funnel content messages
- **CRUD Operations**: Create, edit, copy, and delete messages
- **Send Tracking**: Track when broadcast messages are sent
- **Advanced Filtering**: Filter by category and search by content name
- **Type-specific Views**: Separate views for SMS Broadcast, SMS Funnel Content, Email Broadcast, and Email Funnel Content

### Category Management
- **Separate Categories**: Independent category systems for SMS and email
- **Quick Add**: Add categories directly from message creation modal
- **Full CRUD**: Create, edit, and delete categories
- **Auto-populate**: Categories automatically imported from existing messages

### CRM (Customer Relationship Management)
- **Customer Database**: Track customer information (name, email, phone, notes)
- **Equipment Library**: Manage rental equipment with categories, descriptions, and instruction URLs
- **Rental Tracking**: Track rentals with dates, status, and line items
- **Rental Items**: Link equipment to rentals with quantities and pricing

### Sales Funnel Automation
- **Funnel Configuration**: Define multi-step sales funnels
- **Automated Enrollment**: Customers automatically enrolled in funnels when they rent
- **Step Execution**: Track scheduled and executed funnel steps
- **Mixed Messaging**: Support SMS and email in the same funnel
- **Flexible Triggers**: Multiple trigger conditions (rental created, active, before/after return)

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)

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
The migrations are located in `supabase/migrations/` and need to be applied to your Supabase project in order:
   - `20251029133738_add_anon_access_policies.sql`
   - `20251029140746_create_categories_table.sql`
   - `20251029144246_create_sales_funnels_table.sql`
   - `20251029165223_create_email_messages_table.sql`
   - `20251030094329_create_email_categories_table.sql`
   - `20251030101651_create_crm_tables.sql`
   - `20251030101718_create_funnel_automation_tables.sql`

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
│   │   └── MessageTable.tsx      # Message display table with actions
│   ├── lib/
│   │   └── supabase.ts          # Supabase client configuration and types
│   ├── App.tsx                  # Main application component with routing logic
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles with Tailwind directives
├── supabase/
│   └── migrations/              # Database migration files (run in order)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Database Schema

### Core Message Tables

#### `text_messages`
SMS message storage for broadcast and funnel content.
- `id` (uuid, primary key)
- `context_category` (text) - Message category
- `content_name` (text) - Message identifier
- `content` (text) - Message body
- `message_type` (text) - 'broadcast' or 'funnel_content'
- `sent_date` (timestamptz) - When the message was sent (null if not sent)
- `created_at` (timestamptz) - Record creation timestamp

#### `email_messages`
Email message storage for broadcast and funnel content.
- `id` (uuid, primary key)
- `context_category` (text) - Message category
- `content_name` (text) - Message identifier
- `subject` (text) - Email subject line
- `content` (text) - Email body (HTML or plain text)
- `message_type` (text) - 'email_broadcast' or 'email_funnel_content'
- `sent_date` (timestamptz) - When the message was sent (null if not sent)
- `created_at` (timestamptz) - Record creation timestamp

#### `categories`
SMS message categories.
- `id` (uuid, primary key)
- `name` (text, unique) - Category name
- `description` (text) - Optional category description
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

#### `email_categories`
Email message categories (separate from SMS categories).
- `id` (uuid, primary key)
- `name` (text, unique) - Category name
- `description` (text) - Optional category description
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

### CRM Tables

#### `customers`
Customer contact information.
- `id` (uuid, primary key)
- `first_name` (text) - Customer first name
- `last_name` (text) - Customer last name
- `email` (text, unique) - Customer email address
- `phone` (text) - Customer phone number
- `notes` (text) - Additional notes
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

#### `equipment`
Rental equipment catalog.
- `id` (uuid, primary key)
- `name` (text) - Equipment name
- `category` (text) - Equipment category
- `description` (text) - Equipment description
- `instructions_url` (text) - YouTube video or instructions URL
- `notes` (text) - Additional notes
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

#### `rentals`
Rental transactions.
- `id` (uuid, primary key)
- `customer_id` (uuid, foreign key to customers) - Which customer
- `rental_date` (date) - When rental starts
- `return_date` (date) - When rental is due back
- `status` (text) - Status: 'pending', 'active', 'completed', 'cancelled'
- `total_amount` (numeric) - Total rental cost
- `notes` (text) - Additional notes
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

#### `rental_items`
Individual items in a rental.
- `id` (uuid, primary key)
- `rental_id` (uuid, foreign key to rentals) - Which rental
- `equipment_id` (uuid, foreign key to equipment) - Which equipment
- `quantity` (integer) - How many units
- `unit_price` (numeric) - Price per unit
- `created_at` (timestamptz) - Record creation timestamp

### Funnel Automation Tables

#### `sales_funnels`
Funnel definitions.
- `id` (uuid, primary key)
- `name` (text, unique) - Funnel name
- `description` (text) - Funnel description
- `is_active` (boolean) - Whether funnel is active
- `created_at` (timestamptz) - Record creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

#### `funnel_steps`
Individual steps in a sales funnel.
- `id` (uuid, primary key)
- `funnel_id` (uuid, foreign key to sales_funnels) - Which funnel
- `step_number` (integer) - Order of the step
- `message_id` (uuid) - Message to send (references text_messages or email_messages)
- `message_type` (text) - 'sms' or 'email'
- `delay_days` (integer) - Days to wait before sending (0 = immediate)
- `trigger_condition` (text) - 'rental_created', 'rental_active', 'before_return', 'after_return', 'custom'
- `created_at` (timestamptz) - Record creation timestamp

#### `customer_funnel_enrollments`
Tracks customer enrollment in funnels.
- `id` (uuid, primary key)
- `customer_id` (uuid, foreign key to customers) - Which customer
- `rental_id` (uuid, foreign key to rentals) - Which rental triggered enrollment
- `funnel_id` (uuid, foreign key to sales_funnels) - Which funnel
- `enrolled_at` (timestamptz) - When customer was enrolled
- `status` (text) - 'active', 'completed', 'paused', 'cancelled'
- `created_at` (timestamptz) - Record creation timestamp

#### `funnel_step_executions`
Tracks execution of individual funnel steps.
- `id` (uuid, primary key)
- `enrollment_id` (uuid, foreign key to customer_funnel_enrollments) - Which enrollment
- `funnel_step_id` (uuid, foreign key to funnel_steps) - Which step
- `scheduled_date` (timestamptz) - When this step should execute
- `executed_date` (timestamptz) - When this step was actually executed
- `status` (text) - 'pending', 'sent', 'failed', 'skipped'
- `created_at` (timestamptz) - Record creation timestamp

### Security

All tables have Row Level Security (RLS) enabled with policies allowing anonymous access for demo purposes. **Important**: Update these policies based on your authentication requirements before deploying to production.

### Indexes

Performance indexes are created on:
- Foreign key columns for joins
- Status columns for filtering
- Date columns for sorting and scheduling
- Unique constraints on name fields

## Available Scripts

- `npm run dev` - Start development server (runs on port configured by Vite)
- `npm run build` - Build for production (outputs to dist/)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking

## Component Documentation

### App.tsx
Main application component that orchestrates the entire system.
- Manages active tab (Messages vs Categories)
- Manages active filter (SMS/Email Broadcast/Funnel Content)
- Handles message fetching for both SMS and email
- Implements filtering and sorting logic
- Coordinates modal interactions

### MessageTable.tsx
Displays messages in a responsive table format.
- Supports both SMS and email messages
- Shows category, content name, and character/word count
- Provides action buttons (Send, Edit, Copy, Delete)
- Displays sent date for broadcast messages
- Responsive design for mobile and desktop

### MessageModal.tsx
Create and edit messages with form validation.
- Supports both SMS and email message types
- Dynamic form fields based on message channel
- Category selection with quick-add functionality
- Character/word count tracking
- Validation before save

### BroadcastModal.tsx
Send broadcast messages with preview.
- Filter messages by type (broadcast only)
- Display message metadata (category, name, counts)
- Preview message content before sending
- Show last sent date for tracking
- Confirm before sending

### CategoriesTab.tsx
Manage message categories.
- Separate views for SMS and email categories
- Create new categories with description
- Edit existing categories inline
- Delete with confirmation
- Auto-sync with message categories

## Implementation Status

### Completed Features
- SMS message management (broadcast and funnel content)
- Email message management (broadcast and funnel content)
- Category management for both SMS and email
- Message filtering and searching
- Send tracking for broadcasts
- Database schema for CRM
- Database schema for funnel automation
- Complete RLS policies for all tables

### Pending Implementation
The following features have database tables created but need UI implementation:
- Customer management interface
- Equipment management interface
- Rental management interface
- Funnel configuration interface
- Enrollment tracking dashboard
- Step execution monitoring
- Automated message sending system (backend service)
- Scheduled task execution (cron or edge function)

## Future Development Roadmap

### Phase 1: CRM Interface (Next Priority)
- Customer list and detail views
- Equipment catalog management
- Rental creation and management
- Dashboard with rental overview

### Phase 2: Funnel Builder
- Visual funnel configuration interface
- Step editor with message selection
- Trigger condition configuration
- Funnel testing and preview

### Phase 3: Automation Engine
- Backend service for message sending
- Scheduled task execution
- Enrollment automation on rental creation
- Step execution based on schedules and triggers

### Phase 4: Analytics and Reporting
- Message performance tracking
- Funnel conversion metrics
- Customer engagement analytics
- Revenue tracking and reporting

### Phase 5: Advanced Features
- User authentication and multi-tenant support
- Template library for messages
- A/B testing for broadcasts
- Message versioning and rollback
- Bulk operations
- Advanced scheduling options
- Integration with SMS/email providers

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React hooks patterns
- Maintain component modularity
- Keep files under 300 lines when possible
- Use Tailwind CSS utility classes

### Database Operations
- Always use Supabase client methods
- Handle errors gracefully with user feedback
- Use `maybeSingle()` for optional single-row queries
- Implement optimistic UI updates where appropriate
- Refresh data after mutations

### Security Considerations
- Never expose sensitive credentials in client code
- Update RLS policies before production deployment
- Validate all user inputs on both client and server
- Implement proper authentication when ready
- Use parameterized queries (Supabase handles this)

### Testing Strategy
- Test all CRUD operations manually before commit
- Verify RLS policies work as expected
- Test responsive design on multiple devices
- Validate form inputs and error states
- Test edge cases (empty states, large datasets)

## API Integration Notes

### Supabase Client Usage
```typescript
import { supabase } from './lib/supabase';

// Query
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value');

// Insert
const { data, error } = await supabase
  .from('table_name')
  .insert([{ column: 'value' }]);

// Update
const { data, error } = await supabase
  .from('table_name')
  .update({ column: 'new_value' })
  .eq('id', id);

// Delete
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', id);
```

### Type Definitions
All database types are defined in `src/lib/supabase.ts`:
- `TextMessage`
- `EmailMessage`
- `Category`
- `EmailCategory`
- `Customer`
- `Equipment`
- `Rental`
- `RentalItem`
- `SalesFunnel`
- `FunnelStep`
- `CustomerFunnelEnrollment`
- `FunnelStepExecution`

## Deployment Considerations

### Environment Variables
Ensure the following are set in production:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Database Setup
1. Run all migrations in order
2. Update RLS policies for production authentication
3. Consider adding additional indexes for production scale
4. Set up database backups
5. Configure connection pooling if needed

### Build Process
```bash
npm run build
```
Outputs optimized static files to `dist/` directory.

### Hosting Recommendations
- **Vercel**: Automatic deployments, edge network, built-in CI/CD
- **Netlify**: Similar to Vercel with great static hosting
- **AWS S3 + CloudFront**: Full control, highly scalable
- **Supabase Hosting**: Keep everything in one platform

## Troubleshooting

### Common Issues

**Messages not loading:**
- Check Supabase credentials in `.env`
- Verify RLS policies are correctly configured
- Check browser console for error messages

**Categories not appearing:**
- Ensure categories table has data
- Verify RLS policies allow anonymous read
- Check that category names are unique

**Send button not working:**
- Verify message has all required fields
- Check network tab for API errors
- Ensure RLS policies allow updates

**Build errors:**
- Run `npm run typecheck` to identify TypeScript errors
- Ensure all dependencies are installed
- Clear node_modules and reinstall if needed

## Contributing

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Individual feature branches

### Commit Messages
Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Pull Request Process
1. Create feature branch from `develop`
2. Make changes with clear commit messages
3. Test all functionality thoroughly
4. Update documentation as needed
5. Submit PR with detailed description
6. Address review feedback
7. Merge after approval

## Support and Contact

For questions or issues:
- Review this documentation first
- Check the troubleshooting section
- Review Supabase documentation for database questions
- Review React and TypeScript documentation for frontend questions

## License

[Specify your license here]

## Acknowledgments

Built with:
- React and TypeScript
- Supabase for backend services
- Tailwind CSS for styling
- Vite for blazing fast builds
- Lucide React for beautiful icons
