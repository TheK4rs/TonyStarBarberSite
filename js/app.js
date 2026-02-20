const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby-1Wh-xg45aYhNBcT2EhmnswRNe_hvQnNP7k5RhybnVBhXGRWcrZoElEAhyamYAs_3/exec";

const calendar = document.getElementById("calendar");
const monthYear = document.getElementById("monthYear");
const timesDiv = document.getElementById("times");
const form = document.getElementById("bookingForm");
const statusText = document.getElementById("status");

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// وقت العمل
const OPEN_HOUR = 9;   // 9 صباحًا
const CLOSE_HOUR = 19; // 7 مساءً

function generateTimeSlots(){
 const slots = [];
 for(let hour = OPEN_HOUR; hour < CLOSE_HOUR; hour++){
  slots.push(formatTime(hour,0));
  slots.push(formatTime(hour,30));
 }
 return slots;
}

function formatTime(h,m){
 return String(h).padStart(2,'0')+":"+String(m).padStart(2,'0');
}

function renderCalendar(){
 calendar.innerHTML="";
 const year = currentDate.getFullYear();
 const month = currentDate.getMonth();

 monthYear.textContent = currentDate.toLocaleDateString("ar",{month:"long",year:"numeric"});

 const firstDay = new Date(year,month,1).getDay();
 const daysInMonth = new Date(year,month+1,0).getDate();

 for(let i=0;i<firstDay;i++){
  calendar.appendChild(document.createElement("div"));
 }

 for(let day=1;day<=daysInMonth;day++){
  const dateObj = new Date(year,month,day);
  const iso = dateObj.toISOString().split("T")[0];

  const div = document.createElement("div");
  div.className="day";
  div.textContent=day;

  const today = new Date();
  today.setHours(0,0,0,0);

  if(dateObj < today){
   div.classList.add("disabled");
  } else {
   div.onclick=()=>{
    document.querySelectorAll(".day").forEach(d=>d.classList.remove("selected"));
    div.classList.add("selected");
    selectedDate=iso;
    loadTimes();
   };
  }

  calendar.appendChild(div);
 }
}

function loadTimes(){
 if(!selectedDate) return;

 fetch(SCRIPT_URL+"?date="+selectedDate)
 .then(res=>res.json())
 .then(booked=>{

  timesDiv.innerHTML="";
  selectedTime=null;

  const allSlots = generateTimeSlots();

  allSlots.forEach(t=>{
   const slot=document.createElement("div");
   slot.className="time-slot";
   slot.textContent=t;

   if(booked.includes(t)){
    slot.classList.add("disabled");
   } else {
    slot.onclick=()=>{
     document.querySelectorAll(".time-slot").forEach(s=>s.classList.remove("selected"));
     slot.classList.add("selected");
     selectedTime=t;
    };
   }

   timesDiv.appendChild(slot);
  });
 });
}

form.addEventListener("submit",function(e){
 e.preventDefault();

 const name=document.getElementById("name").value;
 const phone=document.getElementById("phone").value;

 if(!selectedDate||!selectedTime){
  statusText.textContent="اختر اليوم والوقت";
  return;
 }

 fetch(SCRIPT_URL,{
  method:"POST",
  body:JSON.stringify({name,phone,date:selectedDate,time:selectedTime})
 })
 .then(()=>{
  statusText.textContent="تم الحجز بنجاح";
  form.reset();
  selectedDate=null;
  selectedTime=null;
  timesDiv.innerHTML="";
  renderCalendar();
 });
});

document.getElementById("prev").onclick=()=>{
 currentDate.setMonth(currentDate.getMonth()-1);
 renderCalendar();
};

document.getElementById("next").onclick=()=>{
 currentDate.setMonth(currentDate.getMonth()+1);
 renderCalendar();
};

renderCalendar();

