# Norruva Digital Product Passport (DPP) - Concept Application

Welcome to the Norruva Digital Product Passport (DPP) concept application! This project is a Next.js-based platform designed to explore and prototype features for managing Digital Product Passports, aligning with EU regulations and leveraging AI for enhanced functionality.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Core Features (Conceptual)](#core-features-conceptual)
- [Current Implemented Features](#current-implemented-features)
- [Product Detail Page](#product-detail-page)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Key Directory Structure](#key-directory-structure)
- [Firebase Studio Context](#firebase-studio-context)

## Project Overview

The Norruva DPP platform aims to provide a comprehensive solution for:

- Securely storing and managing product data.
- Facilitating compliance with EU regulations (e.g., ESPR, Battery Regulation, CSRD).
- Integrating with infrastructures like EBSI (European Blockchain Services Infrastructure) for transparency.
- Utilizing AI for tasks like data extraction and summary generation.

This application serves as a prototype to demonstrate these capabilities.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Library:** React
- **Component Library:** ShadCN UI
- **Styling:** Tailwind CSS
- **Generative AI:** Google Genkit
- **Language:** TypeScript

## Core Features (Conceptual)

The platform is designed around the following core feature pillars:

- **Secure Product Data Storage:** Scalable and compliant data management.
- **EBSI Blockchain Integration:** For transparent lifecycle tracking (conceptual).
- **AI-Powered Data Extraction:** Automating data entry from supplier documents.
- **GDPR Compliance Management:** Granular consent and data subject rights.
- **EPREL Database Connectivity:** Automating energy label generation (conceptual).
- **CSRD Reporting:** Supporting sustainability reporting.

## Current Implemented Features

As of the current version, the following key areas and features have been prototyped:

- **Role-Based Dashboard:** Different views and actions based on user roles (Admin, Manufacturer, Supplier, etc.).
- **DPP Live Dashboard:** A view for public-facing DPPs, with filtering and AI summary generation.
- **Product Management:**
    - Listing existing products.
    - Adding new products via manual entry or AI-assisted document extraction.
    - Viewing detailed product information on the individual product detail page.
- **AI Compliance Co-Pilot:** An AI assistant to answer questions about EU DPP regulations.
- **Compliance Pathways:** Step-by-step guidance for specific regulations (e.g., EU Battery Regulation).
- **GDPR Management Page:** Mock interface for consent and data subject rights.
- **Sustainability Reporting:** Mock CSRD summary generation and emissions overview.
- **Customs & Compliance Dashboard:** A specialized view for customs-related product tracking and compliance alerts.
- **Supply Chain Management:**
    - Managing a list of suppliers.
    - Linking suppliers to products (viewable on the product detail page's "Supply Chain" tab).
- **Developer Portal:** Mock portal with API key management, interactive playground, and conceptual documentation.
- **Settings Page:** Basic user profile, notifications, and organization settings.

## Product Detail Page

The individual **Product Detail Page** (accessed via `/products/[productId]`) has been refactored and is now fully functional. It provides a comprehensive tabbed view of product information, including overview, sustainability, compliance, lifecycle, and supply chain details.

Links from other parts of the application, such as the "Products" listing page (`/products`) and the "DPP Live Dashboard" (`/dpp-live-dashboard`), that lead to this internal detail view are active and direct users to the relevant product's detailed information. The "Products" listing page (`/products`) and the "Add New Product" page (`/products/new`) are also fully functional for managing the product list and creating/editing entries.

## Getting Started

### Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn

### Installation

1.  Clone the repository (if applicable).
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Copy the example environment file and configure the values:
    ```bash
    cp .env.example .env
    # then edit .env and add your API keys and other settings
    ```

### Running the Development Server

1.  **Start the Genkit development server (for AI features):**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    This typically starts on `http://localhost:4000`.

2.  **Start the Next.js development server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application, usually on `http://localhost:9002` (as configured in `package.json`).

Open `http://localhost:9002` in your browser to view the application.

## Key Directory Structure

- `src/app/`: Contains the Next.js App Router pages and layouts.
  - `src/app/(app)/`: Authenticated/main application routes.
  - `src/app/api/`: API routes.
- `src/components/`: Reusable UI components.
  - `src/components/ui/`: ShadCN UI components.
- `src/ai/`: Genkit related code.
  - `src/ai/flows/`: Genkit AI flows.
- `src/lib/`: Utility functions.
- `src/contexts/`: React context providers.
- `src/types/`: TypeScript type definitions.

## Firebase Studio Context

This application is being developed within the Firebase Studio environment, an AI-assisted coding platform. Changes are often applied conversationally.

---

This README will be updated as the project evolves.
