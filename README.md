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

## Deploy to Render (Backend)

1. Push the repo to GitHub.
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your repository.
4. Set **Root Directory** to `backend`.
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Set **Environment**: `NODE_ENV=production`
8. Copy your Render URL (e.g. `https://bfhl-backend.onrender.com`).

> **Then** open `frontend/index.html`, find the `API_URL` variable and replace `YOUR-BACKEND-URL`:
> ```js
> : 'https://YOUR-BACKEND-URL.onrender.com/bfhl'
> ```

---

## Deploy Frontend to Vercel

```bash
npm i -g vercel
cd frontend
vercel --prod
```

Vercel will serve `index.html` as a static site. No build step required.

### Or Netlify (Drag & Drop)
1. Go to [app.netlify.com](https://app.netlify.com) → **Sites** → **Add new site** → **Deploy manually**.
2. Drag the `frontend/` folder into the drop zone.
3. Done — Netlify gives you a live URL instantly.

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
