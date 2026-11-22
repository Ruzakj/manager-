const dateKey=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const MONTHS={jan:1,januari:1,feb:2,februari:2,mar:3,maret:3,apr:4,april:4,mei:5,may:5,jun:6,juni:6,jul:7,juli:7,agu:8,agustus:8,aug:8,sep:9,september:9,okt:10,oktober:10,oct:10,nov:11,november:11,des:12,desember:12,dec:12};
const dateISO=(y,m,d)=>{const x=new Date(y,m-1,d);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d?y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0"):""};
export function parseSchedule(text,reference=new Date()){const result=[],seen=new Set();for(const raw of text.split(/\r?\n/)){const line=raw.trim();if(!line)continue;let date="";const num=line.match(/\b(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?\b/),named=line.match(/\b(\d{1,2})\s+([A-Za-zÀ-ÿ]+)(?:\s+(\d{4}))?\b/);if(num){const y=num[3]?Number(num[3].length===2?"20"+num[3]:num[3]):reference.getFullYear();date=dateISO(y,Number(num[2]),Number(num[1]))}else if(named&&MONTHS[named[2].toLowerCase()])date=dateISO(Number(named[3]||reference.getFullYear()),MONTHS[named[2].toLowerCase()],Number(named[1]));else{const day=line.match(/^(\d{1,2})\s+(OFF|LIBUR|PAGI|SIANG|MALAM|SHIFT\s*[123])/i);if(day)date=dateISO(reference.getFullYear(),reference.getMonth()+1,Number(day[1]))}if(!date)continue;const off=/\b(off|libur|cuti|istirahat)\b/i.test(line),h=line.match(/\b([01]?\d|2[0-3])[.:]([0-5]\d)\s*(?:-|sampai|–|—)\s*([01]?\d|2[0-3])[.:]([0-5]\d)\b/i),s=line.match(/\b(shift\s*[123]|pagi|siang|malam)\b/i);if(!off&&!h&&!s)continue;if(seen.has(date))continue;seen.add(date);result.push({date,start:h?h[1].padStart(2,"0")+":"+h[2]:"",end:h?h[3].padStart(2,"0")+":"+h[4]:"",label:off?"OFF":s?.[1]||(h?"Kerja":"Belum diketahui"),sourceLine:line})}return result.sort((a,b)=>a.date.localeCompare(b.date))}
const SHIFT_CODES=new Set(["M","P","S","M19","PR","C","OFF","OFFR","SO"]);
export function parseRosterTable(text,employee="RICHI",month=new Date().getMonth()+1,year=new Date().getFullYear()){
 const lines=String(text||"").split(/\r?\n/).map(x=>x.trim()).filter(Boolean),name=employee.toUpperCase();
 const headerLines=lines.slice(0,Math.min(12,lines.length)),header=headerLines.join(" ").toUpperCase().replace(/[^A-Z0-9]+/g," ").trim().split(/\s+/);
 const nameAt=header.indexOf(name);if(nameAt<0)return [];
 const employeeIndex=header.slice(0,nameAt).filter(x=>/^[A-Z]{2,}$/.test(x)&&!["TGL","HARI","COS","ACOS","CREW","PRAKERIN","KET"].includes(x)).length;
 const cellIndex=employeeIndex+2,rows=[],seen=new Set();
 for(const line of lines){const parts=line.toUpperCase().replace(/[|¦]/g," ").split(/\s+/).filter(Boolean);if(!/^\d{1,2}$/.test(parts[0]||""))continue;
  const day=Number(parts[0]);if(day<1||day>31||seen.has(day))continue;
  const cells=parts.slice(2);let code=cells[cellIndex-2]||"";
  if(!SHIFT_CODES.has(code.replace(/\s/g,""))){const compact=cells.map(x=>x.replace(/[^A-Z0-9]/g,""));code=compact[cellIndex-2]||""}
  code=code.replace(/[^A-Z0-9]/g,"");if(!SHIFT_CODES.has(code))continue;
  const date=dateISO(Number(year),Number(month),day);if(!date)continue;seen.add(day);
  rows.push({date,start:"",end:"",label:code==="OFF"||code==="OFFR"?"OFF":code,shiftCode:code,sourceLine:line,employee:name,confidence:"review"});
 }
 return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
const FULL_BODY=[
 [{name:"Goblet squat",muscle:"Legs",sets:3,reps:10,weight:0,rest:90},{name:"Dumbbell floor press",muscle:"Chest",sets:3,reps:10,weight:0,rest:90},{name:"One-arm dumbbell row",muscle:"Back",sets:3,reps:10,weight:0,rest:90},{name:"Dumbbell Romanian deadlift",muscle:"Hamstrings",sets:2,reps:10,weight:0,rest:90},{name:"Dumbbell shoulder press",muscle:"Shoulders",sets:2,reps:10,weight:0,rest:90},{name:"Plank",muscle:"Core",sets:2,reps:30,weight:0,rest:60}],
 [{name:"Barbell squat",muscle:"Legs",sets:3,reps:8,weight:0,rest:120},{name:"Push-up",muscle:"Chest",sets:3,reps:8,weight:0,rest:90},{name:"Pull-up / assisted pull-up",muscle:"Back",sets:3,reps:5,weight:0,rest:120},{name:"Barbell Romanian deadlift",muscle:"Hamstrings",sets:2,reps:10,weight:0,rest:120},{name:"Dumbbell curl",muscle:"Biceps",sets:2,reps:12,weight:0,rest:60},{name:"Dead bug",muscle:"Core",sets:2,reps:10,weight:0,rest:60}],
 [{name:"Dumbbell reverse lunge",muscle:"Legs",sets:2,reps:10,weight:0,rest:90},{name:"Dumbbell floor press",muscle:"Chest",sets:3,reps:10,weight:0,rest:90},{name:"Pull-up / assisted pull-up",muscle:"Back",sets:3,reps:5,weight:0,rest:120},{name:"Dumbbell hip hinge",muscle:"Glutes",sets:2,reps:12,weight:0,rest:90},{name:"Lateral raise",muscle:"Shoulders",sets:2,reps:12,weight:0,rest:60},{name:"Side plank",muscle:"Core",sets:2,reps:20,weight:0,rest:60}]
];
export function suggestWorkouts(shifts,settings,existing=[]){
 const frequency=Math.max(1,Math.min(6,Number(settings.frequency)||3)),minutes=Math.max(15,Number(settings.minutes)||40);
 const candidates=[...shifts].sort((a,b)=>(a.label==="OFF"?0:1)-(b.label==="OFF"?0:1)||a.date.localeCompare(b.date));
 const created=[],chosen=[];for(const s of candidates){if(created.length>=frequency)break;
  if(existing.some(w=>w.date===s.date&&w.status!=="missed")||created.some(w=>w.date===s.date))continue;
  const day=new Date(s.date+"T12:00:00");if(chosen.some(d=>Math.abs(day-d)<2*86400000))continue;
  const index=created.length%FULL_BODY.length,off=s.label==="OFF";
  created.push({id:crypto.randomUUID(),date:s.date,title:"Full Body "+String.fromCharCode(65+index),status:"planned",exercises:FULL_BODY[index].map(e=>({...e})),note:"Sesi "+(index+1)+"/3 · "+minutes+" menit · "+(off?"hari OFF":"hari kerja ("+(s.shiftCode||s.label)+")")+". Pemanasan 5–8 menit, sisakan 2–3 repetisi sebelum gagal, jangan memaksakan beban. Istirahat dan recovery minimal 48 jam."});
  chosen.push(day);
 }
 return created.sort((a,b)=>a.date.localeCompare(b.date));
}