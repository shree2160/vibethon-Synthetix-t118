# 🚀 Synthetix Deployment Guide (Vercel)

Follow these steps to deploy your full-stack AI Learning Platform to Vercel.

## 1. 📂 Prepare your Configuration
Vercel needs to know how to handle your frontend and backend separately. 

### Create `vercel.json` in the Root Directory
Create a `vercel.json` file in the **root** of your project (the same level as `frontend/` and `backend/`):

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    },
    {
      "source": "/(.*)",
      "destination": "/frontend/dist/$1"
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/frontend/dist/index.html"
    }
  ]
}
```

---

## 2. 🐍 Configure the Backend (Serverless)
Vercel runs Python as serverless functions. You need to create an `api/index.py` file in your root that imports your FastAPI app.

### Create `api/index.py` (Root)
```python
from backend.main import app
```

### Update `requirements.txt`
Ensure your `requirements.txt` is in the root or a path Vercel can find. It must include `fastapi`, `uvicorn`, and `mangum` (if you use an adapter) or simply `fastapi`.

---

## 3. ⚛️ Configure the Frontend
In your Vercel project settings, you will need to set the **Root Directory** to `frontend`.

### Build Settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 4. 🔐 Environment Variables
This is the most critical step. In the Vercel Dashboard, go to **Settings > Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `DATABASE_URL` | Your Supabase Connection String (for backend) |

---

## 5. 🛫 The Deployment
1. Connect your GitHub repository to Vercel.
2. Select your `Synthetix` repo.
3. Vercel will auto-detect the project. Click **Deploy**.

> [!TIP]
> Once deployed, your frontend will be live at `https://your-project.vercel.app` and your backend API will be available at `https://your-project.vercel.app/api`.
