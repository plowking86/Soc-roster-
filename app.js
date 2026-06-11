const data = window.ROSTER_DATA || [];
const byDate = Object.fromEntries(data.map(x=>[x.date,x]));
let cursor = new Date(data[0]?.date || new Date());
let selected = null;
const notesKey = 'jessicaMazzaRosterNotesV1';
const notes = JSON.parse(localStorage.getItem(notesKey) || '{}');
const fmt = new Intl.DateTimeFormat('en-AU',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const monthFmt = new Intl.DateTimeFormat('en-AU',{month:'long',year:'numeric'});
function saveNotes(){localStorage.setItem(notesKey,JSON.stringify(notes));}
function classify(shift){
  if(!shift) return 'off';
  if(['BO','EDO','AL','RDO'].includes(shift)) return 'off';
  const h = Number(String(shift).split(':')[0]);
  if(h < 10) return 'early';
  if(h < 18) return 'day';
  return 'late';
}
function renderStats(){
  const shifts=data.filter(x=>x.type==='shift');
  const off=data.filter(x=>['BO','EDO'].includes(x.shift));
  const weekends=data.filter(x=>x.type==='shift' && [0,6].includes(new Date(x.date+'T00:00').getDay()));
  const nights=data.filter(x=>classify(x.shift)==='late');
  document.getElementById('stats').innerHTML = [
    ['Roster days', data.length], ['Working shifts', shifts.length], ['Weekends', weekends.length], ['Late/Night', nights.length]
  ].map(([k,v])=>`<div class="card"><span>${k}</span><b>${v}</b></div>`).join('');
  document.getElementById('rangeText').textContent = `${fmt.format(new Date(data[0].date+'T00:00'))} to ${fmt.format(new Date(data.at(-1).date+'T00:00'))}`;
}
function dateStr(d){return d.toISOString().slice(0,10)}
function renderCalendar(){
  document.getElementById('monthLabel').textContent = monthFmt.format(cursor);
  const y=cursor.getFullYear(), m=cursor.getMonth();
  const first=new Date(y,m,1); const start=new Date(first); start.setDate(first.getDate()-first.getDay());
  const today=dateStr(new Date()); const cal=document.getElementById('calendar'); cal.innerHTML='';
  for(let i=0;i<42;i++){
    const d=new Date(start); d.setDate(start.getDate()+i); const ds=dateStr(d); const r=byDate[ds];
    const box=document.createElement('div'); box.className='daybox'+(d.getMonth()!==m?' out':'')+(ds===today?' today':'');
    box.innerHTML=`<div class="num">${d.getDate()}</div>` + (r?`<div class="shift ${classify(r.shift)}">${r.shift||'—'}</div>`:'') + (notes[ds]?`<div class="note">${escapeHtml(notes[ds])}</div>`:'');
    box.onclick=()=>openDay(ds); cal.appendChild(box);
  }
}
function renderList(){
  const q=document.getElementById('searchBox').value.toLowerCase().trim();
  const rows=data.filter(r=>!q || r.date.includes(q) || r.shift.toLowerCase().includes(q) || (notes[r.date]||'').toLowerCase().includes(q));
  document.getElementById('list').innerHTML=rows.map(r=>`<div class="item"><div><b>${fmt.format(new Date(r.date+'T00:00'))}</b><br><small>${notes[r.date]?escapeHtml(notes[r.date]):''}</small></div><span class="shift ${classify(r.shift)}">${r.shift||'—'}</span></div>`).join('') || '<p>No matches.</p>';
}
function openDay(ds){
  selected=ds; const r=byDate[ds] || {shift:''};
  document.getElementById('selectedDay').innerHTML=`<b>${fmt.format(new Date(ds+'T00:00'))}</b><br>Rostered: <span class="shift ${classify(r.shift)}">${r.shift||'—'}</span><br>${notes[ds]?`Note/swap: ${escapeHtml(notes[ds])}`:'No saved note.'}`;
  document.getElementById('dialogTitle').textContent=fmt.format(new Date(ds+'T00:00'));
  document.getElementById('editShift').value=r.shift||''; document.getElementById('editNote').value=notes[ds]||''; document.getElementById('editDialog').showModal();
}
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
document.getElementById('prevMonth').onclick=()=>{cursor.setMonth(cursor.getMonth()-1);renderCalendar()};
document.getElementById('nextMonth').onclick=()=>{cursor.setMonth(cursor.getMonth()+1);renderCalendar()};
document.getElementById('todayBtn').onclick=()=>{cursor=new Date();renderCalendar()};
document.getElementById('searchBox').oninput=renderList;
document.getElementById('saveNote').onclick=()=>{const v=document.getElementById('editNote').value.trim(); if(v) notes[selected]=v; else delete notes[selected]; saveNotes(); renderCalendar(); renderList();};
document.getElementById('clearNote').onclick=()=>{delete notes[selected]; saveNotes(); renderCalendar(); renderList();};
let deferredPrompt; window.addEventListener('beforeinstallprompt',e=>{e.preventDefault(); deferredPrompt=e; const b=document.getElementById('installBtn'); b.hidden=false; b.onclick=()=>deferredPrompt.prompt();});
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
renderStats(); renderCalendar(); renderList();
