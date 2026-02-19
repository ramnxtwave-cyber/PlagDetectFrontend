# Plagiarism Detection Frontend

Modern React frontend for the Semantic Code Plagiarism Detection System.

## 🚀 Features

- **Submit Code**: Submit student code submissions with automatic embedding generation
- **Check Similarity**: Compare code against existing submissions with detailed results
- **Real-time Results**: View similarity scores, matched submissions, and code chunks
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Clear feedback during API calls
- **Form Validation**: Client-side validation with helpful error messages
- **Clean UI**: Modern design with Tailwind CSS

## 📋 Prerequisites

- **Node.js** 18+ (with npm)
- **Backend server** running on http://localhost:3000

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)

If your backend is on a different URL:

```bash
cp .env.example .env
# Edit .env and change VITE_API_URL
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will be available at: **http://localhost:5173**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── plagiarismApi.js    # API service layer
│   ├── components/
│   │   ├── Alert.jsx           # Alert messages
│   │   ├── Button.jsx          # Reusable button
│   │   ├── Card.jsx            # Card container
│   │   ├── ChunkCard.jsx       # Chunk similarity card
│   │   ├── CodeEditor.jsx      # Code input textarea
│   │   ├── Input.jsx           # Form input
│   │   └── SimilarityCard.jsx  # Submission similarity card
│   ├── pages/
│   │   ├── SubmitCode.jsx      # Submit code page
│   │   └── CheckSimilarity.jsx # Check similarity page
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── package.json
└── README.md
```

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons

## 📱 Pages

### 1. Submit Code (`/`)

Submit student code for analysis:
- Input: Student ID, Question ID, Code
- Features:
  - Language selection
  - Code editor with character/line count
  - Form validation
  - Success/error messages
  - Clear button to reset form

### 2. Check Similarity (`/check`)

Check code for plagiarism:
- Input: Question ID, Code, Similarity threshold
- Features:
  - Adjustable similarity threshold (50%-95%)
  - Maximum results configuration
  - Detailed similarity results
  - Summary statistics
  - Expandable code previews
  - Chunk-level matching

## 🔌 API Integration

The frontend communicates with the backend through the API service layer (`src/api/plagiarismApi.js`).

### Available API Functions:

```javascript
import { 
  checkHealth,           // Check server status
  submitCode,            // Submit code
  checkSimilarity,       // Check for plagiarism
  getSubmissionsByQuestion,  // Get all submissions
  getSubmissionById      // Get specific submission
} from './api/plagiarismApi';
```

### Example Usage:

```javascript
// Submit code
const result = await submitCode({
  studentId: 'student123',
  questionId: 'q1',
  code: 'function add(a, b) { return a + b; }',
  language: 'javascript'
});

// Check similarity
const result = await checkSimilarity({
  questionId: 'q1',
  code: 'const sum = (x, y) => x + y;',
  similarityThreshold: 0.75,
  maxResults: 5
});
```

## 🎯 Components Guide

### Reusable Components

#### Button
```jsx
<Button 
  variant="primary"     // primary, secondary, danger, success, outline
  loading={isLoading}   // Shows spinner
  disabled={false}
  fullWidth={false}
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Input
```jsx
<Input
  label="Student ID"
  name="studentId"
  value={value}
  onChange={handleChange}
  required={true}
  error={errorMessage}
  placeholder="Enter ID"
/>
```

#### CodeEditor
```jsx
<CodeEditor
  label="Your Code"
  value={code}
  onChange={handleChange}
  rows={15}
  error={errorMessage}
  required={true}
/>
```

#### Alert
```jsx
<Alert
  type="success"        // success, error, warning, info
  message="Code submitted!"
  onClose={handleClose}
/>
```

## 🎨 Styling

The project uses **Tailwind CSS** for styling with a custom configuration:

### Custom Colors:
- **Primary**: Blue shades (#0ea5e9)
- **Danger**: Red shades (#ef4444)
- **Success**: Green shades (#22c55e)

### Responsive Breakpoints:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

## 🔧 Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Lint Code
```bash
npm run lint
```

## 📊 User Flow

### Submit Code Flow:
1. Navigate to "Submit Code" (/)
2. Enter Student ID and Question ID
3. Paste or type code in editor
4. Click "Save Submission"
5. System processes and generates embeddings
6. Success message with submission ID displayed

### Check Similarity Flow:
1. Navigate to "Check Similarity" (/check)
2. Enter Question ID
3. Paste code to check
4. Adjust similarity threshold (optional)
5. Click "Check for Plagiarism"
6. View results:
   - Summary statistics
   - Similar submissions with scores
   - Matched code chunks
7. Expand cards to view full code

## ⚠️ Error Handling

The frontend handles various error scenarios:

- **Network errors**: Backend unreachable
- **Validation errors**: Empty fields, invalid input
- **API errors**: Backend returns error response
- **Server offline**: Status banner shown

All errors display user-friendly messages with suggestions.

## 🔍 Understanding Results

### Similarity Levels:

| Score | Level | Interpretation |
|-------|-------|----------------|
| 95%+ | Very High | Nearly identical code |
| 85-95% | High | Very similar implementation |
| 75-85% | Moderate | Similar approach |
| 60-75% | Low | Same algorithm |
| <60% | Different | Different implementations |

### Result Components:

1. **Summary**: Overall statistics
2. **Similar Submissions**: Whole-code matches
3. **Similar Chunks**: Function-level matches

## 🚨 Troubleshooting

### Issue: "Unable to connect to backend"
**Solution**: Ensure backend is running on http://localhost:3000
```bash
cd ..  # Go to backend directory
npm start
```

### Issue: Blank page
**Solution**: Check browser console for errors
```bash
npm run dev  # Restart dev server
```

### Issue: Styles not loading
**Solution**: Rebuild Tailwind CSS
```bash
npm run build
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or change port in `vite.config.js`

## 📝 Best Practices

1. **Code Organization**: Keep components small and focused
2. **State Management**: Use local state for page-specific data
3. **Error Handling**: Always handle API errors gracefully
4. **Loading States**: Show loading indicators for async operations
5. **Validation**: Validate on both client and server
6. **Accessibility**: Use semantic HTML and ARIA labels
7. **Responsiveness**: Test on multiple screen sizes

## 🔐 Security Notes

For production deployment:

- Add authentication (JWT/OAuth)
- Implement rate limiting
- Sanitize user input
- Use HTTPS only
- Add CORS configuration
- Implement CSP headers

## 📦 Deployment

### Build for Production:
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deploy Options:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Configure in `vite.config.js`
- **Docker**: Create Dockerfile with nginx

## 🤝 Contributing

The code is structured to be beginner-friendly:
- Clear component names
- Extensive comments
- Consistent patterns
- Reusable components

## 📄 License

MIT

---

**Built with ❤️ using React, Vite, and Tailwind CSS**

