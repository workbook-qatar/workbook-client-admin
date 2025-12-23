# Workbook Client Admin - Deployment Guide

This project is configured for **Vercel** deployment with **Vite**.
The setup ensures an always-on public URL, automatic deployments on git push, and preview URLs for branches.

## 🚀 1. Push to GitHub

Since this is a new repository, push it to your GitHub account:

1.  **Create a new repository** on GitHub (e.g., `workbook-client-admin`).
    - _Do not_ initialize with README, .gitignore, or License (local repo already has them).
2.  **Push the code**:
    Run these commands in your terminal:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/workbook-client-admin.git
    git branch -M main
    git push -u origin main
    ```

## ⚡ 2. Deploy to Vercel

1.  Log in to [Vercel](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  **Import Git Repository**: Select the `workbook-client-admin` repo you just pushed.
4.  **Configure Project**:
    - **Framework Preset**: `Vite` (should auto-detect).
    - **Root Directory**: `client` (IMPORTANT: Edit this to be `client` if it isn't auto-detected, as `package.json` is there? NO, `package.json` is in root. Wait.)

    _Correction_: The `package.json` is in the **ROOT** directory. The `vite.config.ts` sets `root: 'client'`.
    - **Root Directory**: Leave as `./` (Root).
    - **Build Command**: `npm run build` (Default).
    - **Output Directory**: `dist/public` (Vercel might default to `dist`, change it to `dist/public` if needed. Check `vite.config.ts`: `outDir` is `dist/public`).
      - **Action**: In Vercel "Build & Development Settings", toggle "Output Directory" and set it to: `dist/public`.

5.  **Environment Variables**:
    Add the following in the Vercel Project Settings (Environment Variables):
    - `VITE_APP_TITLE`: `Workbook Admin`
    - `VITE_ANALYTICS_WEBSITE_ID`: (Optional)
    - `VITE_ANALYTICS_ENDPOINT`: (Optional)

6.  Click **Deploy**.

## 🌐 3. Verify Deployment

- **Production URL**: Vercel will provide a URL like `https://workbook-client-admin.vercel.app`.
- **Preview URLs**: When you create a Pull Request on GitHub, Vercel will auto-deploy a preview link.

## 🛠 Troubleshooting

- **Build Fails?** Check the "Build Logs" in Vercel. Common issue: "Output directory" mismatch. Ensure it is `dist/public`.
- **Blank Page?** Ensure `dist/public` is the correct output folder.
- **Env Vars Missing?** Warnings in build log are fine, but if the app needs them, add them in Vercel Settings.

---

**Status**: Local Git repository is ready. Proceed with Step 1.
