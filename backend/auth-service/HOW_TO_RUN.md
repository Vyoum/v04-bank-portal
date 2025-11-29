# How to Run the Auth Service

## ⚠️ Important: Environment Variables Issue

When you run `mvn spring-boot:run` directly, it **does not load** the `.env` file, causing the application to try connecting to `localhost:5432` instead of your Supabase database.

## ✅ Solution: 3 Ways to Run

### **Option 1: Use `run.sh` (Recommended for .env)**

This script loads environment variables from `.env` before starting Maven:

```bash
cd /Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service
./run.sh
```

### **Option 2: Use `start.sh` (Explicit Export)**

This script explicitly exports all environment variables:

```bash
cd /Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service
./start.sh
```

### **Option 3: Use Spring Dev Profile (Easiest)**

This uses `application-dev.properties` which has Supabase credentials built-in:

```bash
cd /Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service
/opt/homebrew/bin/mvn spring-boot:run -Dspring.profiles.active=dev
```

Or add Maven to your PATH and use:
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

## 🔧 Why This Happens

| Command | Loads .env? | Uses Supabase? |
|---------|-------------|----------------|
| `mvn spring-boot:run` | ❌ No | ❌ No (tries localhost) |
| `./run.sh` | ✅ Yes | ✅ Yes |
| `./start.sh` | ✅ Yes | ✅ Yes |
| `mvn spring-boot:run -Dspring.profiles.active=dev` | N/A | ✅ Yes (hardcoded) |

## 📝 Files Created

1. **[.env](file:///Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service/.env)** - Environment variables (loaded by run.sh)
2. **[run.sh](file:///Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service/run.sh)** - Loads .env and runs Maven
3. **[start.sh](file:///Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service/start.sh)** - Explicitly exports vars and runs Maven
4. **[application-dev.properties](file:///Users/vyoumagarwaal/v04-bank-portal-1/backend/auth-service/src/main/resources/application-dev.properties)** - Dev profile with hardcoded Supabase config

## 🚀 Quick Start (Choose One)

**Easiest (recommended):**
```bash
./start.sh
```

**Or with Spring profile:**
```bash
/opt/homebrew/bin/mvn spring-boot:run -Dspring.profiles.active=dev
```

## ✅ Verification

Once started, test with:
```bash
curl http://localhost:8081/api/auth/health
```

Expected response:
```json
{"service":"auth-service","status":"UP"}
```

## 🔐 Security Note

> [!WARNING]
> `application-dev.properties` contains hardcoded credentials. This is for **development only**.
> For production, use environment variables or a secrets manager.
