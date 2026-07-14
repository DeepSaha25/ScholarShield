# ScholarShield

**Privacy-Preserving Scholarship Verification on Midnight**

---

[![Midnight Network](https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge)](https://midnight.network)
[![Tested With](https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![State](https://img.shields.io/badge/Level-4%20Complete-success?style=for-the-badge)](#)
[![CI](https://github.com/DeepSaha25/ScholarShield/actions/workflows/ci.yaml/badge.svg)](https://github.com/DeepSaha25/ScholarShield/actions/workflows/ci.yaml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/DeepSaha25/ScholarShield&root=frontend)
[![X (Twitter) Follow](https://img.shields.io/twitter/follow/georgian_deep?style=for-the-badge)](https://x.com/georgian_deep)

ScholarShield is a privacy-first decentralized application built on the **Midnight Network** using the **Compact** smart contract language. It enables students to verify their eligibility for scholarships without exposing their raw GPA, family income, or personal documents to the scholarship portal.

---

## Executive Summary & Hackathon Progression

This repository represents a structured progression through the "New Moon to Full" builder journey. Below is the comprehensive documentation categorized by the specific requirements of Levels 1 through 4.

---

## Level 1 Requirements: Setup & First Contract

### Goal
Toolchain setup, first Compact contract, deploy on Preview/Preprod, seed initial idea.

### Product Concept & Proposal
**Chosen Idea:** Age / Eligibility Gate (prove a threshold without revealing the underlying value).

ScholarShield acts as an eligibility gate for scholarships, proving that a student's GPA and Income meet specific thresholds without revealing the underlying numbers to the scholarship provider or the public ledger.

**The Problem vs. The Zero-Knowledge Solution**
- **Centralized Target:** Traditional portals require uploading unencrypted PDFs of ID cards, income certificates, and transcripts. 
  **Solution:** No sensitive documents are uploaded or stored. Verification is entirely mathematical.
- **Data Leaks & Identity Theft:** Transcripts and identity cards are stored in databases susceptible to leaks. 
  **Solution:** The portal only sees a cryptographic confirmation that criteria are met.
- **Lack of Student Control:** Students have to share all their private data to prove simple thresholds. 
  **Solution:** Students generate a Zero-Knowledge proof locally on their wallet, proving eligibility privately.

### Compact Smart Contract Overview
The core of ScholarShield is the Compact contract (`contracts/scholarship.compact`), which defines public scholarship rules on the ledger and the private verification circuit.

```compact
pragma language_version >=0.22.0;

// Ledger state: holds the public criteria of the scholarship.
// These values are transparent and verifiable by anyone on the Midnight blockchain.
export ledger min_gpa: Uint<32>;
export ledger max_income: Uint<32>;

// Constructor: called once at deployment by the scholarship board.
// disclose() explicitly moves the threshold values into public ledger state.
constructor(initial_min_gpa: Uint<32>, initial_max_income: Uint<32>) {
    min_gpa = disclose(initial_min_gpa);
    max_income = disclose(initial_max_income);
}

// Circuit: verifies a student's eligibility using their private credentials.
// The inputs `gpa` and `income` are PRIVATE WITNESSES — they are never stored
// on-chain, never passed to disclose(), and never visible to any observer.
// Only the mathematical proof of satisfaction is recorded on the blockchain.
export circuit verify_eligibility(gpa: Uint<32>, income: Uint<32>): [] {
    assert(gpa >= min_gpa, "GPA too low");
    assert(income <= max_income, "Income too high");
}
```

### Level 1 Verification Artifacts
- **Toolchain & Compilation:** Successfully compiled via `compact compile`.
- **Compile Output Image:** 
  ![Successful Compilation](./sub%20assets/yarn%20compile%20ss.png)

---

## Level 2 Requirements: Frontend Integration

### Goal
Wire the contract to a frontend UI, connect Lace wallet on Preprod.

### Frontend Infrastructure
- **Wallet Connection:** Implemented Lace and 1AM wallet connect/disconnect functionality.
- **Circuit Invocation:** The `verify_eligibility` circuit is successfully called directly from the frontend using the `@midnight-ntwrk/dapp-connector-api`.

### Live Deployment Information
- **Deployed Contract Address (Midnight Preprod):**
  `d13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e`

---

## Level 3 Requirements: Production-Grade dApp

### Goal
Polished dApp, tests, CI/CD, approved idea implementation.

### Privacy Model Documentation
In the Compact smart contract architecture:
- **Public State (Ledger):** The threshold limits set by the scholarship board (`min_gpa` and `max_income`). These are transparent and stored on-chain.
- **Private Witness:** The student's actual GPA and family income. These remain local to the student's machine and are used strictly as private inputs.
- **Selective Disclosure:** We deliberately use `disclose()` in the constructor to publish the scholarship rules. The student's inputs to `verify_eligibility` are private by default and are never passed to `disclose()`.

**Observer Blindness Matrix:**
- **Visible to Observers:** The scholarship's GPA/Income thresholds, that a valid ZK proof was submitted, the user's public wallet address.
- **Hidden from Observers:** The student's actual GPA, actual family income, personal identity details, or the margin by which they passed the threshold.

### Continuous Integration & Testing
- **Test Suite:** Minimum of 3 tests passing locally utilizing Vitest.
  ![Passing Tests](./sub%20assets/test%20output.png)
- **CI/CD Pipeline:** Fully functional GitHub Actions pipeline triggered on push.
  ![CI/CD Pipeline](./sub%20assets/cicd%20ss.png)

### User Interface Showcase
The application utilizes a modern, cyber-grid aesthetic with premium UI/UX interactions.
![UI Screenshot 1](./sub%20assets/ui1.png)
![UI Screenshot 2](./sub%20assets/ui2.png)
![UI Screenshot 3](./sub%20assets/ui3.png)

---

## Level 4 Requirements: MVP Goes Live

### Goal
MVP live on Preprod, comprehensive documentation, CI/CD, public product (X) profile.

### Minimum Viable Product Live Links
- **Live Application:** [https://scholar-shield-ten.vercel.app/](https://scholar-shield-ten.vercel.app/)
- **Demo Video Presentation:** [Watch on Google Drive](https://drive.google.com/file/d/1YUe91VBOKsM_-cpF4jBO_dhbyJyNmcWX/view?usp=sharing)
- **Public Brand Presence (X Profile):** [https://x.com/georgian_deep](https://x.com/georgian_deep)

---

## Setup & Local Development Instructions

### System Prerequisites
- Windows Subsystem for Linux 2 (WSL2)
- Docker Desktop (with WSL2 integration enabled)
- Node.js (v22+) and Yarn

### 1. Install Dependencies
Run the following within the root workspace directory inside the WSL2 environment:
```bash
yarn install
```

### 2. Compile the Smart Contract
Compile the Compact zero-knowledge circuits and generate TypeScript interfaces:
```bash
export PATH="$HOME/.local/bin:$PATH"
yarn compile
```
This generates compiled artifacts under `contracts/managed/scholarship/`.

### 3. Run the Test Suite
Initialize the local Midnight test infrastructure (faucet, indexer, sandbox, proof-server) in Docker and execute the tests:
```bash
yarn env:up
yarn test:local
```
To terminate the Docker containers:
```bash
yarn env:down
```

### 4. Run the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser. A supported browser wallet (1AM or Lace) connected to the Preprod network is required.
