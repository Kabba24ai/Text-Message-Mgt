# CRM Automated Funnel Module - Development Prompt

## Project Overview

Build a comprehensive CRM and Automated Sales Funnel management system for a rental equipment business. This module is a **companion to an existing Message Management system** and will consume message content from that system to power automated customer communications.

## Critical Integration Requirements

### Existing Message Management System
This project **MUST integrate with an existing Message Management module** that contains:

**Database Tables (Already Created):**
- `text_messages` - SMS broadcast and funnel content messages
- `email_messages` - Email broadcast and funnel content messages
- `categories` - SMS message categories
- `email_categories` - Email message categories

**Supabase Connection Details:**
- Database URL: `https://tpgenpsfhlochdccpbje.supabase.co`
- Anonymous Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs`

**IMPORTANT:** When building funnel steps, you will SELECT messages from these existing tables. DO NOT create new message content - only reference existing message IDs from the Message Management system.

### Database Schema Already Available

The following tables are **ALREADY CREATED** in the Supabase database:

#### CRM Tables (Ready to Use)
1. **customers** - Customer contact information
   - id, first_name, last_name, email, phone, notes, created_at, updated_at

2. **equipment** - Rental equipment catalog
   - id, name, category, description, instructions_url, notes, created_at, updated_at

3. **rentals** - Rental transactions
   - id, customer_id (FK), rental_date, return_date, status, total_amount, notes, created_at, updated_at
   - Status values: 'pending', 'active', 'completed', 'cancelled'

4. **rental_items** - Line items for rentals
   - id, rental_id (FK), equipment_id (FK), quantity, unit_price, created_at

#### Funnel Automation Tables (Ready to Use)
5. **sales_funnels** - Funnel definitions
   - id, name, description, is_active, created_at, updated_at

6. **funnel_steps** - Individual steps in a funnel
   - id, funnel_id (FK), step_number, message_id, message_type ('sms' or 'email'), delay_days, trigger_condition, created_at
   - Trigger conditions: 'rental_created', 'rental_active', 'before_return', 'after_return', 'custom'

7. **customer_funnel_enrollments** - Tracks customer enrollment
   - id, customer_id (FK), rental_id (FK), funnel_id (FK), enrolled_at, status, created_at
   - Status values: 'active', 'completed', 'paused', 'cancelled'

8. **funnel_step_executions** - Tracks step execution
   - id, enrollment_id (FK), funnel_step_id (FK), scheduled_date, executed_date, status, created_at
   - Status values: 'pending', 'sent', 'failed', 'skipped'

**All tables have RLS enabled with anonymous access policies for development.**

## Core Features to Build

### 1. Customer Management (CRM)
Create a full-featured customer management interface:

**Customer List View:**
- Searchable/filterable table of all customers
- Display: name, email, phone, rental count
- Sort by: name, email, date created, rental activity
- Quick actions: Edit, Delete, View Rentals
- "Add New Customer" button

**Customer Detail/Edit Modal:**
- Form fields: first_name, last_name, email, phone, notes
- Validation: email format, required fields
- Save to `customers` table
- Display customer's rental history
- Show active funnel enrollments

**Customer Card/Dashboard:**
- Customer summary information
- Recent rental activity
- Active funnel enrollments with progress
- Total lifetime value (sum of rental amounts)

### 2. Equipment Management
Create equipment catalog management:

**Equipment List View:**
- Searchable table with category filter
- Display: name, category, description preview
- Sort by: name, category, date created
- Quick actions: Edit, Delete, View Details
- "Add New Equipment" button

**Equipment Form Modal:**
- Fields: name, category, description, instructions_url, notes
- Category dropdown (auto-populate from existing equipment)
- YouTube/instructions URL validation
- Save to `equipment` table

**Equipment Detail View:**
- Full equipment information
- Instructions/video embed if URL provided
- Rental history (how many times rented)
- Currently rented status

### 3. Rental Management
Create rental transaction management:

**Rental List View:**
- Filterable by status (pending, active, completed, cancelled)
- Display: customer name, rental date, return date, status, total amount
- Sort by: rental date, return date, status, amount
- Status badges with color coding
- Quick actions: Edit, View Details, Change Status
- "Create New Rental" button

**Rental Creation/Edit Form:**
- **Step 1: Select Customer**
  - Dropdown or searchable customer selector
  - "Create New Customer" quick-add option

- **Step 2: Select Equipment**
  - Multi-select equipment with quantities
  - Each item shows: name, quantity input, unit price input
  - Subtotal per line item
  - "Add Equipment" button to add more items

- **Step 3: Rental Details**
  - Rental date (date picker)
  - Return date (date picker)
  - Status dropdown
  - Notes textarea
  - Total amount (auto-calculated from line items)

- **Save Logic:**
  - Insert into `rentals` table
  - Insert all items into `rental_items` table
  - **TRIGGER FUNNEL ENROLLMENT** (if active funnels exist)

**Rental Detail View:**
- Customer information with link to customer
- Rental dates and status
- List of rented equipment with quantities and prices
- Timeline showing:
  - Rental created date
  - Status changes
  - Messages sent (from funnel executions)
- "Change Status" button
- "Add to Funnel" button (manual enrollment)

### 4. Sales Funnel Builder
Create visual funnel configuration interface:

**Funnel List View:**
- List all sales funnels
- Display: name, description, active status, step count
- Toggle active/inactive status
- Quick actions: Edit, Duplicate, Delete, View Analytics
- "Create New Funnel" button

**Funnel Builder/Editor:**
- **Funnel Details Section:**
  - Name input
  - Description textarea
  - Active toggle switch

- **Funnel Steps Section (Visual Timeline):**
  - Display steps in order (1, 2, 3, etc.)
  - Each step card shows:
    - Step number
    - Trigger condition
    - Delay (days)
    - Message type (SMS/Email icon)
    - Message preview (first 100 chars)
    - Edit and Delete buttons

- **Add Step Modal:**
  - Step number (auto-increments)
  - Trigger condition dropdown:
    - "Rental Created" (enrollment trigger)
    - "Rental Active"
    - "Before Return Date"
    - "After Return Date"
    - "Custom"
  - Delay in days (number input, 0 = immediate)
  - Message type radio: SMS or Email
  - **Message Selector:**
    - **CRITICAL:** Dropdown populated from existing messages
    - For SMS: Query `text_messages` WHERE `message_type = 'funnel_content'`
    - For Email: Query `email_messages` WHERE `message_type = 'email_funnel_content'`
    - Display: category + content_name (e.g., "Welcome / Day 1 Check-in")
    - Show message preview when selected
  - Save to `funnel_steps` table

**Funnel Testing/Preview:**
- Visual representation of the funnel timeline
- Show example: "Customer rents on Day 0, receives messages on Day 0, 1, 3, 7"
- Preview all messages in sequence
- Simulate funnel execution

### 5. Enrollment Management Dashboard
Track and manage customer funnel enrollments:

**Active Enrollments View:**
- List of all active enrollments
- Display: customer name, funnel name, enrolled date, progress
- Progress bar showing completed vs pending steps
- Filter by: funnel, customer, status
- Quick actions: View Details, Pause, Cancel, Resume

**Enrollment Detail View:**
- Customer and rental information
- Funnel name and description
- Enrollment date and status
- **Step Execution Timeline:**
  - List all funnel steps
  - For each step show:
    - Status badge (pending, sent, failed, skipped)
    - Scheduled date
    - Executed date (if sent)
    - Message preview
    - Resend button (if failed)
- Manual controls: Pause, Resume, Cancel enrollment

**Pending Executions Queue:**
- List of all pending funnel step executions
- Display: customer, funnel name, step number, scheduled date, message type
- Sort by scheduled date (soonest first)
- Countdown timers for upcoming sends
- Manual trigger option for testing

### 6. Automation Engine (Backend Logic)
**This can be implemented as edge functions or scheduled tasks**

**Automatic Enrollment Trigger:**
- When a new rental is created (status = 'pending' or 'active')
- Check for active funnels (is_active = true)
- For each active funnel:
  - Create entry in `customer_funnel_enrollments`
  - Get all funnel steps WHERE trigger_condition = 'rental_created'
  - For each matching step:
    - Calculate scheduled_date (rental_date + delay_days)
    - Create entry in `funnel_step_executions`

**Scheduled Message Execution:**
- Query `funnel_step_executions` WHERE status = 'pending' AND scheduled_date <= NOW()
- For each pending execution:
  - Get the message content from `text_messages` or `email_messages` using message_id
  - **SEND MESSAGE** (for MVP, just log and mark as sent)
  - Update executed_date and status = 'sent'
  - Log any errors and set status = 'failed'

**Status-Based Triggers:**
- When rental status changes:
  - Check funnel steps for matching trigger_conditions
  - Schedule appropriate executions

**Before/After Return Triggers:**
- Daily cron job:
  - Query rentals with return_date approaching
  - Check for funnel steps with 'before_return' trigger
  - Schedule executions based on delay_days

## UI/UX Requirements

### Navigation Structure
Create a tabbed or sidebar navigation with:
- **Dashboard** (Overview with key metrics)
- **Customers** (CRM)
- **Equipment** (Catalog)
- **Rentals** (Transactions)
- **Funnels** (Sales Funnel Builder)
- **Enrollments** (Active Automations)
- **Analytics** (Future: reporting)

### Design Guidelines
- Use the same design system as the Message Management module
- Color scheme: Professional, clean, modern
  - Primary: Blue tones for actions
  - Success: Green for completed/active
  - Warning: Orange for pending
  - Danger: Red for failed/cancelled
- Responsive design (mobile-friendly)
- Loading states for all async operations
- Empty states with helpful CTAs
- Confirmation dialogs for destructive actions

### Key Interactions
- **Drag-and-drop** for reordering funnel steps (nice-to-have)
- **Inline editing** where appropriate (customer notes, equipment details)
- **Quick actions** on hover (edit, delete icons)
- **Search/filter** persist across page reloads
- **Toast notifications** for success/error feedback

## Technical Requirements

### Technology Stack (Match Existing Module)
- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Date Handling:** Native JS Date or date-fns (if needed)

### Supabase Integration
```typescript
// Use the same Supabase credentials as Message Management
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpgenpsfhlochdccpbje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Type Definitions
Define TypeScript types for all database tables:
```typescript
export type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Equipment = {
  id: string;
  name: string;
  category: string;
  description: string;
  instructions_url: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type Rental = {
  id: string;
  customer_id: string;
  rental_date: string;
  return_date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type RentalItem = {
  id: string;
  rental_id: string;
  equipment_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
};

export type SalesFunnel = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type FunnelStep = {
  id: string;
  funnel_id: string;
  step_number: number;
  message_id: string;
  message_type: 'sms' | 'email';
  delay_days: number;
  trigger_condition: 'rental_created' | 'rental_active' | 'before_return' | 'after_return' | 'custom';
  created_at: string;
};

export type CustomerFunnelEnrollment = {
  id: string;
  customer_id: string;
  rental_id: string | null;
  funnel_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  created_at: string;
};

export type FunnelStepExecution = {
  id: string;
  enrollment_id: string;
  funnel_step_id: string;
  scheduled_date: string;
  executed_date: string | null;
  status: 'pending' | 'sent' | 'failed' | 'skipped';
  created_at: string;
};

// Import existing message types from Message Management
export type TextMessage = {
  id: string;
  context_category: string;
  content_name: string;
  content: string;
  message_type: 'broadcast' | 'funnel_content';
  sent_date: string | null;
  created_at: string;
};

export type EmailMessage = {
  id: string;
  context_category: string;
  content_name: string;
  subject: string;
  content: string;
  message_type: 'email_broadcast' | 'email_funnel_content';
  sent_date: string | null;
  created_at: string;
};
```

