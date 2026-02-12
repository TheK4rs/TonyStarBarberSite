const API="https://script.google.com/macros/s/AKfycbxVNpIn2qdOBa3FRqOknena5E2ar2dp1wBUDgPFMOqf2NCcm-DHOeDn00_yCQIu5Jmb/exec";


const TIMES=[
"10:00","10:30","11:00","11:30",
"12:00","12:30","13:00","13:30",
"14:00","14:30","15:00","15:30",
"16:00","16:30","17:00","17:30",
"18:00","18:30","19:00","19:30"
];


let selectedTime=null;


function login(){
if(user.value && pass.value){
login.classList.add('hidden');
booking.classList.remove('hidden');
renderSlots([]);
loadCalendar();
}
}


date.onchange=async()=>{
const res=await fetch(API);
const booked=await res.json();


const taken=booked
.filter(b=>b.date===date.value)
.map(b=>b.time);


renderSlots(taken);
}


function renderSlots(taken){
slots.innerHTML="";


TIMES.forEach(t=>{
const btn=document.createElement('button');
btn.innerText=t;


if(taken.includes(t)){
btn.classList.add('booked');
btn.disabled=true;
}else{
btn.onclick=()=>book(t);
}


slots.appendChild(btn);
});
}


async function book(time){
selectedTime=time;


const data={
name:name.value,
phone:phone.value,
date:date.value,
time:time
};


await fetch(API,{method:"POST",body:JSON.stringify(data)});


alert("تم الحجز بنجاح");
loadCalendar();
}