# Supabase Connection Troubleshooting

## Current Issue

**Error:** `No route to host` when connecting to Supabase database

## Diagnosis

The auth-service cannot connect to `db.qycxqjoctkdvcihmqoke.supabase.co:5432`

### Possible Causes:

1. **Supabase Project Paused** (Most Likely)
   - Free tier projects pause after 7 days of inactivity
   - Solution: Resume the project in Supabase dashboard

2. **Network Connectivity Issue**
   - Firewall blocking connection
   - DNS resolution problem

3. **Incorrect Database Host**
   - Host may have changed
   - Need to verify from Supabase dashboard

## How to Fix

### Step 1: Check Supabase Project Status

1. Go to https://app.supabase.com
2. Select your project: `qycxqjoctkdvcihmqoke`
3. Check the status indicator:
   - 🟢 **Active** - Project is running
   - ⏸️ **Paused** - Project is paused (click Resume)
   - ❌ **Deleted** - Need to create new project

### Step 2: Resume Project (if paused)

1. Click the **Resume** button
2. Wait for project to become active (may take 1-2 minutes)

### Step 3: Verify Connection Details

1. Go to **Settings** → **Database**
2. Check the **Connection string**:
   ```
   postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
3. Verify the host matches: `db.qycxqjoctkdvcihmqoke.supabase.co`

### Step 4: Restart Auth Service

Once Supabase is active:

```bash
cd /Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service
./start.sh
```

## Current Architecture Status

| Service | Port | Status |
|---------|------|--------|
| Frontend | 3000 | ✅ Running |
| API Gateway | 8080 | ✅ Running |
| Auth Service | 8081 | ❌ Can't start (DB issue) |
| Supabase | 5432 | ❓ Unknown (check dashboard) |

## What's Working

✅ Frontend configured correctly  
✅ API Gateway running and routing  
✅ CORS configured properly  
❌ Database connection failing

## Next Steps

1. Check Supabase project status
2. Resume if paused
3. Restart auth-service
4. Test registration through frontend
