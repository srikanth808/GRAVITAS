# GRAVITAS Architecture

## System Overview

GRAVITAS is a modern, full-stack web application designed for crime intelligence processing and analysis. This document outlines the architecture and key components.

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Charting**: Recharts
- **Authentication**: Supabase Auth

### Backend
- **Database**: Supabase (PostgreSQL)
- **API**: Next.js API Routes / Serverless Functions
- **Authentication**: Supabase Row Level Security (RLS)
- **Deployment**: Vercel

### Data Processing
- **PDF Parsing**: pdf-parse v1
- **Text Extraction**: Buffer-based parsing
- **Classification**: AI-powered categorization

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│           Client (Browser)                   │
│  ┌────────────────────────────────────────┐ │
│  │  Next.js Frontend (React Components)   │ │
│  │  - Dashboard                           │ │
│  │  - FIR Upload                          │ │
│  │  - Analytics                           │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              ↓ (HTTPS)
┌─────────────────────────────────────────────┐
│      Next.js API Routes (Vercel)            │
│  ┌────────────────────────────────────────┐ │
│  │  - PDF Processing Endpoint             │ │
│  │  - Analytics Endpoint                  │ │
│  │  - Authentication Middleware           │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│    Supabase (PostgreSQL + Auth)             │
│  ┌────────────────────────────────────────┐ │
│  │  - fir_reports table                   │ │
│  │  - crime_classifications               │ │
│  │  - entity_records                      │ │
│  │  - user_sessions                       │ │
│  │  - audit_logs                          │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Key Workflows

### 1. FIR Upload & Processing
```
User Upload → Validation → PDF Parsing → Text Extraction → 
AI Classification → Data Storage → Dashboard Update
```

### 2. Real-time Analytics
```
Database Changes → Server Subscription → Chart Updates → UI Render
```

### 3. Authentication & Authorization
```
Login → Supabase Auth → JWT Token → RLS Policies → Data Access
```

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based sessions
- **Environment Variables**: Sensitive data isolated from codebase
- **HTTPS Only**: Encrypted communication
- **Audit Logging**: Track data access and modifications

## Scalability Considerations

- **Serverless**: Auto-scales with Vercel
- **Database Optimization**: Indexed queries on critical tables
- **Caching**: Client-side React query caching
- **CDN**: Static assets via Vercel Edge Network

## Future Enhancements

- [ ] GraphQL API for more efficient data fetching
- [ ] Real-time notifications via WebSockets
- [ ] Advanced search with Elasticsearch
- [ ] Machine learning model improvements
- [ ] Mobile app support
