# Component Guide for Interns

Learn how each component works and how to use them in your own features.

## 🧩 Reusable Components

### 1. Button Component

**Location**: `src/components/Button.jsx`

**Purpose**: Reusable button with different variants and loading states

**Props**:
```javascript
{
  children: ReactNode,       // Button text/content
  onClick: Function,         // Click handler
  type: 'button' | 'submit', // Button type
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline',
  disabled: boolean,
  loading: boolean,          // Shows spinner
  fullWidth: boolean,
  className: string          // Additional CSS classes
}
```

**Examples**:
```jsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>

// Loading button
<Button loading={isLoading} disabled={isLoading}>
  Submitting...
</Button>

// Full width submit button
<Button type="submit" fullWidth variant="success">
  Save
</Button>
```

---

### 2. Input Component

**Location**: `src/components/Input.jsx`

**Purpose**: Text input with label, validation, and error display

**Props**:
```javascript
{
  label: string,
  name: string,
  value: string,
  onChange: Function,
  placeholder: string,
  type: 'text' | 'email' | 'password' | 'number',
  required: boolean,
  error: string,            // Error message to display
  disabled: boolean,
  className: string
}
```

**Example**:
```jsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  label="Email Address"
  name="email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="user@example.com"
  required
  error={error}
/>
```

---

### 3. CodeEditor Component

**Location**: `src/components/CodeEditor.jsx`

**Purpose**: Large textarea for code input with character/line count

**Props**:
```javascript
{
  label: string,
  value: string,
  onChange: Function,
  placeholder: string,
  rows: number,             // Height in rows
  error: string,
  required: boolean,
  disabled: boolean
}
```

**Example**:
```jsx
const [code, setCode] = useState('');

<CodeEditor
  label="Your Code"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  rows={15}
  placeholder="Enter your code here..."
  required
/>
```

---

### 4. Alert Component

**Location**: `src/components/Alert.jsx`

**Purpose**: Display success, error, warning, or info messages

**Props**:
```javascript
{
  type: 'success' | 'error' | 'warning' | 'info',
  message: string,
  onClose: Function,        // Optional close handler
  className: string
}
```

**Example**:
```jsx
const [alert, setAlert] = useState(null);

// Show alert
setAlert({
  type: 'success',
  message: 'Operation completed successfully!'
});

// Render alert
{alert && (
  <Alert
    type={alert.type}
    message={alert.message}
    onClose={() => setAlert(null)}
  />
)}
```

---

### 5. Card Component

**Location**: `src/components/Card.jsx`

**Purpose**: Container for content sections

**Props**:
```javascript
{
  children: ReactNode,
  title: string,            // Optional header title
  className: string,
  noPadding: boolean        // Remove default padding
}
```

**Example**:
```jsx
<Card title="User Profile">
  <p>Name: John Doe</p>
  <p>Email: john@example.com</p>
</Card>

<Card noPadding>
  <img src="banner.jpg" alt="Banner" />
</Card>
```

---

### 6. SimilarityCard Component

**Location**: `src/components/SimilarityCard.jsx`

**Purpose**: Display a submission similarity result

**Props**:
```javascript
{
  submission: {
    submissionId: number,
    studentId: string,
    similarity: number,      // 0-1
    codePreview: string,
    codeLength: number
  },
  index: number             // Position in list
}
```

**Example**:
```jsx
{similarSubmissions.map((submission, index) => (
  <SimilarityCard
    key={submission.submissionId}
    submission={submission}
    index={index}
  />
))}
```

---

### 7. ChunkCard Component

**Location**: `src/components/ChunkCard.jsx`

**Purpose**: Display a matched code chunk

**Props**:
```javascript
{
  chunk: {
    submissionId: number,
    studentId: string,
    similarity: number,
    queryChunkPreview: string,
    matchedChunkText: string,
    matchedChunkIndex: number
  },
  index: number
}
```

**Example**:
```jsx
{similarChunks.map((chunk, idx) => (
  <ChunkCard
    key={`chunk-${idx}`}
    chunk={chunk}
    index={idx}
  />
))}
```

---

## 📄 Page Components

### 1. SubmitCode Page

**Location**: `src/pages/SubmitCode.jsx`

**What it does**:
- Allows students to submit code
- Validates input
- Calls `/api/submit` endpoint
- Shows success/error messages