### Data Fetching Patterns
Use React hooks for data management:
```typescript
// Example: Fetch customers with rental counts
const [customers, setCustomers] = useState<Customer[]>([]);

useEffect(() => {
  fetchCustomers();
}, []);

const fetchCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching customers:', error);
  } else {
    setCustomers(data || []);
  }
};
```

### Querying Messages for Funnel Steps
**CRITICAL PATTERN:** When building funnel steps, always query existing messages:

```typescript
// Fetch SMS funnel content messages
const fetchSMSMessages = async () => {
  const { data, error } = await supabase
    .from('text_messages')
    .select('id, context_category, content_name, content')
    .eq('message_type', 'funnel_content')
    .order('context_category', { ascending: true });

  return data || [];
};

// Fetch Email funnel content messages
const fetchEmailMessages = async () => {
  const { data, error } = await supabase
    .from('email_messages')
    .select('id, context_category, content_name, subject, content')
    .eq('message_type', 'email_funnel_content')
    .order('context_category', { ascending: true });

  return data || [];
};

// Use in funnel step form
<select value={selectedMessageId} onChange={handleMessageChange}>
  {messages.map(msg => (
    <option key={msg.id} value={msg.id}>
      {msg.context_category} / {msg.content_name}
    </option>
  ))}
</select>
```

