# Sales Funnel Automation Module - Development Prompt

## Project Overview

Build a **Sales Funnel Automation Management System** that integrates with an existing CRM and Message Management system. This module allows you to create automated, multi-step communication funnels that send SMS and email messages to customers based on triggers and schedules.

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

### Existing CRM System
Your existing CRM already has:
- Customer database
- Rental management system
- Equipment tracking

This module will **integrate with but not replace** those systems. You'll reference customer and rental data when needed for enrollments and triggers.

### Database Schema Already Available

The following tables are **ALREADY CREATED** in the Supabase database:

#### CRM Tables (Already in Use - Reference Only)
1. **customers** - Customer contact information
   - id, first_name, last_name, email, phone, notes, created_at, updated_at

2. **equipment** - Rental equipment catalog
   - id, name, category, description, instructions_url, notes, created_at, updated_at

3. **rentals** - Rental transactions
   - id, customer_id (FK), rental_date, return_date, status, total_amount, notes, created_at, updated_at
   - Status values: 'pending', 'active', 'completed', 'cancelled'

4. **rental_items** - Line items for rentals
   - id, rental_id (FK), equipment_id (FK), quantity, unit_price, created_at

#### Funnel Automation Tables (Ready to Use - Your Focus)
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

### 1. Sales Funnel Builder (Primary Feature)
Create a comprehensive funnel configuration and management interface:

#### Funnel List View
- Display all sales funnels in a table or card layout
- Show: name, description, active status (toggle), step count, enrollment count
- Active/Inactive toggle switch (updates `is_active` field)
- Quick actions: Edit, Duplicate, Delete, View Analytics
- "Create New Funnel" button
- Filter by: Active/Inactive status
- Sort by: name, created date, enrollment count

#### Funnel Builder/Editor
A comprehensive form/interface to create and edit funnels:

**Funnel Details Section:**
- Name input (required, unique)
- Description textarea (optional)
- Active status toggle (is_active boolean)
- Save funnel to `sales_funnels` table

**Funnel Steps Section (Visual Timeline):**
Display steps as a visual timeline or ordered list:
- Steps numbered sequentially (1, 2, 3, etc.)
- Each step card/row displays:
  - **Step number badge**
  - **Trigger condition** (rental_created, rental_active, before_return, after_return, custom)
  - **Delay** (e.g., "0 days" = immediate, "3 days" = 3 days after trigger)
  - **Message type icon** (SMS icon or Email icon)
  - **Message preview:**
    - Category / Content Name
    - First 100 characters of message content
  - **Action buttons:** Edit Step, Delete Step, Move Up/Down (reorder)

- "Add Step" button to create new steps
- Drag-and-drop to reorder steps (optional enhancement)
- Visual timeline showing timing (Day 0, Day 1, Day 3, etc.)

#### Add/Edit Funnel Step Modal
When adding or editing a step, show a modal form with:

**Step Configuration:**
- **Step Number** (integer input, auto-suggested as next number)
- **Trigger Condition** (dropdown):
  - "Rental Created" - When customer creates a rental (enrollment trigger)
  - "Rental Active" - When rental status becomes active
  - "Before Return Date" - X days before return date
  - "After Return Date" - X days after return date
  - "Custom" - Manual trigger only

- **Delay in Days** (number input, 0 or positive):
  - 0 = Send immediately when trigger fires
  - 1+ = Wait X days after trigger
  - Help text: "How many days after the trigger should this message be sent?"

- **Message Type** (radio buttons):
  - SMS (shows text message icon)
  - Email (shows email icon)

- **Message Selector** (**CRITICAL - Core Integration Point**):
  - Dropdown populated from existing messages based on selected type
  - **For SMS:** Query `text_messages` WHERE `message_type = 'funnel_content'`
  - **For Email:** Query `email_messages` WHERE `message_type = 'email_funnel_content'`
  - Display format: `{context_category} / {content_name}`
    - Example: "Welcome Series / Day 1 Check-in"
  - When message selected, show preview:
    - For SMS: Show full content (character count)
    - For Email: Show subject and first 200 chars of content
  - Link to open Message Management module (optional)

