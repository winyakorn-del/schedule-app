import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import TodayPage from './pages/TodayPage'
import SchedulePage from './pages/SchedulePage'

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']

function createEmptySchedule() {
  const schedule = {}
  DAYS.forEach((day) => {
    schedule[day] = []
  })
  return schedule
}

function App() {
  const [page, setPage] = useState('login')

  // ข้อมูลตารางกลาง — ทั้งหน้า 2 และหน้า 3 ใช้ร่วมกัน
  const [activitiesByDay, setActivitiesByDay] = useState(() => {
  const saved = localStorage.getItem('mySchedule')
  return saved ? JSON.parse(saved) : createEmptySchedule()
})
 // เซฟทุกครั้งที่เปลี่ยน
useEffect(() => {
  localStorage.setItem('mySchedule', JSON.stringify(activitiesByDay))
}, [activitiesByDay])

  return (
    <div>
      {page === 'login' && <LoginPage onNext={() => setPage('today')} />}
      {page === 'today' && (
        <TodayPage
          onEdit={() => setPage('schedule')}
          activitiesByDay={activitiesByDay}
        />
      )}
    {page === 'schedule' && (
    <SchedulePage
    onSave={() => setPage('today')}
    onBack={() => setPage('today')}
    activitiesByDay={activitiesByDay}
    setActivitiesByDay={setActivitiesByDay}
  />
)}
    </div>
  )
}

export default App