### Joining Data for Display
Use Supabase's query capabilities to fetch related data:

```typescript
// Fetch rental with customer and items
const { data, error } = await supabase
  .from('rentals')
  .select(`
    *,
    customer:customers(*),
    rental_items(
      *,
      equipment:equipment(*)
    )
  `)
  .eq('id', rentalId)
  .single();
```

## Implementation Phases

### Phase 1: Foundation (Week 1)
- Project setup with Vite + React + TypeScript + Tailwind
- Supabase client configuration
- Type definitions for all tables
- Basic routing/navigation structure
- Dashboard with placeholder components

### Phase 2: CRM (Week 2)
- Customer management (list, create, edit, delete)
- Equipment management (list, create, edit, delete)
- Basic search and filtering
- Form validation and error handling

### Phase 3: Rental Management (Week 3)
- Rental list with filtering
- Rental creation form (multi-step)
- Rental detail view
- Status management
- Line item calculations

### Phase 4: Funnel Builder (Week 4)
- Funnel list and CRUD
- Funnel step builder
- Message selection from existing messages
- Visual timeline display
- Step reordering

### Phase 5: Enrollment & Automation (Week 5)
- Enrollment dashboard
- Execution queue viewer
- Automatic enrollment on rental creation
- Manual enrollment controls
- Step execution tracking

