(() => {
  const KEY = 'studydesk_mba_v1';
  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const COLORS = ['violet','blue','green','orange','pink','teal'];
  const today = new Date();
  const dateKey = d => { const x=new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
  const parseDate = s => { const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); };
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const load = () => { let data; try { data=JSON.parse(localStorage.getItem(KEY)) || null; } catch { data=null; } if(!data) data={subjects:[],slots:[],attendance:{},startDate:dateKey(today)}; if(!data.startDate)data.startDate=dateKey(today); if(!data.attendance)data.attendance={}; if(!data.slots)data.slots=[]; if(!data.subjects)data.subjects=[]; return data; };
  const save = data => localStorage.setItem(KEY, JSON.stringify(data));
  const id = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`;
  const subject = (data,id) => data.subjects.find(s=>s.id===id);
  const fmtTime = t => { if(!t)return ''; const [h,m]=t.split(':').map(Number); const suffix=h>=12?'PM':'AM'; return `${h%12||12}:${String(m).padStart(2,'0')} ${suffix}`; };
  const fmtDate = (s,opts={weekday:'short',month:'short',day:'numeric'}) => parseDate(s).toLocaleDateString(undefined,opts);
  const expectedForDate = (data,date) => data.slots.filter(s=>Number(s.day)===parseDate(date).getDay()).sort((a,b)=>a.start.localeCompare(b.start));
  const recordFor = (data,date,slotId) => data.attendance[date]?.[slotId] || '';
  const setRecord = (date,slotId,status) => { const data=load(),slot=data.slots.find(s=>s.id===slotId); if(slot&&subjectStats(data,slot.subjectId).complete)return false; data.attendance[date] ||= {}; if(status) data.attendance[date][slotId]=status; else delete data.attendance[date][slotId]; if(!Object.keys(data.attendance[date]).length) delete data.attendance[date]; save(data); return true; };
  const getExpectedDates = (data,until=dateKey(today)) => {
    const dates=[]; const start=data.startDate || until;
    const startDate=parseDate(start); const end=parseDate(until);
    const cursor=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
    while(cursor<=end){ const key=dateKey(cursor); if(expectedForDate(data,key).some(slot=>!slot.createdAt || slot.createdAt<=key)) dates.push(key); cursor.setDate(cursor.getDate()+1); }
    return dates;
  };
  const subjectStats = (data,subjectId,until=dateKey(today)) => {
    let expected=0,present=0,absent=0,marked=0;
    getExpectedDates(data,until).forEach(date=>expectedForDate(data,date).filter(s=>s.subjectId===subjectId&&(!s.createdAt||s.createdAt<=date)).forEach(s=>{expected++;const r=recordFor(data,date,s.id);if(r==='present'){present++;marked++;}else if(r==='absent'){absent++;marked++;}}));
    const sub=subject(data,subjectId),required=Number.isInteger(Number(sub?.requiredSessions))&&Number(sub.requiredSessions)>0?Number(sub.requiredSessions):null;
    return {expected,present,absent,marked,rate:marked?Math.round(present/marked*100):0,required,remaining:required===null?null:Math.max(0,required-marked),progress:required===null?0:Math.min(100,Math.round(marked/required*100)),complete:required!==null&&marked>=required};
  };
  const overallStats = (data,until=dateKey(today)) => {
    let expected=0,present=0,absent=0,marked=0;
    getExpectedDates(data,until).forEach(date=>expectedForDate(data,date).filter(s=>!s.createdAt||s.createdAt<=date).forEach(s=>{expected++;const r=recordFor(data,date,s.id);if(r==='present'){present++;marked++;}else if(r==='absent'){absent++;marked++;}}));
    return {expected,present,absent,marked,rate:marked?Math.round(present/marked*100):0};
  };
  const toast = msg => { const el=document.getElementById('toast'); if(!el)return; el.textContent=msg;el.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>el.classList.remove('show'),2400); };
  const init = () => {
    const dateEl=document.getElementById('headerDate'); if(dateEl)dateEl.textContent=today.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'});
    const themeKey='studydesk_theme_v1',themeButton=document.createElement('button'),theme=localStorage.getItem(themeKey)==='dark'?'dark':'light';
    document.body.dataset.theme=theme;themeButton.type='button';themeButton.className='theme-toggle';themeButton.setAttribute('aria-pressed',String(theme==='dark'));
    const updateThemeButton=()=>{const dark=document.body.dataset.theme==='dark';themeButton.textContent=dark?'☀ Light mode':'◐ Dark mode';themeButton.setAttribute('aria-pressed',String(dark));};
    updateThemeButton();const avatar=document.querySelector('.topbar-right .avatar');if(avatar)avatar.parentNode.insertBefore(themeButton,avatar);
    themeButton.addEventListener('click',()=>{const next=document.body.dataset.theme==='dark'?'light':'dark';document.body.dataset.theme=next;localStorage.setItem(themeKey,next);updateThemeButton();});
    const menu=document.getElementById('mobileMenu'); if(menu)menu.addEventListener('click',()=>document.getElementById('sidebar')?.classList.toggle('open'));
    document.querySelectorAll('[data-close-modal]').forEach(b=>b.addEventListener('click',()=>{const m=document.getElementById(b.dataset.closeModal);if(m)m.hidden=true;}));
    document.querySelectorAll('.modal-backdrop').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)m.hidden=true;}));
  };
  window.StudyDesk={KEY,DAYS,COLORS,today,dateKey,parseDate,escapeHTML,load,save,id,subject,fmtTime,fmtDate,expectedForDate,recordFor,setRecord,subjectStats,overallStats,getExpectedDates,toast};
  document.addEventListener('DOMContentLoaded',init);
})();
