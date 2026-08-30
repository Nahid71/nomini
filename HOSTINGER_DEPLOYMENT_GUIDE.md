# 🚀 Complete Hostinger Deployment Guide for Nomini Group Platform

This guide provides step-by-step instructions to deploy the complete **Nomini Group Digital Platform** (Next.js 14 Frontend + NestJS Backend + PostgreSQL + Prisma ORM) on **Hostinger**.

---

## 📋 What You Need Before You Start

1. **Hostinger Account & VPS Plan**:
   - **Recommended Plan**: Hostinger KVM VPS (KVM 1 or KVM 2 with Ubuntu 22.04 or 24.04 LTS).
2. **Domain Name**:
   - Registered domain (e.g., `nominigroup.com`).
3. **DNS Configuration (Hostinger DNS Zone Editor)**:
   - Point your domain's **A Record** to your Hostinger VPS IP address:
     - `@` -> `YOUR_SERVER_IP`
     - `www` -> `YOUR_SERVER_IP`

---

## 🛠️ Method 1: Hostinger VPS Deployment with Docker (Recommended)

This is the fastest, most reliable, and isolated deployment method.

### Step 1: Connect to your Hostinger VPS via SSH
Open your terminal (macOS/Linux) or Command Prompt/PowerShell (Windows):
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Docker & Git on the Server
Run the following commands on your Hostinger server:
```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Install Docker, Docker Compose plugin & Git
sudo apt install -y git curl ufw
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install -y docker-compose-plugin
```

### Step 3: Clone / Upload the Codebase to the Server
```bash
# Navigate to web root directory
cd /var/www

# Clone your repository (or upload the project folder)
git clone <YOUR_GIT_REPO_URL> nomini
cd nomini
```

*(Alternatively, if you haven't pushed to git yet, upload the project directory using SCP/SFTP: `scp -r /Users/nahidbabu/src/nomini root@YOUR_SERVER_IP:/var/www/nomini`)*

### Step 4: Configure Production Environment Variables
Create the production `.env` file:
```bash
cp .env.example .env
nano .env
```
Update with strong production credentials:
```env
POSTGRES_USER=nomini_user
POSTGRES_PASSWORD=YourSuperStrongDbPassword2026!
POSTGRES_DB=nomini_db

JWT_SECRET=Your64CharRandomSecretKeyForJWTAuth2026!
JWT_EXPIRES_IN=7d

DOMAIN_NAME=nominigroup.com
NEXT_PUBLIC_API_URL=https://nominigroup.com
```
*(Press `Ctrl + O` to save, then `Ctrl + X` to exit nano)*

### Step 5: Run the Automated Deployment Script
```bash
./deploy.sh
```
This single command will:
1. Build the production backend container and Prisma client.
2. Build the Next.js standalone frontend container.
3. Start PostgreSQL with persistent data volumes.
4. Apply Prisma database migrations and seed default administrative users and demo data.

---

## 🔒 Setting Up Nginx Reverse Proxy & Free SSL (Certbot)

To link your domain (`nominigroup.com`) with automatic HTTPS/SSL to ports `3000` (Frontend) and `4000` (Backend API):

### Step 1: Install Nginx & Certbot
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Step 2: Configure Nginx Site Configuration
```bash
# Copy the prepared Nginx configuration
sudo cp nginx/nomini.conf /etc/nginx/sites-available/nominigroup.com

# Replace 'yourdomain.com' with your actual domain
sudo sed -i 's/yourdomain.com/nominigroup.com/g' /etc/nginx/sites-available/nominigroup.com

# Enable the site and test configuration
sudo ln -s /etc/nginx/sites-available/nominigroup.com /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default || true
sudo nginx -t
sudo systemctl reload nginx
```

### Step 3: Issue Free SSL Certificate with Certbot
```bash
sudo certbot --nginx -d nominigroup.com -d www.nominigroup.com
```
*(Certbot will automatically obtain the Let's Encrypt certificate and configure auto-renewal)*

### Step 4: Configure Firewall (UFW)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔑 Default Initialized Logins (Seeded)

Once deployed, you can immediately log into the platform:

| Role | Email | Default Password | Notes |
| :--- | :--- | :--- | :--- |
| **Admin (CEO)** | `wares.ceo@nominigroup.com` | `NominiPass2026!` | Full Admin Privileges (Products, Crowdfarm, Financial Plan, Staff) |
| **Employee (COO)** | `anwar.coo@nominigroup.com` | `NominiPass2026!` | Operations, Tasks & Product Management |
| **Farm Operator** | `tariq.operator@nominigroup.com` | `NominiPass2026!` | Fulbari Plot Operations & Batch Logging |
| **Investor** | `elena.investor@nominigroup.com` | `NominiPass2026!` | Crowdfarming Share Purchases & Certificates |
| **Customer** | `alex.buyer@nominigroup.com` | `NominiPass2026!` | E-Commerce Orders & DPP Inspection |
| **Supplier** | `kamal.supplier@nominigroup.com` | `NominiPass2026!` | Raw Material Supplier Portal |

---

## 🛠️ Maintenance & Useful Production Commands

### View Live Logs
```bash
# View all service logs
docker compose -f docker-compose.prod.yml logs -f

# View backend logs only
docker compose -f docker-compose.prod.yml logs -f backend

# View frontend logs only
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Restart Services
```bash
docker compose -f docker-compose.prod.yml restart
```

### Pull & Deploy Future Updates
```bash
cd /var/www/nomini
./deploy.sh
```

### Backup Database
```bash
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump -U nomini_user nomini_db > nomini_backup_$(date +%Y%m%d).sql
```

