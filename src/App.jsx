import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import TodayPage from './pages/TodayPage'
import SchedulePage from './pages/SchedulePage'

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
const API = 'http://localhost:3001'

function createEmptySchedule() {
  const schedule = {}
  DAYS.forEach((day) => { schedule[day] = [] })
  return schedule
}

// แปลงลิสต์แบนๆ จาก backend → object แยกตามวัน สำหรับ React
function groupByDay(rows) {
  const schedule = createEmptySchedule()
  rows.forEach((row) => {
    if (schedule[row.day]) schedule[row.day].push(row)
  })
  return schedule
}

function App() {
  const [page, setPage] = useState('login')
  const [activitiesByDay, setActivitiesByDay] = useState(createEmptySchedule())

  // โหลดข้อมูลจาก backend ตอนเปิดแอป
  useEffect(() => {
    fetch(`${API}/activities`)
      .then((res) => res.json())
      .then((rows) => setActivitiesByDay(groupByDay(rows)))
      .catch((err) => console.error('โหลดข้อมูลไม่สำเร็จ:', err))
  }, [])

  // เพิ่มกิจกรรม (ส่งไป backend แล้วโหลดใหม่)
  async function addActivity(day, activity) {
    await fetch(`${API}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, ...activity }),
    })
    await reload()
  }

  // ลบกิจกรรมตาม id
  async function deleteActivity(id) {
    await fetch(`${API}/activities/${id}`, { method: 'DELETE' })
    await reload()
  }

  // โหลดข้อมูลล่าสุดจาก backend
  async function reload() {
    const res = await fetch(`${API}/activities`)
    const rows = await res.json()
    setActivitiesByDay(groupByDay(rows))
  }

  return (
    <div>
      {page === 'login' && <LoginPage onNext={() => setPage('today')} />}
      {page === 'today' && (
        <TodayPage
          onEdit={() => setPage('schedule')}
          onLogout={() => setPage('login')}
          activitiesByDay={activitiesByDay}
        />
      )}
      {page === 'schedule' && (
        <SchedulePage
          onSave={() => setPage('today')}
          onBack={() => setPage('today')}
          activitiesByDay={activitiesByDay}
          addActivity={addActivity}
          deleteActivity={deleteActivity}
        />
      )}
    </div>
  )
}

export default App