- Save button creates/updates entry in `funnel_steps` table

**Validation:**
- Ensure message_id exists in the appropriate table
- Prevent duplicate step numbers within same funnel
- Require all fields to be filled

#### Funnel Testing/Preview Mode
Visual representation to understand the funnel flow:
- Timeline visualization showing:
  - Day 0 (trigger): Rental Created
  - Day 0 (immediate): Welcome SMS sent
  - Day 1: Check-in Email sent
  - Day 3: Equipment Tips SMS sent
  - Day 7: Feedback Request Email sent
- Full message previews for each step
- Simulate button to test funnel logic
- Shows what would happen if a customer enrolled today

#### Funnel Duplication
- "Duplicate Funnel" button
- Creates copy with name "{Original Name} (Copy)"
- Copies all funnel steps
- Set is_active = false by default
- Allows quick creation of variations

### 2. Enrollment Management Dashboard
Track and manage customer enrollments in funnels:

#### Active Enrollments View
- List/table of all customer funnel enrollments
- Display columns:
  - Customer name (from customers table via join)
  - Funnel name (from sales_funnels table)
  - Enrolled date
  - Status (active, completed, paused, cancelled)
  - Progress: "Step 3 of 7" or progress bar
  - Actions: View Details, Pause, Resume, Cancel

- Filters:
  - By funnel (dropdown)
  - By status (active, completed, paused, cancelled)
  - By customer (search)
  - Date range (enrolled date)

- Sort by: enrolled date, customer name, funnel name, progress

- Statistics cards at top:
  - Total active enrollments
  - Total completed enrollments
  - Messages sent today
  - Pending messages (scheduled)

#### Enrollment Detail View
Detailed view of a single customer's enrollment:

**Header Section:**
- Customer name and contact info (link to CRM)
- Rental information (link to rental in existing CRM)
- Funnel name and description
- Enrollment date and status
- Actions: Pause, Resume, Cancel, Delete

**Step Execution Timeline:**
Visual timeline or list showing all funnel steps and their execution status:

For each step show:
- Step number and message type icon
- Trigger condition and delay
- Message preview (category/name + first 100 chars)
- **Execution status badge:**
  - Pending (gray) - scheduled but not sent
  - Sent (green) - successfully executed
  - Failed (red) - error occurred
  - Skipped (yellow) - manually skipped or enrollment cancelled before execution
- **Dates:**
  - Scheduled date (when it should send)
  - Executed date (when it actually sent)
  - Time until send (countdown for pending)
- **Actions:**
  - Resend button (if failed)
  - Skip button (if pending)
  - View sent message details (if sent)

**Status Controls:**
- **Pause Enrollment:** Stop all pending executions
- **Resume Enrollment:** Restart with adjusted schedule
- **Cancel Enrollment:** Mark cancelled and skip all pending steps
- **Complete Manually:** Mark as completed

#### Pending Executions Queue
Dedicated view for upcoming/pending message sends:

- Table of all `funnel_step_executions` WHERE status = 'pending'
- Display columns:
  - Customer name
  - Funnel name
  - Step number
  - Message type (SMS/Email icon)
  - Message preview
  - Scheduled date/time
  - Time until send (countdown: "in 2 hours", "in 3 days")
  - Actions: Send Now (manual trigger), Skip, Cancel

- Sort by: scheduled_date (ascending - soonest first)
- Filter by: message type, funnel, date range

- "Send All Due Now" button (batch process overdue executions)
- Auto-refresh every minute to update countdowns

#### Manual Enrollment Interface
Form to manually enroll a customer in a funnel:

