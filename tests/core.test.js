import {describe,it,expect} from "vitest";
import {categorize,summarize,duplicate,allocation} from "../src/finance.js";
import {parseSchedule,suggestWorkouts} from "../src/schedule.js";
const tx=(type,amount,date="2026-11-02",category="Lainnya",merchant="")=>({id:String(amount)+date,type,amount,date,category,merchant});
describe("Finance calculations",()=>{
 it("calculates totals from stored transactions",()=>{const s=summarize([tx("income",3000000),tx("expense",25000,"2026-11-03","Makan & Minum")],"2026-11-01","2026-11-30");expect(s.income).toBe(3000000);expect(s.expenses).toBe(25000);expect(s.net).toBe(2975000);expect(s.categories["Makan & Minum"]).toBe(25000)});
 it("returns uncertain category for unclear descriptions",()=>{expect(categorize("makan siang","","expense").category).toBe("Makan & Minum");expect(categorize("Pembayaran","","expense").confidence).toBeLessThan(.5)});
 it("detects same transaction duplicates by date amount type and merchant",()=>{expect(duplicate({...tx("expense",20000,"2026-11-01","Makan","warung a"),id:"new" },[{...tx("expense",20000,"2026-11-01","Lainnya","WARUNG A"),id:"stored"}])).toBe(true)});
 it("does not fabricate income or spending data",()=>{const s=allocation([],{needs:50,wants:30,savings:20,fixed:0,debt:0,target:0});expect(s.income).toBe(0);expect(s.expenses).toBe(0);expect(s.safe).toBe(0)});
});
describe("Schedule parser",()=>{
 it("recognizes Indonesian off days and shift windows",()=>{const rows=parseSchedule("01/12/2026 OFF\n02/12/2026 07.00-15.00 Shift 1",new Date("2026-11-23T12:00:00"));expect(rows).toHaveLength(2);expect(rows[0].label).toBe("OFF");expect(rows[1].start).toBe("07:00");expect(rows[1].end).toBe("15:00")});
 it("ignores unsupported free text rather than inventing shifts",()=>{expect(parseSchedule("Jadwal kerja bulan desember\ncatatan masuk pagi").length).toBe(0)});
 it("rotates suggested exercises across muscle groups",()=>{const shifts=[1,3,5,7].map(day=>({date:"2026-12-"+String(day).padStart(2,"0"),start:"",end:"",label:"OFF",sourceLine:"OFF"}));const rows=suggestWorkouts(shifts,{minutes:40,frequency:3},[]);expect(rows.length).toBeGreaterThan(1);expect(new Set(rows.map(w=>w.exercises[0].muscle)).size).toBeGreaterThan(1)});
});