async function loadCalendar(){
const res=await fetch(API);
const list=await res.json();


calendar.innerHTML="";


list.forEach(b=>{
const div=document.createElement('div');
div.innerText=`${b.name} - ${b.date} ${b.time}`;
calendar.appendChild(div);
});
}