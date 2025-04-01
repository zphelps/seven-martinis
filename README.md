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
