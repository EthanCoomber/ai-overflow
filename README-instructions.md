
# Full-Stack Q&A Application

This repository contains a full-stack application with a TypeScript-based Express server and a React frontend. Below are instructions to test, run, and analyze the application.

---

## 🟢 Test the Deployed Application on Render

1. Visit the deployed application at [https://final-project-ethan-rachana.onrender.com/](https://final-project-ethan-rachana.onrender.com/)
2. Test all key user flows:
   - Navigate across pages
   - Submit forms (e.g., login, register, post question)
   - Verify network requests via DevTools

---

## 🧪 Run Jest and Cypress Test Cases

### ✅ Jest Unit Tests

#### Server
```bash
cd server
npm install
npm test
```

#### Client
```bash
cd client
npm install
npm test
```

---

### 🧪 Cypress End-to-End Tests (Client)

**Open GUI:**
```bash
cd client
npm run cypress:open
```

**Run headless:**
```bash
npm run cypress:run
```

---

## 📊 Generate Coverage Report for Jest Tests

### Server
```bash
cd server
npx jest --coverage
```

### Client
```bash
cd client
npx jest --coverage
```

> View results in `coverage/lcov-report/index.html`

---

## 🛡️ Generate CodeQL Report (Server)

> Ensure [CodeQL CLI](https://github.com/github/codeql-cli-binaries) is installed.

### 1. Create CodeQL Database
```bash
cd server
codeql database create codeql-db --language=javascript --command="npm run build"
```

### 2. Run Analysis
```bash
codeql database analyze codeql-db \
  path-to-codeql-repo/javascript/ql/src/codeql-suites/javascript-code-scanning.qls \
  --format=sarifv2.1.0 \
  --output=codeql-report.sarif
```

> You can upload the `.sarif` file to GitHub's **Security > Code scanning alerts** tab.

---

## 🔧 Set Environment Variables

Create a `.env` file in the `server/` and/or `client/` directory.

### Example `.env` for Server:
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/fake_so
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
```

> These will be automatically loaded by the `dotenv` package.

### In GitHub Actions:
```yaml
env:
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

Or for specific steps:
```yaml
- name: Run tests
  run: npm test
  env:
    NODE_ENV: test
    MONGODB_URI: ${{ secrets.MONGODB_URI }}
```

---

## 📂 Project Structure

```
.
├── client/             # React frontend
├── server/             # Express backend (TypeScript)
.
```

---

## 🛠 Requirements

- Node.js 18+
- MongoDB
- Render account (for deployment)
- GitHub (for CodeQL integration)
