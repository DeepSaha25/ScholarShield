# ScholarShield 🛡️

### *Privacy-Preserving Scholarship Verification on Midnight*

---

[![Midnight Network](https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge)](https://midnight.network)
[![Tested With](https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![State](https://img.shields.io/badge/Level-1%20Complete-success?style=for-the-badge)](#)

ScholarShield is a privacy-first decentralized application built on the **Midnight Network** using the **Compact** smart contract language. It enables students to verify their eligibility for scholarships without exposing their raw GPA, family income, or personal documents to the scholarship portal.

---

## 💡 Product Concept

### The Problem vs. The ZK Solution

| ❌ The Traditional Problem | 🛡️ The ScholarShield Solution (ZK) |
| :--- | :--- |
| **Centralized Target**: Portals require uploading unencrypted PDFs of ID cards, income certificates, and transcripts. | **Zero Document Storage**: No sensitive documents are uploaded or stored. Verification is entirely mathematical. |
| **Data Leaks & Identity Theft**: Transcripts and identity cards are stored in databases susceptible to leaks. | **Data Minimization**: The portal only sees a cryptographic confirmation that criteria are met. |
| **Lack of Student Control**: Students have to share all their private data to prove simple thresholds. | **Selective Disclosure**: Students generate a ZK proof locally on their wallet, proving eligibility privately. |

### How it Works (ZK Workflow)
1. 🏫 **Issuer signs credentials**: Trusted authorities (e.g. Universities, Tax Authorities) issue digitally signed credentials (GPA, income details) to the student's private wallet.
2. ⚙️ **Rules defined on-chain**: The scholarship board publishes public threshold rules (e.g. $GPA \ge 8.0$, $Income \le 250,000$ INR) on the Midnight ledger.
3. 🔒 **Private Witness**: The student inputs their private credentials locally to generate a zero-knowledge proof.
4. 🚀 **On-chain Verification**: The Compact smart contract verifies the ZK proof and confirms eligibility without learning the student's actual GPA or income.

---

## 🔒 ZK Privacy Model: Public State vs. Private Witness

In the Compact smart contract:

*   **Public State (Ledger)**: The threshold limits set by the scholarship board. Specifically, `min_gpa` and `max_income`. These are transparent and stored on-chain for verifiability.
*   **Private Witness**: The student's actual GPA and family income. These remain local to the student's machine and are used strictly as private inputs to calculate the ZK proof. 
*   **Selective Disclosure via `disclose()`**: We deliberately use `disclose()` in the constructor to publish the scholarship rules (`min_gpa` and `max_income`) to the ledger. In contrast, the student's inputs to `verify_eligibility` are private by default and are **never** passed to `disclose()`, keeping them entirely hidden from public eyes.

---

## 📸 Level 1 Verification Proofs

### Successful Compilation (Circuits Generated)
![Successful Compilation](./sub%20assets/yarn%20compile%20ss.png)

### Successful Test Suite Execution (All Passing)
![Passing Tests](./sub%20assets/test%20output.png)

---

## 🛠️ Setup & Local Running Instructions

### System Prerequisites
- **WSL2** (Windows Subsystem for Linux - Ubuntu 24.04/26.04)
- **Docker Desktop** (with WSL2 integration enabled)
- **Node.js** (v22+) & **Yarn**

### 1. Install Dependencies
Run this in the root workspace directory inside your WSL2 environment:
```bash
yarn install
```

### 2. Compile the Smart Contract
Compile the Compact zero-knowledge circuits and generate TypeScript interfaces:
```bash
export PATH="$HOME/.local/bin:$PATH"
yarn compile
```

This generates compiled artifacts, proving/verifying keys, and TypeScript types under `contracts/managed/scholarship/`.

### 3. Run the Test Suite
Boot up the local Midnight test infrastructure (faucet, indexer, sandbox, proof-server) in Docker and run the test suite:
```bash
yarn env:up
yarn test:local
```

To shut down the Docker containers afterwards:
```bash
yarn env:down
```

