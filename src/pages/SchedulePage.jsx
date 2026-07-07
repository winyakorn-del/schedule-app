import { useState, useEffect } from 'react'

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']

function createTimeSlots() {
  const slots = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hh = String(hour).padStart(2, '0')
      const mm = String(minute).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

const TIME_SLOTS = createTimeSlots()

function SchedulePage({ onSave, onBack, activitiesByDay, setActivitiesByDay }) {
  const [selectedDay, setSelectedDay] = useState('จันทร์')
  const [showForm, setShowForm] = useState(false)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('09:30')
  const [note, setNote] = useState('')

  // กด Esc แล้วย้อนกลับ
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onBack()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onBack])

  // ลิสต์ของวันที่เลือก เรียงตามเวลาเริ่มอัตโนมัติ
  const todayActivities = [...activitiesByDay[selectedDay]].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

  function handleOpenForm() {
    setShowForm(true)
  }

  function handleAdd() {
    if (note.trim() === '') {
      alert('กรุณากรอกโน้ตว่าจะทำอะไร')
      return
    }
    const newActivity = { startTime, endTime, note }
    setActivitiesByDay({
      ...activitiesByDay,
      [selectedDay]: [...activitiesByDay[selectedDay], newActivity],
    })
    setNote('')
    setShowForm(false)
  }

  function handleCancel() {
    setNote('')
    setShowForm(false)
  }

  function handleDelete(activityToDelete) {
    setActivitiesByDay({
      ...activitiesByDay,
      [selectedDay]: activitiesByDay[selectedDay].filter(
        (act) => act !== activityToDelete
      ),
    })
  }

  return (
    <div className="schedule-page">
      <h1 className="schedule-title"></h1>

      <div className="schedule-card" style={{ display: 'flex', gap: 16 }}>
        {/* แท็บวันด้านซ้าย */}
        <div className="day-tabs">
          {DAYS.map((day) => (
  <button
    key={day}
    onClick={() => setSelectedDay(day)}
    className={selectedDay === day ? 'day-tab is-active' : 'day-tab'}
  >
    {day}
  </button>
))}
        </div>

        {/* เนื้อหาฝั่งขวา */}
        <div style={{ flex: 1 }}>
          <h2 style={{ marginTop: 0 }}>ตารางวัน{selectedDay}</h2>

          {todayActivities.map((act, index) => (
            <div
              key={index}
              className="activity-card"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <span className="activity-time">{act.startTime} - {act.endTime}</span>
                <div>{act.note}</div>
              </div>
              <button
                onClick={() => handleDelete(act)}
                className="btn-secondary"
                style={{ background: '#ffe5e5', color: '#d00' }}
              >
                ลบ
              </button>
            </div>
          ))}

          {/* ส่วนล่าง: ปุ่ม + หรือ ฟอร์ม */}
          {showForm ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
              }}
            >
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <span>ถึง</span>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input
                type="text"
                placeholder="จะทำอะไร..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <button onClick={handleAdd} className="btn-primary">เพิ่ม</button>
              <button onClick={handleCancel} className="btn-secondary" style={{ marginLeft: 8 }}>ยกเลิก</button>
            </div>
          ) : (
            <button onClick={handleOpenForm} className="add-button">
              <span className="add-circle">+</span>
            </button>
          )}
        </div>
      </div>

      <div className="schedule-footer">
        <button onClick={onSave} className="btn-primary">บันทึก</button>
        <button onClick={onBack} className="btn-secondary" style={{ marginLeft: 8 }}>ย้อนกลับ</button>
      </div>
    </div>
  )
}

export default SchedulePage