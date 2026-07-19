# PeerPot

PeerPot is a social commitment platform where users can create goals (commitments) and pledge money to them. This project consists of a React frontend and a Base44 backend.

## Technology Stack
This diagram illustrates the core technologies and how they interact:
```text
+-------------------------------------------------------+
|                 Frontend (React + Vite)               |
|                                                       |
|  +-------------------+      +-------------------+     |
|  |   UI Components   |      |   State & Data    |     |
|  | (Tailwind, Radix) | ---> | (Query, Router)   |     |
|  +-------------------+      +-------------------+     |
|                                       |               |
|                                       v               |
|                             +-------------------+     |
|                             |     Payments      |     |
|                             |     (Unifold)     |     |
|                             +-------------------+     |
+-------------------------------------------------------+
                            |
                     (REST API via SDK)
                            v
+-------------------------------------------------------+
|                   Backend (Base44)                    |
|                                                       |
|                     +--------------+                  |
|                     |  Base44 SDK  |                  |
|                     +--------------+                  |
|                        /        \                     |
|                       /          \                    |
|                      v            v                   |
|       +-----------------+     +-----------------+     |
|       |    Entities     |     |    Functions    |     |
|       | (DB/Collections)|     | (Hosted Funcs)  |     |
|       +-----------------+     +-----------------+     |
+-------------------------------------------------------+
```

### Frontend
- **Framework:** React 18, Vite
- **Styling:** Tailwind CSS, Radix UI (shadcn/ui), Framer Motion
- **Routing:** React Router v6
- **Data Fetching:** TanStack React Query v5

### Backend
- **Platform:** Base44 (Managed Backend as a Service)
- **Entities (Models):** `User`, `Commitment`, `RecurringCommitment`, `Session`
- **Functions (Hosted):** `unifold-deposit` (integrates with Unifold API for USDC crypto deposits)
---

## Getting Started
Follow these steps to set up and run the PeerPot application locally.

### Prerequisites
1. **Node.js** (v18 or higher recommended)
2. **Git**
3. Install the Base44 CLI globally:
   ```bash
   npm install -g base44@latest
   ```
   *For more info, see the [Base44 CLI Docs](https://docs.base44.com/developers/references/cli/get-started/overview).*

### 1. Clone & Install dependencies
```bash
git clone <repository-url>
cd PeerPot
npm install
```

### 2. Run the Full Local Environment (Frontend + Backend)
Base44 can start both the local backend services and your Vite frontend development server simultaneously.

```bash
base44 dev
```

This command will:
- Spin up the local Base44 environment (Database, API, Functions).
- Inject local configuration so your frontend communicates with the local backend.
- Start the Vite dev server (usually available at `http://localhost:5173`).

### 3. Run Frontend Only (Connecting to Production Backend)
If you only want to work on UI changes against the hosted Base44 backend:

1. Create a `.env.local` file in the root directory.
2. Add your App ID and deployed backend URL:
   ```bash
   VITE_BASE44_APP_ID=your_app_id
   VITE_BASE44_APP_BASE_URL=https://your-app.base44.app
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```

---

## 📚 Related/Relevant Documents
- **Base44 GitHub Integration:** [docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)
- **CLI Reference:** [docs.base44.com/developers/references/cli/commands/introduction](https://docs.base44.com/developers/references/cli/commands/introduction)
- **Support:** [app.base44.com/support](https://app.base44.com/support)
