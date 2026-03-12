# Spark Bid

## Overview

Spark Bid is a full-stack marketplace application built around time-based auction listings, account-backed bidding, and seller profile pages. The project is split into a React frontend and a small Express backend, with Supabase used for authentication, data storage, realtime updates, and image storage. Rather than treating the backend as a large business-logic layer, the code organizes most of the application around a client-driven marketplace UI backed by a generic server-side data bridge.

At a feature level, the application combines listing creation, listing discovery, bid placement, profile browsing, and subscription-style seller following. The result is a marketplace prototype that is focused less on checkout or payment processing and more on the live listing and bidding experience.

## Frontend Application Structure

The frontend is organized as a route-based React application. Public entry points include login, signup, and account confirmation screens. Once a user session is present, the application routes into the main marketplace pages: the home dashboard, listing detail pages, search, personal listings, bid history, profile views, and a subscribed-user feed.

Route access is controlled through a session check in a custom `useAuth` hook. That hook reads the current Supabase session on startup, listens for auth state changes, and exposes both `session` and `loading` state to the rest of the UI. The top-level `App` component uses that session state to redirect users into the authenticated portion of the application and to prevent protected pages from rendering before session state is resolved.

The UI itself is built around a dashboard pattern rather than a single feed. Navigation buttons move between core marketplace areas, while individual screens focus on one workflow at a time. The structure is broad enough that the project reads as an account-based platform rather than a single listing page with a bid form attached to it.

## Marketplace and Bidding Workflows

The home dashboard is centered on listing discovery. It computes a "popular listings" set by counting bids per listing, sorts active entries by bid volume, and then surfaces both a featured item and a set of high-activity cards. That means the landing experience is driven by marketplace activity already in the system instead of by a static featured list.

Search is implemented as a local filtering view over the current listing dataset. As the query changes, the page filters listings by title and description and updates the results set in real time. The code keeps that flow lightweight by building it on the already-fetched listing state rather than by making a new backend request for each keystroke.

The listing detail page is where the auction logic becomes more specific. Each listing page resolves the current listing, gathers its bid history, computes the current highest bid, and then branches based on ownership:

- owners see an edit path for the listing
- non-owners see the bid panel

The bid panel supports two submission styles. A user can place a custom amount manually, or they can use a quick-bid action that automatically advances the current highest bid by the listing's configured increment. That makes the bidding flow feel closer to a marketplace interaction than a plain "submit number" form.

Seller-side listing management is handled through a reusable modal workflow. The listing wizard supports both creation and editing, keeps listing metadata in one local form object, and writes through the same persistence path in both modes. The form includes title, description, starting price, increment amount, finish time, and a multi-image upload flow. Images are compressed in the frontend before upload, then stored in Supabase storage and linked back to the listing through generated IDs. Listing deletion is handled from the owner view and uses the same generic backend data handler as the rest of the application.

## Shared Data Model and Realtime Behavior

One of the more characteristic parts of the project is the `SparkBidStore` context layer. Instead of each page owning its own copy of listings, bids, and profile data, the frontend creates one shared store that fetches:

- `auction_listing`
- `bid_on_listing`
- `profile`

That store also subscribes to Supabase `postgres_changes` channels for all three tables. When any of those tables change, the corresponding dataset is refetched and the shared context state updates. As a result, the rest of the UI can treat listings, bid history, and user data as a shared live dataset rather than as route-local state.

The profile data is also normalized into a user map keyed by ID. That allows screens such as listing history, profile pages, and seller views to resolve user display information quickly without repeatedly searching arrays. In practice, that small structural choice makes cross-linking between bids, listings, and seller identity much simpler throughout the frontend.

Profile pages extend the marketplace beyond listing ownership alone. A profile can display seller information, owned listings, and a subscription relationship driven by a `subscribed_to` array in the profile record. That gives the project a small follow-based layer on top of the auction model rather than limiting it to isolated buyer and seller pages.

## Backend Integration Model

The backend is intentionally narrow. Instead of exposing many resource-specific endpoints, it provides a single `/api/data` route that accepts an operation descriptor in the request body. The incoming payload specifies which table or storage bucket to target and which operation to perform: select, insert, update, delete, upsert, or storage removal.

That endpoint acts as a compact command bridge into Supabase. The server creates its own Supabase client from environment configuration, applies a session-aware middleware layer, and then forwards the requested operation into the appropriate table or storage call. In practice, this makes the backend less of a traditional REST API and more of a controlled server-side database proxy.

The frontend complements that model through `fetchServer()`, which reads the current auth session, attaches the access and refresh tokens to each request, and then sends the request to the backend handler. This creates a consistent request path for the app's data-modifying operations: the React client builds the operation payload, the server attaches database access, and Supabase remains the underlying persistence layer.

## Technical Characteristics

This project combines several distinct implementation patterns in one codebase:

- a React route-based frontend with protected authenticated views
- a shared context layer for listings, bids, and profiles
- Supabase-backed auth, data access, storage, and realtime subscriptions
- an Express proxy endpoint that accepts generic database operation payloads
- modal-driven CRUD flows for listing management
- image compression and upload handling in the frontend
- computed marketplace views such as popular listings, bid history, and quick-bid actions
- profile subscription behavior layered on top of the core listing system

Taken together, Spark Bid reads as a marketplace interface built around shared live state rather than a static classifieds board. The defining characteristic is the way the frontend, backend bridge, and Supabase subscriptions are combined to keep listings, bids, and seller data moving through one connected auction flow.

## Tags

- Project Size: Large
- Technical Skill Level: High
- Technology Tags: React, Express, Supabase, React Router, CSS
- Capability Tags: Full-Stack Development, Realtime Data, CRUD Workflows, Marketplace Design, Authentication, File Uploads

## Project Details:

- Start Date: 2023-10-28
- End Date: 2023-12-06
- Duration: 40 Days
- Contributors: 6
- My Contribution: 35.4%
