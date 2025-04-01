# Seven Martinis Bar Management System

A modern, full-stack web application for managing a bar's operations, from order processing to menu management. Built with Next.js, TypeScript, and Supabase.

## Features

### Customer Interface
- **Digital Menu**: Browse available drinks with detailed descriptions and ingredients
- **Easy Ordering**: Place orders with custom instructions and track order status in real-time
- **Order History**: View past orders and their status
- **Digital Tipping**: Integrated Venmo tipping system for convenient payment

### Staff Interface
- **Order Management**: 
  - Real-time order tracking using Kanban board
  - Order status updates (Ordered → Preparing → Ready → Served)
  - Customer name tracking for order delivery
  - Order history and analytics

- **Menu Management**:
  - Add, edit, and remove menu items
  - Update drink availability in real-time
  - Manage drink numbers and descriptions
  - Tag-based categorization (Vodka, Gin, Bourbon, etc.)
  - Recipe management with ingredient tracking

- **Inventory Integration**:
  - Track ingredient usage
  - Monitor stock levels
  - Link ingredients to recipes

### Technical Features
- **Real-time Updates**: Live order status updates using Supabase subscriptions
- **Responsive Design**: Mobile-friendly interface for both customers and staff
- **Modern UI**: Built with Radix UI and shadcn/ui components
- **Type Safety**: Full TypeScript implementation
- **Authentication**: Secure user management system

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Run the development server:
   ```bash
   npm run dev
   ```

## Tech Stack
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Hooks
- **Real-time**: Supabase Realtime


<img width="1254" alt="Screenshot 2025-04-01 at 1 38 59 PM" src="https://github.com/user-attachments/assets/4e65b93f-f865-4b70-9c12-755bec6b0371" />
<img width="1512" alt="Screenshot 2025-04-01 at 1 40 58 PM" src="https://github.com/user-attachments/assets/74784cfe-0982-4e70-ab74-46d7915ed012" />
<img width="1512" alt="Screenshot 2025-04-01 at 1 41 23 PM" src="https://github.com/user-attachments/assets/376f4810-c597-4d2f-a149-b202b5cce60a" />
<img width="1512" alt="Screenshot 2025-04-01 at 1 42 01 PM" src="https://github.com/user-attachments/assets/3ea2d9a2-1c9e-4465-8c2d-3f48dc6aa794" />

