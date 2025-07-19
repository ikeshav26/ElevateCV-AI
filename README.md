# ElevateCV-AI

ElevateCV-AI is a full-stack web application that helps users generate professional resumes and cover letters using AI. It features user authentication, profile management, and the ability to download or share generated documents.

## Features
- AI-powered resume and cover letter generation
- User authentication and session management
- Profile page with saved resumes and letters
- Download  options for documents
- Public/private visibility toggles
- Responsive, modern UI

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Axios, React Hot Toast
- **Backend:** Node.js, Express, MongoDB, Cloudinary

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/ikeshav26/ElevateCV-AI.git
   cd ElevateCV-AI
   ```

2. **Install dependencies:**
   - For backend:
     ```sh
     cd backend
     npm install
     ```
   - For frontend:
     ```sh
     cd ../frontend
     npm install
     ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders and fill in the required values (API URLs, MongoDB URI, Cloudinary keys, etc).

4. **Run the app:**
   - Start backend:
     ```sh
     cd backend
     npm start
     ```
   - Start frontend:
     ```sh
     cd ../frontend
     npm run dev
     ```
   - The frontend will typically run on `http://localhost:5173` and backend on `http://localhost:5000` (or as configured).

## Folder Structure
```
backend/
  src/
    config/
    controller/
    middlewares/
    models/
    routes/
frontend/
  src/
    assets/
    pages/
    context/
    App.jsx
    main.jsx
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

## Author
- [ikeshav26](https://github.com/ikeshav26)
