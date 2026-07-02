# ScholarShield 🛡️ | Privacy-Preserving Scholarship Verification on Midnight 🌙

This project is a decentralized application built on the **Midnight Network** using the **Compact** smart contract language. It enables students to verify their eligibility for scholarships without exposing their raw GPA, family income, or personal documents to the scholarship portal.

---

## 💡 Product Proposal: ZK Scholarship Verification

### The Problem
Traditional scholarship applications require uploading sensitive, unencrypted PDFs of government identity documents, income certificates, and academic transcripts. These files are stored in centralized databases, presenting massive targets for identity theft, data leaks, and unauthorized tracking.

### The ZK Solution
Using Midnight's privacy-first model:
1. **Trusted Issuers** (Universities, Tax Departments) cryptographically sign digital credentials (e.g., family income statement, CGPA transcript) for a student's digital wallet.
2. The **Scholarship Portal** defines eligibility rules (e.g., GPA $\ge$ 8.0, Family Income $\le$ 250,000 INR) on the public ledger.
3. The **Student** inputs their private credentials into the zero-knowledge circuit, generating a cryptographic proof that they meet the rules.
4. The **Compact Contract** verifies the proof on-chain and returns a simple binary confirmation: **Eligible** or **Not Eligible**. 

*The portal never sees or stores the student's actual GPA, income, or ID documents.*

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

