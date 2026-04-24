# BFHL Graph Hierarchy API — Full Stack Solution

A full-stack coding-challenge submission: a REST API that builds directed-graph hierarchies and detects cycles, plus a polished visualizer frontend.

---

## Project Structure

```
/backend
  server.js        ← Express API (POST /bfhl)
  package.json
/frontend
  index.html       ← Vanilla-JS single-file UI
README.md
```

---

## Quick Start (Local)

### 1. Run the Backend

```bash
cd backend
npm install
npm start          # → http://localhost:5000
```

Or use `npm run dev` (uses nodemon for auto-reload).

### 2. Open the Frontend

Open `frontend/index.html` directly in your browser (no server needed for local dev).

The frontend auto-detects `localhost` and sends requests to `http://localhost:5000/bfhl`.

---

## API Reference

### `POST /bfhl`

**Request**
```json
{ "data": ["A->B", "A->C", "B->D"] }
```

**Response**
```json
{
  "user_id": "yourname_ddmmyyyy",
  "email_id": "your@email.com",
  "college_roll_number": "YOURROLL",
  "hierarchies": [ ... ],
  "invalid_entries": [ ... ],
  "duplicate_edges": [ ... ],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

### `GET /bfhl`
Returns `{ "operation_code": 1 }` — health check.

---

## 🚀 Deploy to GitHub + Vercel

If you want to deploy BOTH the frontend and backend on Vercel, use the instructions below. 
Both will be created as separate projects stemming from the same GitHub repository.

### Step 1 — Push to GitHub

Run these commands in your root terminal (`Bajaj-Finserv/`):
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VedantSinngh/bfhl-graph-hierarchy.git
git branch -M main
git push -u origin main
```
*(You've already set up the repo correctly as seen in your local terminal!)*

---

### Step 2 — Deploy Backend to Vercel

1. Go to **vercel.com** → **Add New Project**.
2. Select your repository: `bfhl-graph-hierarchy`.
3. In the Configuration screen:
   - Expand **Root Directory** and pick `backend`.
4. Leave everything else as default and hit **Deploy**.
5. Once complete, click on the **Dashboard** and copy the assigned domain URL (e.g., `https://bfhl-graph-hierarchy-backend.vercel.app`).

---

### Step 3 — Deploy Frontend to Vercel

1. Go back to your Vercel Dashboard → **Add New Project**.
2. Select the same repository again: `bfhl-graph-hierarchy`.
3. In the Configuration screen:
   - Expand **Root Directory** and pick `frontend`.
   - The Framework Preset should auto-detect as **Vite**.
4. Open the **Environment Variables** drop-down:
   - Add `VITE_API_BASE_URL` 
   - Paste the backend URL from Step 2 (e.g., `https://bfhl-graph-hierarchy-backend.vercel.app`).
   > ⚠️ Make sure there is **no `/bfhl`** at the end of the URL.
5. Hit **Deploy**.

Done! Your frontend builds statically, and your backend functions run as Vercel Serverless endpoints automatically because of the `vercel.json` config inside the backend directory.

---

## Verification — Expected Output

**Input:**
```json
["A->B","A->C","B->D","C->E","E->F","X->Y","Y->Z","Z->X","P->Q","Q->R","G->H","G->H","G->I","hello","1->2","A->"]
```

**Expected `hierarchies`:**
| Root | Type  | Depth |
|------|-------|-------|
| A    | Tree  | 4     |
| X    | Cycle | —     |
| P    | Tree  | 3     |
| G    | Tree  | 2     |

**Expected summary:** `{ total_trees: 3, total_cycles: 1, largest_tree_root: "A" }`

---

## Before Submission — Replace Placeholders

In `backend/server.js`, update these three lines:

```js
user_id             : 'yourname_ddmmyyyy',   // e.g. 'john_01012000'
email_id            : 'your@email.com',
college_roll_number : 'YOURROLL',
```

---

## Performance Notes

- All in-memory processing — no database.
- Cycle detection via iterative DFS colouring — O(V+E).
- Handles 50 nodes comfortably in < 10 ms.