- **Customer Selector:** Dropdown or search from customers table
- **Funnel Selector:** Dropdown of active funnels (is_active = true)
- **Reference Rental:** Optional dropdown of customer's rentals
- **Enrollment Date:** Date picker (defaults to today)
- **Start Immediately:** Checkbox to calculate scheduled dates from now
- Save creates entry in `customer_funnel_enrollments` and generates all `funnel_step_executions`

### 3. Automation Engine (Backend Logic)
**This can be implemented as edge functions, serverless functions, or scheduled tasks**

#### Automatic Enrollment Trigger
Function that runs when a new rental is created:

```typescript
// Pseudo-code for enrollment logic
async function enrollCustomerInFunnels(rentalId: string) {
  // 1. Get rental details
  const rental = await supabase
    .from('rentals')
    .select('*, customer_id, rental_date, return_date')
    .eq('id', rentalId)
    .single();

  // 2. Find all active funnels
  const { data: funnels } = await supabase
    .from('sales_funnels')
    .select('*')
    .eq('is_active', true);

  // 3. For each active funnel
  for (const funnel of funnels) {
    // 4. Create enrollment
    const { data: enrollment } = await supabase
      .from('customer_funnel_enrollments')
      .insert({
        customer_id: rental.customer_id,
        rental_id: rental.id,
        funnel_id: funnel.id,
        enrolled_at: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    // 5. Get funnel steps with 'rental_created' trigger
    const { data: steps } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('funnel_id', funnel.id)
      .eq('trigger_condition', 'rental_created');

    // 6. Create step executions
    for (const step of steps) {
      const scheduledDate = new Date(rental.rental_date);
      scheduledDate.setDate(scheduledDate.getDate() + step.delay_days);

      await supabase
        .from('funnel_step_executions')
        .insert({
          enrollment_id: enrollment.id,
          funnel_step_id: step.id,
          scheduled_date: scheduledDate.toISOString(),
          status: 'pending'
        });
    }
  }
}
```

#### Scheduled Message Execution
Cron job or scheduled function that runs periodically (e.g., every 5 minutes):

```typescript
// Pseudo-code for execution logic
async function executeScheduledMessages() {
  // 1. Find all pending executions that are due
  const { data: executions } = await supabase
    .from('funnel_step_executions')
    .select(`
      *,
      enrollment:customer_funnel_enrollments(
        *,
        customer:customers(*)
      ),
      funnel_step:funnel_steps(*)
    `)
    .eq('status', 'pending')
    .lte('scheduled_date', new Date().toISOString());

  // 2. Process each execution
  for (const execution of executions) {
    try {
      // 3. Get the message content
      const messageType = execution.funnel_step.message_type;
      const messageId = execution.funnel_step.message_id;

      let message;
      if (messageType === 'sms') {
        const { data } = await supabase
          .from('text_messages')
          .select('*')
          .eq('id', messageId)
          .single();
        message = data;
      } else {
        const { data } = await supabase
          .from('email_messages')
          .select('*')
          .eq('id', messageId)
          .single();
        message = data;
      }

      // 4. Send the message
      // For MVP: Log the message (replace with actual SMS/Email API)
      console.log('Sending message:', {
        to: execution.enrollment.customer.phone || execution.enrollment.customer.email,
        type: messageType,
        content: message.content
      });

      // 5. Mark as sent
      await supabase
        .from('funnel_step_executions')
        .update({
          executed_date: new Date().toISOString(),
          status: 'sent'
        })
        .eq('id', execution.id);

    } catch (error) {
      // 6. Mark as failed
      await supabase
        .from('funnel_step_executions')
        .update({
          status: 'failed'
        })
        .eq('id', execution.id);

      console.error('Failed to send message:', error);
    }
  }
}
```

#### Status-Based Triggers
Function that runs when rental status changes:

```typescript
async function handleRentalStatusChange(rentalId: string, newStatus: string) {
  // Map status to trigger condition
  const triggerMap = {
    'active': 'rental_active',
    'completed': 'after_return',
    // Add more mappings as needed
  };

  const triggerCondition = triggerMap[newStatus];
  if (!triggerCondition) return;

  // Find enrollments for this rental
  const { data: enrollments } = await supabase
    .from('customer_funnel_enrollments')
    .select('*')
    .eq('rental_id', rentalId)
    .eq('status', 'active');

  for (const enrollment of enrollments) {
    // Find steps with matching trigger
    const { data: steps } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('funnel_id', enrollment.funnel_id)
      .eq('trigger_condition', triggerCondition);

    // Create executions
    for (const step of steps) {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + step.delay_days);

      await supabase
        .from('funnel_step_executions')
        .insert({
          enrollment_id: enrollment.id,
          funnel_step_id: step.id,
          scheduled_date: scheduledDate.toISOString(),
          status: 'pending'
        });
    }
  }
}
```

#### Before/After Return Date Triggers
Daily cron job to schedule messages based on return dates:

```typescript
async function scheduleReturnDateMessages() {
  // This would run daily at midnight

  // Find all active enrollments with rentals
  const { data: enrollments } = await supabase
    .from('customer_funnel_enrollments')
    .select(`
      *,
      rental:rentals(*)
    `)
    .eq('status', 'active')
    .not('rental_id', 'is', null);

  for (const enrollment of enrollments) {
    const returnDate = new Date(enrollment.rental.return_date);
    const today = new Date();

    // Find 'before_return' steps
    const { data: beforeSteps } = await supabase
      .from('funnel_steps')
      .select('*')
      .eq('funnel_id', enrollment.funnel_id)
      .eq('trigger_condition', 'before_return');

    for (const step of beforeSteps) {
      const scheduledDate = new Date(returnDate);
      scheduledDate.setDate(scheduledDate.getDate() - step.delay_days);

      // Only schedule if date is in the future and not already scheduled
      if (scheduledDate > today) {
        // Check if already scheduled
        const { data: existing } = await supabase
          .from('funnel_step_executions')
          .select('id')
          .eq('enrollment_id', enrollment.id)
          .eq('funnel_step_id', step.id)
          .single();

        if (!existing) {
          await supabase
            .from('funnel_step_executions')
            .insert({
              enrollment_id: enrollment.id,
              funnel_step_id: step.id,
              scheduled_date: scheduledDate.toISOString(),
              status: 'pending'
            });
        }
      }
    }

    // Similar logic for 'after_return' steps
  }
}
```

### 4. Analytics Dashboard (Optional Enhancement)
Basic reporting and metrics:

#### Funnel Performance View
- List of funnels with metrics:
  - Total enrollments
  - Active enrollments
  - Completed enrollments
  - Messages sent
  - Messages pending
  - Success rate (sent vs failed)

#### Message Performance
- Which messages are most sent
- Which messages fail most often
- Average time between scheduled and executed

#### Customer Engagement
- Most engaged customers (most enrollments)
- Customers with active enrollments
- Customers who completed funnels

## UI/UX Requirements

### Navigation Structure
Create a clean, focused interface with:
- **Funnels** - Main view (Funnel list and builder)
- **Enrollments** - Enrollment management
- **Queue** - Pending executions
- **Analytics** - Performance metrics (optional)

Or use a tabbed interface:
- Tab 1: Manage Funnels
- Tab 2: Active Enrollments
- Tab 3: Execution Queue
- Tab 4: Analytics

### Design Guidelines
- Match the design system of your existing Message Management module
- Color scheme:
  - Primary: Blue for actions and navigation
  - Success: Green for sent/completed/active
  - Warning: Orange/Yellow for pending/paused
  - Danger: Red for failed/cancelled
  - Neutral: Gray for inactive
- Responsive design (mobile-friendly)
- Loading states for all async operations
- Empty states with helpful CTAs ("No funnels yet. Create your first funnel!")
- Confirmation dialogs for destructive actions (delete, cancel)

