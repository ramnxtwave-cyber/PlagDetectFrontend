# Frontend Quick Start - 2 Minutes

Get the React frontend running in 2 minutes!

## Prerequisites

✅ Node.js 18+ installed  
✅ Backend server running on http://localhost:3000

## Steps

### 1. Install Dependencies (1 minute)

```bash
cd frontend
npm install
```

### 2. Start Development Server (30 seconds)

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 3. Open in Browser (30 seconds)

Open **http://localhost:5173** in your browser.

You should see the Plagiarism Detection System with two pages:
- 📝 Submit Code
- 🔍 Check Similarity

## Quick Test

### Test 1: Submit Code

1. Click "Submit Code" (or go to `/`)
2. Fill in:
   - Student ID: `test-student-1`
   - Question ID: `fibonacci`
   - Code: 
   ```javascript
   function fib(n) {
     if (n <= 1) return n;
     return fib(n-1) + fib(n-2);
   }
   ```
3. Click "Save Submission"
4. Wait 2-3 seconds for success message

### Test 2: Check Similarity

1. Click "Check Similarity" (or go to `/check`)
2. Fill in:
   - Question ID: `fibonacci`
   - Code:
   ```javascript
   const fibonacci = (num) => {
     if (num < 2) return num;
     return fibonacci(num-1) + fibonacci(num-2);
   };
   ```
3. Click "Check for Plagiarism"
4. View similarity results!

## Troubleshooting

### Red banner: "Unable to connect to backend server"
**Solution**: Start the backend server
```bash
cd ..  # Go back to project root
npm start
```

### Port 5173 already in use
**Solution**: Kill the process
```bash
lsof -ti:5173 | xargs kill -9
```

Or change port in `vite.config.js`:
```javascript
server: {
  port: 5174,  // Change to different port
  ...
}
```

### Blank page
**Solution**: Check browser console (F12) for errors

## Next Steps

- Read full documentation: `README.md`
- Customize components in `src/components/`
- Modify pages in `src/pages/`
- Adjust styling in `src/index.css`

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

That's it! You're ready to use the plagiarism detection frontend. 🎉

