import { useState, useEffect } from 'react'

const DAYS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
const CARD_COLORS = ['#7b8cde', '#f5a623', '#e9518a', '#8bc34a', '#26c6da', '#ab47bc']

function getTodayName() {
  const jsDay = new Date().getDay()
  const map = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
  return map[jsDay]
}

function getTodayDateText() {
  return new Date().toLocaleDateString('th-TH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function TodayPage({ onEdit, onLogout, activitiesByDay }) {
  const todayName = getTodayName()

  // วันที่กำลังดู - เริ่มที่ "วันนี้" เลย
  const [selectedDay, setSelectedDay] = useState(todayName)

  // นาฬิกาเรียลไทม์
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const clockText = now.toLocaleTimeString('th-TH', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const nowText = String(now.getHours()).padStart(2, '0') + ':' +
                  String(now.getMinutes()).padStart(2, '0')

  // กิจกรรมของวันที่เลือก เรียงตามเวลา
  const list = [...activitiesByDay[selectedDay]].sort((a, b) =>
    a.startTime.localeCompare(b.startTime)
  )

  return (
    <div className="today-page">
      {/* header: วันที่ + นาฬิกา */}
      <div
        className="today-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <div>วันนี้</div>
          <div className="today-date">{getTodayDateText()}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="today-clock">{clockText}</div>
          <button onClick={onLogout} className="btn-secondary">ออกจากระบบ</button>
        </div>
      </div>

      {/* กล่อง 7 วัน (อยู่บนตลอด) */}
      <div className="day-grid">
        {DAYS.map((day) => {
          let cls = 'day-box'
          if (day === todayName) cls += ' is-today'
          if (day === selectedDay) cls += ' is-selected'
          return (
            <div key={day} className={cls} onClick={() => setSelectedDay(day)}>
              <div style={{ fontWeight: 'bold' }}>{day}</div>
              <div style={{ fontSize: 13, marginTop: 4, opacity: 0.8 }}>
                {activitiesByDay[day].length} กิจกรรม
              </div>
            </div>
          )
        })}
      </div>

      {/* timeline ของวันที่เลือก (โผล่ในหน้าเดียวกัน) */}
      <h3 style={{ margin: '32px 0 16px' }}>Daily Tasks — วัน{selectedDay}</h3>

      <div className="schedule-card">
        {list.length === 0 ? (
          <p style={{ color: '#999' }}>ยังไม่มีกิจกรรมในวันนี้</p>
        ) : (
          <div className="timeline">
            {list.map((act, index) => {
              const isDone = selectedDay === todayName && act.endTime < nowText
              return (
                <div key={index} className="timeline-row">
                  <div className="time-label">{act.startTime}</div>
                  <div className="dot"></div>
                  <div
                    className="card-body"
                    style={{ background: CARD_COLORS[index % CARD_COLORS.length] }}
                  >
                    <div className="card-title">{act.note}</div>
                    <div className="card-status">{isDone ? 'Complete' : 'In Process'}</div>
                    <div className="card-time">
                      <span>🕐</span>
                      <span>{act.startTime} - {act.endTime}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ปุ่ม + ไปหน้าแก้ไข */}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <button onClick={onEdit} className="btn-primary"
          style={{ width: 56, height: 56, borderRadius: '50%', fontSize: 28 }}>
          +
        </button>
      </div>
    </div>
  )
}

export default TodayPage