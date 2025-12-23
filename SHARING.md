# Sharing the Local Development Environment

We use **Cloudflare Tunnel** to securely share our local development instance with remote team members.

## Prerequisites

1.  **Node.js**: Ensure Node.js is installed.
2.  **Cloudflared**: This tool must be installed on your system to create the secure tunnel.

    **Windows**:
    The project is configured to automatically look for `cloudflared` in `C:\Program Files (x86)\cloudflared`.
    If you haven't installed it yet, open PowerShell and run:

    ```powershell
    winget install Cloudflare.cloudflared
    ```

    **Mac (Homebrew)**:

    ```bash
    brew install cloudflared
    ```

## How to Check Ports

Before starting, ensure port **3001** is free, as the project is configured to use it.

**If port 3001 is busy:**

1.  **Identify the process**:
    ```powershell
    netstat -ano | findstr :3001
    ```
2.  **Kill the process** (replace `<PID>` with the ID from the previous step):
    ```powershell
    taskkill /PID <PID> /F
    ```

## How to Share (Step-by-Step)

Open **two separate terminal windows** in the project directory (`client` folder):

### Terminal 1: Start the Dashboard

First, start the application locally on the fixed port (3001).

```bash
npm install
npm run dev
```

_Note: This will verify packages are installed and start the server at `http://localhost:3001`._

### Terminal 2: Create the Public Link

Once the server is running (Terminal 1 says "Ready" and confirms port 3001), run this command in the second terminal:

```bash
npm run share:cf
```

### Success!

Terminal 2 will display a unique URL that looks like:

> https://usd-eating-reliable-shine.trycloudflare.com

Copy and share this URL with your team. They can now access your local dashboard securely over the internet.

## Troubleshooting

**"Blocked request. This host (...) is not allowed"**:
This has been proactively fixed by setting `allowedHosts: true` in `vite.config.ts`. If you encounter this, restart the `npm run dev` server.
