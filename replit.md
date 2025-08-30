# Replit.md

## Overview

This is a full-stack MRO (Maintenance, Repair, and Operations) Workshop Reports application designed to manage and track component maintenance activities. The application provides a comprehensive platform for technicians to create detailed workshop reports, search and filter existing reports, and manage component maintenance workflows. It features a modern web interface with dashboard analytics, form-based report creation, and advanced search capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React SPA**: Single-page application built with React 18 and TypeScript
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **UI Framework**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API with JSON responses for CRUD operations on workshop reports
- **Middleware**: Custom logging middleware for request/response tracking
- **Error Handling**: Centralized error handling with structured error responses
- **Development Setup**: Hot reload with Vite integration for seamless development experience

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database hosting
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Management**: Drizzle Kit for database migrations and schema synchronization
- **Development Storage**: In-memory storage implementation for rapid prototyping and testing
- **Data Validation**: Zod schemas for runtime type checking and API validation

### Authentication and Authorization
- **Current State**: No authentication system implemented (ready for future integration)
- **Session Management**: Connect-pg-simple available for PostgreSQL-backed sessions
- **Security**: Basic Express security practices with JSON parsing and URL encoding

### Component Architecture
- **Layout System**: Consistent layout with sidebar navigation and header components
- **Form Components**: Reusable form components with validation and error handling
- **Data Display**: Table components with sorting, filtering, and bulk operations
- **UI Components**: Comprehensive component library with consistent theming
- **Responsive Design**: Mobile-first approach with adaptive layouts

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Connection**: @neondatabase/serverless driver for optimized serverless connections

### UI Component Libraries
- **Radix UI**: Comprehensive collection of accessible, unstyled components
- **Shadcn/ui**: Pre-styled component library built on Radix UI primitives
- **Lucide Icons**: Modern icon library for consistent visual elements

### Development Tools
- **TypeScript**: Static type checking for enhanced code reliability
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

### Data Management
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Schema validation for runtime type safety
- **Date-fns**: Modern date utility library for date formatting and manipulation

### Development Environment
- **Replit Integration**: Specialized plugins for Replit development environment
- **Hot Reload**: Development server with automatic refresh on code changes
- **Error Overlay**: Runtime error modal for enhanced debugging experience