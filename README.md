# ScholarShield 🛡️

### *Privacy-Preserving Scholarship Verification on Midnight*

---

[![Midnight Network](https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge)](https://midnight.network)
[![Language](https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge)](https://midnight.network)
[![Tested With](https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge)](https://vitest.dev)
[![State](https://img.shields.io/badge/Level-3%20Complete-success?style=for-the-badge)](#)
[![CI](https://github.com/DeepSaha25/ScholarShield/actions/workflows/ci.yaml/badge.svg)](https://github.com/DeepSaha25/ScholarShield/actions/workflows/ci.yaml)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/DeepSaha25/ScholarShield&root=frontend)

ScholarShield is a privacy-first decentralized application built on the **Midnight Network** using the **Compact** smart contract language. It enables students to verify their eligibility for scholarships without exposing their raw GPA, family income, or personal documents to the scholarship portal.

---

## 💡 Product Concept & Proposal

### Chosen Idea: Age / Eligibility Gate
This project implements the **"Age / Eligibility Gate — prove a threshold without revealing the underlying value"** from the Level 3 approved idea list. 
ScholarShield acts as an eligibility gate for scholarships, proving that a student's GPA and Income meet specific thresholds without revealing the underlying numbers to the scholarship provider or the public ledger.

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

## 📄 Compact Smart Contract Source

The core of ScholarShield is the following Compact contract (`contracts/scholarship.compact`). It defines the public scholarship rules on the ledger and the private verification circuit:

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

### Compile Output (`contracts/managed/scholarship/`)

After running `yarn compile`, the Compact compiler generates the following artifacts in `contracts/managed/scholarship/`:

| Directory | Contents |
| :--- | :--- |
| `contract/` | `index.js` + `index.d.ts` — TypeScript API for the contract |
| `keys/` | `verify_eligibility.prover` + `.verifier` — ZK proving/verifying keys |
| `zkir/` | `verify_eligibility.zkir` + `.bzkir` — Intermediate representation for the ZK circuit |
| `compiler/` | `contract-info.json` — Metadata from the Compact compiler |

These files are committed to the repository and are used by both the test suite and the frontend dApp.

---

## 🔒 ZK Privacy Model: Public State vs. Private Witness

In the Compact smart contract:

*   **Public State (Ledger)**: The threshold limits set by the scholarship board. Specifically, `min_gpa` and `max_income`. These are transparent and stored on-chain for verifiability.
*   **Private Witness**: The student's actual GPA and family income. These remain local to the student's machine and are used strictly as private inputs to calculate the ZK proof.
*   **Selective Disclosure via `disclose()`**: We deliberately use `disclose()` in the constructor to publish the scholarship rules (`min_gpa` and `max_income`) to the ledger. In contrast, the student's inputs to `verify_eligibility` are private by default and are **never** passed to `disclose()`, keeping them entirely hidden from public eyes.

### 🛡️ Privacy Claims

| What an observer CAN see | What an observer CANNOT see |
| :--- | :--- |
| The scholarship's GPA threshold (`min_gpa`) | The student's actual GPA |
| The scholarship's income threshold (`max_income`) | The student's actual family income |
| That a valid ZK proof was submitted | Whether the student barely passed or exceeded thresholds by a large margin |
| The student's public wallet address (if linked to payout) | Any personal identity details |

1. **Mathematical Sufficiency**: The student proves that $GPA \ge min\_gpa$ and $Income \le max\_income$ using local WASM zero-knowledge circuit execution.
2. **Zero Information Leak**: The actual numeric value of the student's GPA and family income never leave the client's device, nor are they written to the public ledger.
3. **Observer Blindness**: External network validators, node operators, and third-party block explorers can only witness a valid transaction proof signature being registered on the Midnight blockchain. They learn absolutely nothing about the student's academic performance or financial situation.

---

## 🌐 Level 2: Live dApp on Preprod

### 🔗 Deployed Contract Address (Midnight Preprod)

The ScholarShield contract has been deployed to the **Midnight Preprod** network:

```
CONTRACT_ADDRESS: d13aabcf0599f9453f42637207303fb22ea0ed1f1bc8d34b56fe0f338da3287e
```

> **Verification**: The contract can be verified on the Midnight blockchain explorer by searching for the address above.

### 📺 Live Demo & Video Presentation

- **Live Application**: [https://scholar-shield-ten.vercel.app/](https://scholar-shield-ten.vercel.app/)
- **Demo Video**: [Watch on Google Drive](https://drive.google.com/file/d/1YUe91VBOKsM_-cpF4jBO_dhbyJyNmcWX/view?usp=sharing)

### 🎮 How to Use the Frontend dApp

1. Install the **1AM wallet** or **Lace wallet** browser extension and switch to the **Preprod** network.
2. Open the ScholarShield dApp.
3. Click **"Connect Wallet"** — the wallet status indicator will turn green.
4. In the **Student Portal**, enter your private GPA (scaled, e.g. `910` for 9.1) and your annual income in INR.
5. Click **"Verify Eligibility"** — a ZK proof is generated locally on your device using your private inputs.
6. The proof is submitted to the Midnight blockchain. The transaction will confirm that you meet the scholarship criteria **without revealing your GPA or income on-chain**.

---

## 📸 Project Showcase & Verification Proofs

### UI Showcase
![UI Screenshot 1](./sub%20assets/ui1.png)
![UI Screenshot 2](./sub%20assets/ui2.png)
![UI Screenshot 3](./sub%20assets/ui3.png)

### CI/CD Pipeline
![CI/CD Pipeline](./sub%20assets/cicd%20ss.png)

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

This generates compiled artifacts, proving/verifying keys, and TypeScript types under `contracts/managed/scholarship/`. These files are also committed to the repository for CI and reviewer verification.

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

### 4. Run the Frontend dApp (Level 2)

```bash
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser. You will need the **1AM wallet** or **Lace wallet** browser extension connected to the **Preprod** network.
