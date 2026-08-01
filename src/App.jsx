import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [requests, setRequests] = useState([])
  const [reason, setReason] = useState('')
  const [hours, setHours] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  async function fetchRequests() {
    const { data, error } = await supabase.from('ot_requests').select('*')
    if (error) console.error('Error fetching:', error)
    else setRequests(data || [])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { error } = await supabase.from('ot_requests').insert([
      {
        employee_id: '00000000-0000-0000-0000-000000000000',
        employee_name: 'Test Employee',
        date_of_ot: date,
        number_of_hours: hours,
        reason: reason
      }
    ])

    if (error) {
      alert('Error inserting request: ' + error.message)
    } else {
      setReason('')
      setHours('')
      setDate('')
      fetchRequests()
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Overtime Request Ledger</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="number" step="0.5" placeholder="Number of Hours" value={hours} onChange={e => setHours(e.target.value)} required />
        <input type="text" placeholder="Reason for Overtime" value={reason} onChange={e => setReason(e.target.value)} required />
        <button type="submit">Submit Request</button>
      </form>

      <h3>Submitted Requests</h3>
      <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Hours</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td>{req.date_of_ot}</td>
              <td>{req.number_of_hours}</td>
              <td>{req.reason}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}