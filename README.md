# Shift Management System

A full-stack web application for managing employee shifts and schedules. Built as a learning project to practice REST API design, database operations, and React development. Built with the help of Claude.

## 📋 Features

- **Employee Management**
  - Create, read, update, and delete employee records
  - Store employee information (name, role, email, phone)
  - View all employees in one place

- **Shift Scheduling**
  - Create and manage work shifts
  - Assign employees to specific shifts
  - Track shift details (date, time, position, notes)
  - Filter shifts by date or employee

- **RESTful API**
  - Clean API endpoints for all operations
  - JSON responses
  - Error handling for common scenarios

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Create React App
- JavaScript (ES6+)

**Backend:**
- Node.js
- Express.js
- SQLite3
- CORS middleware

## 📁 Project Structure

```
shift_management_project/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── shifts.db          # SQLite database file
│   └── package.json       # Backend dependencies
│
└── frontend/
    ├── src/               # React source files
    ├── public/            # Static files
    └── package.json       # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation & Setup

**1. Clone the repository**
```bash
git clone <your-repo-url>
cd shift_management_project
```

**2. Set up the Backend**
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:3001`

**3. Set up the Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm start
```
The React app will open at `http://localhost:3000`

### Database

The SQLite database (`shifts.db`) is created automatically when you first run the backend. It includes two tables:

- **employees** - stores employee information
- **shifts** - stores shift schedules with foreign key to employees

## 📡 API Endpoints

### Employees

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Shifts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shifts` | Get all shifts (supports ?date= and ?employee_id= filters) |
| GET | `/api/shifts/:id` | Get single shift |
| POST | `/api/shifts` | Create new shift |
| PUT | `/api/shifts/:id` | Update shift |
| DELETE | `/api/shifts/:id` | Delete shift |

### Example Request Bodies

**Create Employee:**
```json
{
  "name": "John Doe",
  "role": "Server",
  "email": "john@example.com",
  "phone": "555-0123"
}
```

**Create Shift:**
```json
{
  "date": "2024-03-15",
  "start_time": "09:00",
  "end_time": "17:00",
  "position": "Server",
  "employee_id": 1,
  "notes": "Morning shift"
}
```

## 🎯 Learning Goals

This project was built to practice:
- Building a REST API from scratch
- Working with SQL databases
- Connecting frontend and backend
- CRUD operations
- Error handling
- Asynchronous JavaScript

## 🔍 What I'm Looking for Feedback On

I'm a self-taught beginner (5 months of coding) and would love feedback on:

- **API Design** - Are my endpoints following RESTful best practices?
- **Database Structure** - Is my schema appropriate? Any normalization issues?
- **Security** - What vulnerabilities should I address?
- **Code Organization** - How can I better structure my code?
- **Error Handling** - Am I handling errors properly?
- **Best Practices** - What conventions or patterns am I missing?

Any constructive criticism is greatly appreciated!

## 🚧 Known Limitations / Future Improvements

- [ ] No authentication/authorization
- [ ] No input validation/sanitization
- [ ] Frontend not yet implemented (API only)
- [ ] No automated tests
- [ ] Database credentials hardcoded
- [ ] No environment variables for configuration
- [ ] Limited error responses

## 📝 License

This is a learning project - feel free to use it however you'd like!

## 🙏 Acknowledgments

Built while learning from various tutorials and documentation. Special thanks to the programming community for their resources and support!
