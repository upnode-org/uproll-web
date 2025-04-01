# Uproll Web UI

A modern web interface for configuring and managing OPStack rollups. Built with Next.js, this application provides an intuitive way to set up and manage your rollup configurations.

## Overview

Uproll Web UI is a comprehensive configuration tool designed to simplify the deployment and management of Optimism (OP) Stack rollups. It provides a user-friendly interface to configure all aspects of your rollup without requiring deep technical knowledge of the underlying infrastructure.

## Features

- **Visual Configuration Interface**: Intuitive UI for configuring all aspects of OPStack rollups
- **Comprehensive Rollup Settings**: Configure settlement layers, execution clients, consensus clients, signers, and more
- **Configuration Management**: Save, load, and modify rollup configurations
- **Configuration Export**: Download your configurations as YAML files ready for deployment
- **Real-time Validation**: Immediate feedback on configuration validity
- **Command Integration**: Seamless integration with the Uproll CLI for deployment

## Key Configuration Options

- **Settlement Layer Configuration**: Support for Ethereum Mainnet, Sepolia, or custom L1 chains
- **Participant Configuration**: Configure execution layers (op-geth, op-reth, op-erigon, etc.) and consensus layers (op-node, hildr)
- **Signer Configuration**: Support for private key or endpoint-based signers
- **Chain Settings**: Customize L2 chain ID, block time, and other network parameters
- **Gas Configuration**: Fine-tune gas parameters for your rollup
- **Data Availability Options**: Choose from ETH Blob + Calldata, ETH Blob, ETH Calldata, or custom DA solutions

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

- `app/` - Main application pages and routes
  - `config/` - Configuration interface and view pages
  - `api/` - Backend API endpoints
  - `auth/` - Authentication-related pages
- `components/` - Reusable UI components
  - `config/RollupConfig/` - Rollup configuration form components
  - `ui/` - Base UI components
- `lib/` - Utility functions and shared logic
  - `opSchema.ts` - Zod schema for rollup configuration validation
- `services/` - API client services
- `types/` - TypeScript type definitions
- `prisma/` - Database schema and migrations

## Technical Implementation

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **UI Components**: Custom components built with Tailwind CSS and Radix UI
- **Form Management**: React Hook Form with Zod validation
- **Authentication**: NextAuth.js for user authentication
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API routes for backend functionality

## Workflow

1. Create a new rollup configuration through the web interface
2. Configure all necessary parameters for your rollup
3. Save your configuration to the database
4. Download the configuration as a YAML file or use the generated command with Uproll CLI to deploy your rollup

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [OPStack Documentation](https://docs.optimism.io/operators/node-operators/rollup-node) - learn about OPStack rollups
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