### Key Visual Elements
- **Status badges** with colors (Active, Pending, Sent, Failed, etc.)
- **Progress indicators** for enrollments (progress bars or "3 of 7 steps")
- **Timeline visualization** for funnel steps
- **Icon usage** for message types (SMS icon, Email icon)
- **Countdown timers** for pending executions ("Sends in 2 hours")
- **Message previews** (truncated with "Read more" expansion)

### Key Interactions
- **Inline editing** for funnel names and descriptions
- **Toggle switches** for active/inactive status
- **Drag-and-drop** for reordering steps (optional)
- **Modal forms** for creating/editing steps
- **Hover actions** for quick edit/delete
- **Search and filter** with URL persistence
- **Toast notifications** for success/error feedback
- **Loading spinners** during async operations

## Technical Requirements

### Technology Stack
- **Frontend:** React 18 with TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect, useContext if needed)
- **Date Handling:** Native JS Date or date-fns library
- **Routing:** React Router (optional, if multi-page)

### Supabase Integration

**Environment Variables (.env file):**
```
VITE_SUPABASE_URL=https://tpgenpsfhlochdccpbje.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZ2VucHNmaGxvY2hkY2NwYmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MTQ1MzMsImV4cCI6MjA3NzI5MDUzM30.BE4kH2mP2XBoZtDMJdL4X9eP9Rheynt4oIQdYkWEJBs
```

**Supabase Client Setup:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Type Definitions

```typescript
// src/lib/types.ts

// Funnel Automation Types
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

// Reference Types (from existing systems)
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

// Message Types (from Message Management module)
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

### Critical Query Patterns

**Fetching Funnel Content Messages:**
```typescript
// Fetch SMS funnel content messages
const fetchSMSFunnelMessages = async () => {
  const { data, error } = await supabase
    .from('text_messages')
    .select('id, context_category, content_name, content')
    .eq('message_type', 'funnel_content')
    .order('context_category', { ascending: true });

  if (error) {
    console.error('Error fetching SMS messages:', error);
    return [];
  }
  return data || [];
};