### Phase 6: Automation Engine (Week 6)
- Edge function for scheduled executions
- Trigger logic implementation
- Message sending simulation
- Error handling and retry logic
- Logging and monitoring

### Phase 7: Polish & Testing (Week 7)
- Responsive design refinements
- Loading and empty states
- Comprehensive error handling
- Manual testing of all flows
- Documentation updates

## Success Criteria

### Must Have (MVP)
- ✅ Full CRUD for Customers, Equipment, Rentals
- ✅ Multi-step rental creation with line items
- ✅ Funnel builder with message selection from existing tables
- ✅ Funnel step management
- ✅ Automatic enrollment on rental creation
- ✅ Manual enrollment controls
- ✅ Execution tracking dashboard
- ✅ Scheduled execution engine

### Should Have
- ✅ Search and filtering across all entities
- ✅ Visual funnel timeline
- ✅ Enrollment progress tracking
- ✅ Manual trigger for testing
- ✅ Pause/resume/cancel enrollments
- ✅ Before/after return date triggers

### Nice to Have
- Drag-and-drop step reordering
- Funnel duplication
- A/B testing support
- Analytics dashboard
- Message performance metrics
- Customer segmentation
- Bulk operations
- CSV import/export

## Key Reminders

1. **DO NOT create new message content** - Always reference existing messages from `text_messages` and `email_messages` tables
2. **Use the same Supabase project** - Share the database with the Message Management module
3. **Maintain consistent design** - Match the look and feel of the Message Management module
4. **Focus on automation** - The core value is automated, triggered communications
5. **Think long-term** - Build foundation for analytics and reporting
6. **Test thoroughly** - Ensure enrollment and execution logic is bulletproof
7. **Handle errors gracefully** - Failed sends shouldn't break the system
8. **Keep it modular** - Separate concerns for easier maintenance
9. **Document everything** - Code comments and README for the team
10. **Security first** - Update RLS policies before production

## Getting Started

Start by creating:
1. Project structure and configuration
2. Supabase client and type definitions
3. Basic navigation and routing
4. Customer management as the first feature
5. Build incrementally, testing each feature before moving on

Good luck! Build something amazing! 🚀
