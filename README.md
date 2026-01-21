# Mood - A Minimal Mood App Tracker

## Overview

Mood is a cross-platform mobile app built with Expo and Supabase that allows users to log their emotional state with an optional reflection. The project was intentionally designed to be minimal in scope while demonstrating production-ready patterns such as authentication, database-level constraints, and secure, user-scoped data access.

Rather than focusing on feature volume, the app focuses on correctness, data integrity, and clear separation of concerns across the stack.

## Tech Stack

- Mobile: Expo (React Native)
- Language: TypeScript
- Backend: Supabase (PostgreSQL, Auth)
- Database: PostgreSQL
- Security: Row Level Security (RLS), database triggers & functions
- Tooling: Git, GitHub

## Features

- User authentication and session-based data access
- Create, update, and delete mood entries
- Mood level selection via a visual slider (0–5) with emoji feedback
- Optional text reflection for each mood entry
- Server-enforced rate limiting to prevent abuse
- Confirmation dialogs for destructive actions
- Typed API layer for safer client–database interaction

## Architecture and Design Decisions

### Database-first constraints

Instead of enforcing rules only on the client, the app uses PostgreSQL triggers and functions to enforce a time-based rate limit on mood creation. This ensures the rule is applied regardless of client behavior and prevents circumvention through deletes or modified requests.

### Secure user-scoped data access

Row Level Security (RLS) policies ensure users can only access and modify their own data. Filtering by user identity happens at the database level, not in the client.

### Typed Supabase helpers

Supabase-generated types are used throughout the API layer to reduce runtime errors and keep the client aligned with the database schema.

### Minimal UI, intentional UX

The interface prioritizes clarity and low friction:

- A single primary interaction per screen
- Visual feedback for mood level selection
- Automatic save behavior to reduce user effort

## Screenshots / Demo

Images or GIFs

## Running the app locally

git clone <https://github.com/your-username/mood-app>
cd mood-app
npm install
npx expo start

## Feature Improvements

- Offline-first support
- Mood history visualizations
- Accessibility enhancements
- Exporting mood data
