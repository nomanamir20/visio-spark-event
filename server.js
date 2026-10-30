const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let events = [
  { id: 1, name: 'Spark Tech Fest', date: '2026-11-20', venue: 'Main Auditorium', category: 'Tech' },
  { id: 2, name: 'Cultural Night', date: '2026-12-05', venue: 'Open Arena', category: 'Culture' }
];
let nextId = 3;

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get('/api/events', (req, res) => res.json(events));
app.post('/api/events', (req, res) => {
  const { name, date, venue, category } = req.body;
  if (!name || !date) return res.status(400).json({ error: 'name and date required' });
  const ev = { id: nextId++, name, date, venue: venue || 'TBA', category: category || 'General' };
  events.push(ev);
  res.status(201).json(ev);
});
app.delete('/api/events/:id', (req, res) => {
  events = events.filter(e => e.id !== Number(req.params.id));
  res.status(204).end();
});

if (require.main === module) {
  app.listen(3000, () => console.log('Visio Spark Event running on 3000'));
}
module.exports = app;