**Key Functions**:
```javascript
handleSubmit(e)     // Form submission
validateForm()      // Client-side validation
handleChange(e)     // Input change handler
```

**State Management**:
```javascript
formData: {
  studentId: string,
  questionId: string,
  code: string,
  language: string
}
```

---

### 2. CheckSimilarity Page

**Location**: `src/pages/CheckSimilarity.jsx`

**What it does**:
- Checks code for plagiarism
- Displays similarity results
- Shows matched submissions and chunks
- Configurable threshold

**Key Functions**:
```javascript
handleSubmit(e)     // Form submission
validateForm()      // Client-side validation
```

**Results Structure**:
```javascript
results: {
  summary: {
    totalMatchedSubmissions: number,
    highSimilarity: number,
    moderateSimilarity: number,
    maxSimilarity: number
  },
  similarSubmissions: Array,
  similarChunks: Array
}
```

---

## 🔌 API Service

**Location**: `src/api/plagiarismApi.js`

### Available Functions:

#### 1. checkHealth()
```javascript
const result = await checkHealth();
// Returns: { success: true, data: {...} }
```

#### 2. submitCode(data)
```javascript
const result = await submitCode({
  studentId: 'student123',
  questionId: 'q1',
  code: 'function add(a, b) { return a + b; }',
  language: 'javascript'
});
// Returns: { success: true, data: { submissionId, chunkCount, ... } }
```

#### 3. checkSimilarity(data)
```javascript
const result = await checkSimilarity({
  questionId: 'q1',
  code: 'const sum = (x, y) => x + y;',
  similarityThreshold: 0.75,
  maxResults: 5
});
// Returns: { success: true, data: { summary, similarSubmissions, ... } }
```

#### 4. getSubmissionsByQuestion(questionId)
```javascript
const result = await getSubmissionsByQuestion('q1');
// Returns: { success: true, data: { submissions: [...] } }
```

#### 5. getSubmissionById(id)
```javascript
const result = await getSubmissionById(42);
// Returns: { success: true, data: { submission: {...} } }
```

### Error Handling:
All API functions return:
```javascript
{
  success: boolean,
  data?: any,
  error?: string
}
```

Always check `success` before using `data`:
```javascript
const result = await submitCode(data);

if (result.success) {
  // Use result.data
  console.log('Success!', result.data);
} else {
  // Handle error
  console.error('Error:', result.error);
}
```

---

## 🎨 Styling Guidelines

### Tailwind CSS Classes

**Common Patterns**:

```javascript
// Container
<div className="max-w-4xl mx-auto px-4">

// Card
<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">

// Button
<button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">

// Input
<input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

// Flex
<div className="flex items-center justify-between gap-4">
```

### Custom Colors:
- `primary-500`, `primary-600`, `primary-700` - Blue
- `danger-500`, `danger-600` - Red
- `success-500`, `success-600` - Green

---

## 📝 Creating a New Page

### Step 1: Create page file

**`src/pages/MyNewPage.jsx`**:
```jsx
import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';

const MyNewPage = () => {
  const [data, setData] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My New Page</h1>
      
      <Card>
        <form onSubmit={handleSubmit}>
          {/* Form content */}
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
};

export default MyNewPage;
```

### Step 2: Add route in App.jsx

```jsx
import MyNewPage from './pages/MyNewPage';

// In Routes component:
<Route path="/my-page" element={<MyNewPage />} />
```

### Step 3: Add navigation link

```jsx
<Link to="/my-page" className={linkClass('/my-page')}>
  My Page
</Link>
```

---

## 🔍 Debugging Tips

### 1. Check Browser Console
Open DevTools (F12) and look for errors

### 2. Check Network Tab
See API requests and responses

### 3. Add Console Logs
```javascript
console.log('State:', formData);
console.log('API Result:', result);
```

### 4. React DevTools
Install React DevTools extension to inspect component state

---

## ✅ Best Practices

1. **Always validate input** before API calls
2. **Show loading states** during async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Keep components small** and focused on one thing
5. **Reuse components** instead of duplicating code
6. **Use meaningful variable names**
7. **Add comments** for complex logic
8. **Test on different screen sizes**

---

## 🎓 Learning Resources

- React Docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/docs/intro

---

Happy coding! 🚀

