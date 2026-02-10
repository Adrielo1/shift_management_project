import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  // State management
  const [employees, setEmployees] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'employees'
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekDates());

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    name: '', role: '', email: '', phone: ''
  });
  const [shiftForm, setShiftForm] = useState({
    date: '', start_time: '', end_time: '', position: '', employee_id: '', notes: ''
  });

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
    fetchShifts();
  }, []);

  // Get current week's dates (Monday to Sunday)
  function getCurrentWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(today.setDate(diff));
    
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      week.push(date.toISOString().split('T')[0]);
    }
    return week;
  }

  // ============= API CALLS =============

  async function fetchEmployees() {
    try {
      const response = await fetch(`${API_URL}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }

  async function fetchShifts() {
    try {
      const response = await fetch(`${API_URL}/shifts`);
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    }
  }

  async function addEmployee(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm)
      });
      if (response.ok) {
        setEmployeeForm({ name: '', role: '', email: '', phone: '' });
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  async function deleteEmployee(id) {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await fetch(`${API_URL}/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  async function addShift(e) {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/shifts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shiftForm)
      });
      if (response.ok) {
        setShiftForm({ date: '', start_time: '', end_time: '', position: '', employee_id: '', notes: '' });
        fetchShifts();
      }
    } catch (error) {
      console.error('Error adding shift:', error);
    }
  }

  async function deleteShift(id) {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;
    try {
      await fetch(`${API_URL}/shifts/${id}`, { method: 'DELETE' });
      fetchShifts();
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  }

  // ============= RENDER HELPERS =============

  function getShiftsForDate(date) {
    return shifts.filter(shift => shift.date === date);
  }

  function getDayName(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // ============= RENDER =============

  return (
    <div className="app">
      <header className="header">
        <h1>📅 Shift Scheduler</h1>
        <nav className="tabs">
          <button 
            className={activeTab === 'schedule' ? 'active' : ''} 
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
          <button 
            className={activeTab === 'employees' ? 'active' : ''} 
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === 'schedule' && (
          <div className="schedule-view">
            <div className="schedule-header">
              <h2>Weekly Schedule</h2>
              <button onClick={() => setSelectedWeek(getCurrentWeekDates())}>
                This Week
              </button>
            </div>

            {/* Add Shift Form */}
            <div className="form-card">
              <h3>Add New Shift</h3>
              <form onSubmit={addShift} className="shift-form">
                <select 
                  value={shiftForm.date} 
                  onChange={(e) => setShiftForm({...shiftForm, date: e.target.value})}
                  required
                >
                  <option value="">Select Date</option>
                  {selectedWeek.map(date => (
                    <option key={date} value={date}>{getDayName(date)}</option>
                  ))}
                </select>
                
                <input 
                  type="time" 
                  value={shiftForm.start_time}
                  onChange={(e) => setShiftForm({...shiftForm, start_time: e.target.value})}
                  placeholder="Start Time"
                  required
                />
                
                <input 
                  type="time" 
                  value={shiftForm.end_time}
                  onChange={(e) => setShiftForm({...shiftForm, end_time: e.target.value})}
                  placeholder="End Time"
                  required
                />
                
                <input 
                  type="text" 
                  value={shiftForm.position}
                  onChange={(e) => setShiftForm({...shiftForm, position: e.target.value})}
                  placeholder="Position (e.g., Cashier, Manager)"
                  required
                />
                
                <select 
                  value={shiftForm.employee_id} 
                  onChange={(e) => setShiftForm({...shiftForm, employee_id: e.target.value})}
                >
                  <option value="">Assign Employee (Optional)</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                  ))}
                </select>
                
                <input 
                  type="text" 
                  value={shiftForm.notes}
                  onChange={(e) => setShiftForm({...shiftForm, notes: e.target.value})}
                  placeholder="Notes (optional)"
                />
                
                <button type="submit" className="btn-primary">Add Shift</button>
              </form>
            </div>

            {/* Schedule Grid */}
            <div className="schedule-grid">
              {selectedWeek.map(date => (
                <div key={date} className="day-column">
                  <div className="day-header">
                    {getDayName(date)}
                  </div>
                  <div className="shifts-container">
                    {getShiftsForDate(date).length === 0 ? (
                      <div className="no-shifts">No shifts</div>
                    ) : (
                      getShiftsForDate(date).map(shift => (
                        <div key={shift.id} className="shift-card">
                          <div className="shift-time">
                            {shift.start_time} - {shift.end_time}
                          </div>
                          <div className="shift-position">{shift.position}</div>
                          {shift.employee_name && (
                            <div className="shift-employee">👤 {shift.employee_name}</div>
                          )}
                          {shift.notes && (
                            <div className="shift-notes">📝 {shift.notes}</div>
                          )}
                          <button 
                            onClick={() => deleteShift(shift.id)}
                            className="btn-delete-small"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="employees-view">
            <h2>Manage Employees</h2>
            
            {/* Add Employee Form */}
            <div className="form-card">
              <h3>Add New Employee</h3>
              <form onSubmit={addEmployee} className="employee-form">
                <input 
                  type="text" 
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({...employeeForm, name: e.target.value})}
                  placeholder="Full Name"
                  required
                />
                <input 
                  type="text" 
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm({...employeeForm, role: e.target.value})}
                  placeholder="Role (e.g., Cashier, Manager)"
                  required
                />
                <input 
                  type="email" 
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({...employeeForm, email: e.target.value})}
                  placeholder="Email (optional)"
                />
                <input 
                  type="tel" 
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({...employeeForm, phone: e.target.value})}
                  placeholder="Phone (optional)"
                />
                <button type="submit" className="btn-primary">Add Employee</button>
              </form>
            </div>

            {/* Employee List */}
            <div className="employee-list">
              {employees.length === 0 ? (
                <p>No employees yet. Add your first employee above!</p>
              ) : (
                employees.map(emp => (
                  <div key={emp.id} className="employee-card">
                    <div className="employee-info">
                      <h3>{emp.name}</h3>
                      <p className="employee-role">{emp.role}</p>
                      {emp.email && <p>📧 {emp.email}</p>}
                      {emp.phone && <p>📱 {emp.phone}</p>}
                    </div>
                    <button 
                      onClick={() => deleteEmployee(emp.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;