// Fetch Email funnel content messages
const fetchEmailFunnelMessages = async () => {
  const { data, error } = await supabase
    .from('email_messages')
    .select('id, context_category, content_name, subject, content')
    .eq('message_type', 'email_funnel_content')
    .order('context_category', { ascending: true });

  if (error) {
    console.error('Error fetching email messages:', error);
    return [];
  }
  return data || [];
};
```

**Fetching Funnel with Steps:**
```typescript
const fetchFunnelWithSteps = async (funnelId: string) => {
  const { data, error } = await supabase
    .from('sales_funnels')
    .select(`
      *,
      funnel_steps(*)
    `)
    .eq('id', funnelId)
    .single();

  if (error) {
    console.error('Error fetching funnel:', error);
    return null;
  }
  return data;
};
```

**Fetching Enrollments with Related Data:**
```typescript
const fetchEnrollmentsWithDetails = async () => {
  const { data, error } = await supabase
    .from('customer_funnel_enrollments')
    .select(`
      *,
      customer:customers(*),
      funnel:sales_funnels(*),
      rental:rentals(*)
    `)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false });

  if (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }
  return data || [];
};
```

**Fetching Step Executions for an Enrollment:**
```typescript
const fetchExecutionsForEnrollment = async (enrollmentId: string) => {
  const { data, error } = await supabase
    .from('funnel_step_executions')
    .select(`
      *,
      funnel_step:funnel_steps(
        *
      )
    `)
    .eq('enrollment_id', enrollmentId)
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching executions:', error);
    return [];
  }
  return data || [];
};
```

## Implementation Phases

### Phase 1: Foundation (Days 1-2)
- Project setup: Vite + React + TypeScript + Tailwind
- Supabase client configuration
- Type definitions for all tables
- Basic routing/navigation structure
- Design system setup (colors, components)

### Phase 2: Funnel Management (Days 3-5)
- Funnel list view with active/inactive toggles
- Create/edit funnel form
- Funnel detail view
- Delete funnel with confirmation
- Basic CRUD operations for funnels

### Phase 3: Funnel Step Builder (Days 6-9)
- Step list display in funnel editor
- Add step modal with all fields
- Message selector (integration with Message Management)
- Message preview display
- Step reordering (move up/down buttons)
- Edit and delete steps
- Funnel timeline visualization

### Phase 4: Enrollment Management (Days 10-12)
- Enrollment list view with filters
- Enrollment detail view
- Step execution timeline display
- Pause/resume/cancel controls
- Manual enrollment form
- Progress tracking

### Phase 5: Execution Queue (Days 13-14)
- Pending executions list
- Countdown timers
- Manual trigger buttons
- Skip and cancel actions
- Real-time updates (polling or realtime subscriptions)

### Phase 6: Automation Engine (Days 15-18)
- Auto-enrollment function (triggered on rental creation)
- Scheduled execution function (cron/edge function)
- Status change triggers
- Return date triggers
- Error handling and logging
- Testing and debugging

### Phase 7: Polish & Testing (Days 19-21)
- Responsive design refinements
- Loading states and error handling
- Empty states with helpful messages
- Comprehensive testing of all flows
- Performance optimization
- Documentation

## Success Criteria

### Must Have (MVP)
- ✅ Create, edit, delete, duplicate funnels
- ✅ Add/edit/delete/reorder funnel steps
- ✅ Select messages from existing Message Management tables
- ✅ Message preview in step builder
- ✅ View all enrollments with status and progress
- ✅ View enrollment details with execution timeline
- ✅ Pause, resume, cancel enrollments
- ✅ Manual customer enrollment
- ✅ Pending execution queue view
- ✅ Automatic enrollment on rental creation
- ✅ Scheduled message execution engine

### Should Have
- ✅ Funnel duplication
- ✅ Funnel timeline visualization
- ✅ Status-based triggers (rental_active, etc.)
- ✅ Before/after return date triggers
- ✅ Manual send now for pending messages
- ✅ Resend failed messages
- ✅ Search and filter across all views

### Nice to Have
- Drag-and-drop step reordering
- Analytics dashboard
- A/B testing for funnels
- Conditional logic (if/then rules)
- Customer segmentation (enroll specific customers)
- Bulk enrollment
- Export reports
- Real-time updates using Supabase Realtime

## Key Reminders

1. **DO NOT create new messages** - Always reference existing message IDs from `text_messages` and `email_messages` tables
2. **Query funnel_content messages only** - Use `message_type = 'funnel_content'` for SMS and `message_type = 'email_funnel_content'` for email
3. **Use the same Supabase project** - Share the database with Message Management module
4. **Reference existing CRM data** - Don't recreate customer or rental management
5. **Focus on automation** - The core value is automated, triggered communications
6. **Handle errors gracefully** - Failed sends shouldn't break enrollments
7. **Think scalability** - Design for many customers and many funnels
8. **Test thoroughly** - Enrollment and execution logic must be bulletproof
9. **Keep it modular** - Separate concerns for easier maintenance
10. **Document everything** - Code comments and README for the team

## Getting Started

**Step 1:** Set up the project structure
```bash
npm create vite@latest sales-funnel-automation -- --template react-ts
cd sales-funnel-automation
npm install
npm install @supabase/supabase-js lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Step 2:** Configure Tailwind CSS in `tailwind.config.js`

**Step 3:** Create `.env` file with Supabase credentials

**Step 4:** Set up Supabase client and type definitions

**Step 5:** Build the funnel list view as your first feature

**Step 6:** Incrementally add features, testing each before moving on

Good luck building an amazing automation system! 🚀
