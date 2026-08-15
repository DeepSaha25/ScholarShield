# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Analytics Dashboard**: Real-time stats, proof history tracking (localStorage), and SVG bar chart.
- **Client-Side Pre-checker**: Instantly checks eligibility rules locally to avoid unnecessary tx fees.
- **Live On-chain Criteria Reader**: Fetches active `min_gpa` and `max_income` from Midnight ledger.
- **Admin Network Guard**: Warns if deploying on a local node instead of Preprod.
- **Toast Notifications**: Lightweight alert system for verification success/failure.
- **StatusBadge Component**: Reusable status indicators for UI consistency.
- **Double-Submit Protection**: Prevents concurrent wallet proof generations.

### Fixed
- **Wallet Connection Leaks**: Cleans up polling intervals on disconnect.
- **Footer Address Truncation**: Ensures contract addresses don't overflow on mobile.
- **Mobile Navbar**: Hide text on small screens, use flex gap.
- **Private State Password**: Now securely loaded from environment variables.
- **Input Edge Cases**: Empty strings, negative values, overflow amounts now guarded.
