const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, LevelFormat, TabStopType, TabStopPosition,
  PageBreak
} = require('docx');

const BLUE = "1F4E79", ACCENT = "2E75B6", LIGHT = "E8F0F8", GREY = "F2F2F2", WHITE = "FFFFFF", EXAMPLE_BG = "FFF8E1";
const DXA_A4_W = 11906, DXA_A4_H = 16838, MARGIN = 1134;
const CONTENT_W = DXA_A4_W - 2 * MARGIN;
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };
const exBorder = { style: BorderStyle.SINGLE, size: 1, color: "E0C860" };
const exBorders = { top: exBorder, bottom: exBorder, left: exBorder, right: exBorder };

function hdrCell(t, w) {
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA },
    shading: { fill: BLUE, type: ShadingType.CLEAR }, margins: cellMargins,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, color: WHITE, font: "Arial", size: 18 })] })] });
}
function cel(t, w, o={}) {
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA },
    shading: o.shade ? { fill: o.shade, type: ShadingType.CLEAR } : undefined,
    margins: cellMargins, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text: typeof t==='object'?t.text:t,
      bold: o.bold||(typeof t==='object'&&t.bold)||false, font:"Arial", size:18, color: o.color||"2D2D2D" })] })] });
}
function mkTable(hdrs, rows, cw) {
  const tw = cw.reduce((a,b)=>a+b,0);
  return new Table({ width:{size:tw,type:WidthType.DXA}, columnWidths:cw,
    rows: [new TableRow({children:hdrs.map((h,i)=>hdrCell(h,cw[i])),tableHeader:true}),
      ...rows.map((r,ri)=>new TableRow({children:r.map((c,ci)=>{
        const isO=typeof c==='object';
        return cel(c,cw[ci],{shade:ri%2===1?GREY:undefined,bold:isO?c.bold:false,color:isO?c.color:undefined});
      })}))] });
}
function H(t,l=HeadingLevel.HEADING_1){return new Paragraph({heading:l,children:[new TextRun({text:t})]});}
function P(t,o={}){
  const runs=[];
  if(typeof t==='string') runs.push(new TextRun({text:t,font:"Arial",size:o.size||20,bold:o.bold||false,italics:o.italics||false,color:o.color||"2D2D2D"}));
  else if(Array.isArray(t)) t.forEach(x=>{
    if(typeof x==='string') runs.push(new TextRun({text:x,font:"Arial",size:o.size||20}));
    else runs.push(new TextRun({font:"Arial",size:o.size||20,...x}));
  });
  return new Paragraph({children:runs,spacing:{after:o.after!==undefined?o.after:120},alignment:o.align||AlignmentType.LEFT});
}
function exBox(title,lines){
  const ch=[];
  ch.push(new Paragraph({spacing:{after:60},children:[new TextRun({text:"\uD83D\uDCA1 "+title,bold:true,font:"Arial",size:19,color:"7B6400"})]}));
  lines.forEach(l=>{
    if(typeof l==='string') ch.push(new Paragraph({spacing:{after:60},children:[new TextRun({text:l,font:"Arial",size:19,color:"4A4A4A"})]}));
    else { const rs=l.map(x=>typeof x==='string'?new TextRun({text:x,font:"Arial",size:19,color:"4A4A4A"}):new TextRun({font:"Arial",size:19,color:"4A4A4A",...x}));
      ch.push(new Paragraph({spacing:{after:60},children:rs})); }
  });
  return new Table({width:{size:CONTENT_W,type:WidthType.DXA},columnWidths:[CONTENT_W],
    rows:[new TableRow({children:[new TableCell({borders:exBorders,width:{size:CONTENT_W,type:WidthType.DXA},
      shading:{fill:EXAMPLE_BG,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:160,right:160},children:ch})]})]});
}
function sp(p=100){return new Paragraph({spacing:{after:p},children:[]});}
function pb(){return new Paragraph({children:[new PageBreak()]});}

const doc = new Document({
  styles:{default:{document:{run:{font:"Arial",size:20}}},paragraphStyles:[
    {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,font:"Arial",color:BLUE},paragraph:{spacing:{before:300,after:180},outlineLevel:0}},
    {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:24,bold:true,font:"Arial",color:ACCENT},paragraph:{spacing:{before:240,after:120},outlineLevel:1}},
    {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:22,bold:true,font:"Arial",color:"2D2D2D"},paragraph:{spacing:{before:180,after:100},outlineLevel:2}},
  ]},
  numbering:{config:[{reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]}]},
  sections:[{
    properties:{page:{size:{width:DXA_A4_W,height:DXA_A4_H},margin:{top:MARGIN,right:MARGIN,bottom:MARGIN,left:MARGIN}}},
    headers:{default:new Header({children:[new Paragraph({border:{bottom:{style:BorderStyle.SINGLE,size:6,color:ACCENT,space:1}},tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],children:[new TextRun({text:"CNHR-MNHR Framework  |  Companion Guide",font:"Arial",size:16,color:ACCENT}),new TextRun({text:"\tv4.0-4on3off  |  March 2026",font:"Arial",size:16,color:ACCENT})]})]}),},
    footers:{default:new Footer({children:[new Paragraph({border:{top:{style:BorderStyle.SINGLE,size:6,color:ACCENT,space:1}},tabStops:[{type:TabStopType.RIGHT,position:TabStopPosition.MAX}],children:[new TextRun({text:"Confidential  \u2022  Shehzad Qayum",font:"Arial",size:14,color:ACCENT}),new TextRun({text:"\tPage ",font:"Arial",size:14,color:ACCENT}),new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:14,color:ACCENT})]})]}),},
    children:[
      sp(600),
      P("WORK SCHEDULE",{size:40,bold:true,color:BLUE,align:AlignmentType.CENTER,after:40}),
      P("Companion Guide",{size:30,bold:true,color:ACCENT,align:AlignmentType.CENTER,after:40}),
      P("Understanding the Terms, Concepts, and Strategy",{size:22,color:"666666",align:AlignmentType.CENTER,after:300}),
      P([{text:"This document explains every metric, symbol, and design principle on the one-page Work Schedule. It is written for anyone who needs to understand the strategy \u2014 whether you are technically minded or not. Each concept is first explained in plain language with a real-life analogy, then supported with the precise definition and numbers.",size:20}],{after:200}),
      P([{text:"All numerical values are produced by ",size:20},{text:"cnhr_calculator.py",italics:true,size:20},{text:", the reference Python implementation that serves as the single source of truth for the framework.",size:20}],{after:200}),
      pb(),

      // 1. THE CORE IDEA
      H("1. The Core Idea"),
      P("The CNHR-MNHR Framework is a mathematical system for answering one question: how many days should a private hire vehicle (PHV) driver work each week to meet legal minimum wage requirements while preserving as much free time as possible?"),
      P("The framework exists because this question is harder than it looks. A PHV driver faces two types of cost: costs that run every day regardless of whether the car moves (insurance, vehicle finance, licensing), and costs that only arise when driving (electricity to charge the car, tyre wear, congestion charges). The first type \u2014 fixed costs \u2014 creates a mathematical trap."),
      exBox("The Rent Analogy",[
        "Imagine you rent a market stall for \u00A3220 per week. The rent is the same whether you open for 1 day or 7 days. If you open for just 2 days, each day must cover \u00A3110 of rent before you even start making profit. If you open for 5 days, each day only needs to cover \u00A344 of rent. Opening more days makes each day cheaper \u2014 not because you sell more per day, but because the fixed rent is spread more thinly.",
        "PHV driving works exactly the same way. The \u2018rent\u2019 is \u00A3220 per week in insurance, vehicle finance, and other fixed costs. Each working day must pay its share of this rent before generating any real income. The framework calculates exactly how many days you need to open the stall to cover the rent and meet the legal minimum wage \u2014 and not one day more.",
      ]),
      sp(120),
      P([{text:"Current configuration: ",bold:true},{text:"4 days on (Monday\u2013Thursday), 3 days off (Friday\u2013Sunday), every week identical. 10-hour shifts from 04:00 to 14:00. This produces 40 clock hours per week, targeting \u00A3203 per working day."}]),
      P([{text:"The underlying principle: ",bold:true},{text:"higher earning rates do not increase your hourly income under this strategy \u2014 they reduce the number of days you need to work. Every productivity gain is converted into free time, not higher pay. The pay stays fixed at the legal minimum. This is a deliberate design choice made to maximise time available for study and career transition."}]),

      // 2. WHY 3 WEEKS?
      H("2. Why a 3-Week Cycle?"),
      P("The schedule repeats every 3 weeks (21 days), not every 1 or 2 weeks. This is not arbitrary \u2014 it exists because of the fallback pattern."),
      P([{text:"The primary plan is to work 12 days per cycle (4 per week, every week identical). But what if earnings fall below the target? The framework includes a fallback that increases to 13 working days. The number 13 does not divide evenly into weekly blocks: 13 \u00F7 7 = 1 remainder 6. You cannot split 13 days evenly across identical weeks. The smallest cycle that can accommodate both 12 days "},{text:"(4 + 4 + 4)",bold:true},{text:" and 13 days "},{text:"(5 + 5 + 3)",bold:true},{text:" as whole numbers is 21 days \u2014 three weeks."}]),
      exBox("The Calendar Puzzle",[
        "Suppose you have 13 marbles and 3 jars (one per week). You want to distribute the marbles so that no jar has too many (to avoid exhaustion) and the rest days fall on specific days. The best split is 5\u20135\u20133: two heavier weeks followed by a lighter recovery week.",
        "If the cycle were only 7 days (1 week), you could not fit 13 days at all. If it were 14 days (2 weeks), 13 out of 14 would leave only 1 rest day \u2014 unsustainable. 21 days is the minimum that gives both the primary (12-day) and fallback (13-day) patterns enough room to breathe.",
      ]),
      sp(120),
      P("In normal operation (d=12), every week looks the same: Monday\u2013Thursday on, Friday\u2013Sunday off. The 3-week structure is invisible \u2014 it only becomes apparent if the fallback is activated. Think of it as a contingency built into the calendar."),

      // 3. THE WEEKLY PATTERN
      H("3. The Weekly Pattern"),
      P([{text:"Primary pattern (d=12): ",bold:true},{text:"Work Monday through Thursday, rest Friday through Sunday. Every week identical."}],{after:160}),
      mkTable(["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],[
        ["Week 1","WORK","WORK","WORK","WORK","REST","REST","REST"],
        ["Week 2","WORK","WORK","WORK","WORK","REST","REST","REST"],
        ["Week 3","WORK","WORK","WORK","WORK","REST","REST","REST"],
      ],[1000,948,948,948,948,948,948,950]),
      sp(120),
      P("Working: 12 days (4+4+4). Rest: 9 days (3+3+3). Maximum consecutive working days: 4 (Monday\u2013Thursday). 40 clock hours per week. 8.66 engaged hours per shift."),
      P([{text:"Why these days? ",bold:true},{text:"Each day of the week was scored 0\u201320 based on real demand drivers: commuter patterns, airport schedules, school runs, and traffic flow. Monday and Tuesday scored highest (14/20); Wednesday and Thursday are strong (11\u201312). Friday, Saturday, and Sunday scored lowest (6\u201310). The working days are the highest-demand days and the rest days are the lowest \u2014 maximising earnings per shift while protecting the weakest days for rest."}]),

      // 4. A WORKING DAY
      H("4. A Working Day"),
      P("Every working day follows the same structure:",{after:120}),
      mkTable(["Time","Block","Duration","What Happens"],[
        ["03:45","Wake","15 min","Prepare for shift"],
        ["04:00\u201314:00","SHIFT","10 hours","Active driving. Uber app on. Earning, waiting for trips, or repositioning."],
        ["14:00\u201315:00","Transition","1 hour","Drive home, park, wind down. Not earning but not yet free."],
        ["15:00\u201320:00","Free time","5 hours","Uncommitted waking hours. Study, rest, pray, cook, errands \u2014 your choice."],
        ["20:00\u201304:00","Sleep","8 hours","Non-negotiable. Circadian-aligned rest."],
      ],[1100,1200,1000,4338]),
      sp(120),
      P([{text:"On rest days, ",bold:true},{text:"you have 16 hours of free time (24 hours minus 8 hours of sleep). The shift and transition blocks disappear entirely."}]),
      exBox("Where Does the Time Go?",[
        "In a typical working week (Mon\u2013Thu on, Fri\u2013Sun off), across 7 days:",
        [{text:"  Sleep: ",bold:true},{text:"56 hours (8h \u00D7 7 days) \u2014 same every week"}],
        [{text:"  Work + transition: ",bold:true},{text:"44 hours (11h \u00D7 4 days) \u2014 the cost of earning"}],
        [{text:"  Free time: ",bold:true},{text:"68 hours (5h \u00D7 4 work days + 16h \u00D7 3 rest days)"}],
        "Out of 168 hours in the week, 68 are genuinely yours. That is 9.71 hours per day on average \u2014 though no single day delivers exactly that. Working days give 5; rest days give 16.",
      ]),
      pb(),

      // 5. PARAMETERS
      H("5. The Parameters Explained"),
      P("The framework uses a small set of measured numbers to calculate everything. Each was derived from 735 actual trips across 13 weeks of driving."),
      sp(80),
      H("5.1 Trip Earning Rate \u2014 \u03C1 (rho)",HeadingLevel.HEADING_2),
      P([{text:"\u03C1 = \u00A329.55 per hour.",bold:true},{text:" The average fare earned per hour of active trip time \u2014 the clock runs only when you have a passenger or are driving to pick one up."}]),
      exBox("What \u03C1 Actually Measures",[
        "If you spend exactly 1 hour with passengers (or en route), you earn \u00A329.55 on average. But you do not spend your entire shift with passengers. Much of the time you are waiting for the next request or repositioning. \u03C1 only counts the productive minutes.",
        "Think of it like a taxi meter: \u03C1 is the average reading when the meter is running. It says nothing about how often the meter is off.",
      ]),
      sp(80),
      H("5.2 Engagement Multiplier \u2014 \u03B1 (alpha)",HeadingLevel.HEADING_2),
      P([{text:"\u03B1 = 1.26.",bold:true},{text:" For every hour of trip time, 1.26 hours of total engaged time are required. The extra 0.26 hours covers waiting between trips, repositioning, queuing."}]),
      exBox("The Waiter Analogy",[
        "A restaurant waiter who serves tables for 6 hours might be at the restaurant for 7.5 hours \u2014 including setup, side work, and waiting. Their \u03B1 would be 7.5/6 = 1.25. They are working the whole time but only earning tips for 6 hours.",
        "For PHV driving, \u03B1 = 1.26 means about 20% of your engaged time is overhead. This is remarkably efficient \u2014 Uber keeps you busy most of the time.",
      ]),
      sp(80),
      H("5.3 Trip Ratio \u2014 r",HeadingLevel.HEADING_2),
      P([{text:"r = 0.687.",bold:true},{text:" Of a 10-hour shift, 68.7% is actual trip time (6.87 hours). The remaining 31.3% is on-shift but not on a trip \u2014 breaks, charging, dead periods, driving between zones."}]),
      P([{text:"How they connect: ",bold:true},{text:"Daily gross = \u03C1 \u00D7 r \u00D7 h = \u00A329.55 \u00D7 0.687 \u00D7 10 = \u00A3203. The composite k = r \u00D7 \u03B1 = 0.866 converts 10 clock hours into 8.66 engaged hours \u2014 the number used for minimum wage calculations."}]),
      sp(80),
      H("5.4 Fixed Cost \u2014 F",HeadingLevel.HEADING_2),
      P([{text:"F = \u00A331.43/day (\u00A3220/week).",bold:true},{text:" Runs every calendar day. Insurance, vehicle finance, phone, MOT, PCO licence, incidentals. On rest days, holidays, sick days \u2014 it never stops."}]),
      sp(80),
      H("5.5 Variable Cost \u2014 v",HeadingLevel.HEADING_2),
      P([{text:"v = \u00A342.00 per working day.",bold:true},{text:" Incurred only when driving. Primarily charging cost (\u00A38.83 per charge at off-peak rates). One 10-hour shift \u2248 one full charge \u2248 200+ miles. Also covers congestion, tyres, maintenance, cleaning."}]),
      exBox("Fixed vs Variable: The Phone Bill Analogy",[
        "Your phone contract costs \u00A330/month whether you make calls or not (fixed). Each call costs 5p per minute (variable). If you make no calls, you still pay \u00A330. If you make lots of calls, you pay \u00A330 plus the per-minute charges.",
        "For PHV driving: insurance and vehicle rent are the \u00A330 monthly fee. Charging the car is the per-minute call cost. Working more days does not increase the insurance bill \u2014 it just adds more charging cost. This is why the number of working days matters so much: more days spread the \u2018phone contract\u2019 across more shifts.",
      ]),
      sp(80),
      H("5.6 Working Density \u2014 \u03B4 (delta)",HeadingLevel.HEADING_2),
      P([{text:"\u03B4 = 0.571.",bold:true},{text:" The fraction of days that are working days. 12/21 = 0.571. This is the single control variable. Once set, every financial and temporal metric follows. Think of it as the one dial you can turn."}]),
      pb(),

      // 6. METRICS
      H("6. What the Metrics Mean"),
      H("6.1 CNHR \u2014 Your True Hourly Rate",HeadingLevel.HEADING_2),
      P([{text:"CNHR(e) = \u00A312.25/hr.",bold:true},{text:" After deducting every cost, this is what you earn per engaged hour."}]),
      exBox("The Payslip Number",[
        "If you were an employee, CNHR(e) would be the number on your payslip after all deductions. Not your gross fare (\u00A329.55/hr), not your daily takings (\u00A3203), but the actual net rate once every cost of operating the vehicle has been subtracted.",
        "At \u00A312.25/hr, you are \u00A30.04 above the National Living Wage. That razor-thin margin is deliberate \u2014 the framework trades income headroom for free time.",
      ]),
      P([{text:"The formula has three terms: ",bold:true}]),
      mkTable(["Term","Value","What It Represents"],[
        ["\u03C1/\u03B1","\u00A323.45/hr","The attractor \u2014 the maximum CNHR could reach with zero costs. Set by the market."],
        ["v/(kh)","\u00A34.85/hr","Variable cost drag \u2014 charging and consumables per engaged hour. Same regardless of days worked."],
        ["F/(kh\u03B4)","\u00A36.35/hr","Fixed cost drag \u2014 the \u00A3220 weekly burden spread across engaged hours. Shrinks as you work more days."],
      ],[1000,1100,5538]),
      sp(120),
      exBox("Why More Days = Higher Rate",[
        "The \u00A3220 weekly fixed cost must be paid regardless. At 4 working days (34.6 engaged hours), each hour carries \u00A36.35 of this burden. At 5 working days (43.3 engaged hours), each hour carries only \u00A35.08.",
        "It is like splitting a restaurant bill: the same \u00A3220 split 4 ways = \u00A355 each. Split 5 ways = \u00A344 each. The bill has not changed; the share per person has.",
      ]),
      sp(80),
      H("6.2 MNHR \u2014 Trip-by-Trip Performance",HeadingLevel.HEADING_2),
      P([{text:"MNHR ",bold:true},{text:"(Marginal Net Hourly Rate) is the earning rate of each individual trip. It fluctuates wildly \u2014 a 5-minute minimum-fare ride might show \u00A348/hr; a 90-minute airport run might show \u00A318/hr. CNHR smooths this out by weighting each trip by its duration, avoiding a statistical bias called the mean-of-ratios problem."}]),
      sp(80),
      H("6.3 NLW \u2014 The Legal Floor",HeadingLevel.HEADING_2),
      P([{text:"NLW = \u00A312.21/hr.",bold:true},{text:" The National Living Wage. Since the Supreme Court classified Uber drivers as workers, CNHR(e) must meet or exceed this. At the current configuration, headroom is \u00A30.04/hr."}]),
      exBox("The Speed Limit",[
        "NLW is like a speed limit. You must not fall below it, but there is no reward for being far above it (under this strategy). Driving at exactly 70mph gets you there just as legally as 90mph. The framework aims for 70.04 \u2014 just barely legal, least fuel burned.",
      ]),
      pb(),

      // 7. TIME-VALUE METRICS
      H("7. Time-Value Metrics"),
      P("The financial metrics confirm the schedule is legal. The time-value metrics tell you whether it is worth living inside."),
      sp(80),
      H("7.1 H(\u03B4) \u2014 Free Hours Per Day",HeadingLevel.HEADING_2),
      P([{text:"H(\u03B4) = 9.71 hours/day (average).",bold:true},{text:" Weighted average across working days (5h) and rest days (16h). Formula: H = 16 \u2212 11\u03B4. In a 7-day week: 4\u00D75 + 3\u00D716 = 68 free hours = 9.71/day."}]),
      sp(80),
      H("7.2 \u03C4 (tau) \u2014 The Exchange Rate",HeadingLevel.HEADING_2),
      P([{text:"\u03C4 = 1.55.",bold:true},{text:" For every clock hour committed to work (including transition), you receive 1.55 hours of free time. \u03C4 > 1 means more free time than work time across the week."}]),
      exBox("The Currency Exchange",[
        "Think of \u03C4 as a bureau de change. Hand over 1 hour of work, receive 1.55 hours of freedom. That is a favourable rate.",
        "Across a working week: you commit 44 hours (4\u00D711h) and receive 68 hours of freedom. At 5 working days, \u03C4 drops to 1.05. At 6 days, \u03C4 = 0.70 \u2014 work-dominant.",
      ]),
      sp(80),
      H("7.3 \u03C0 (pi) \u2014 The Price of Freedom",HeadingLevel.HEADING_2),
      P("\u03C0 answers: what income do you forgo for each free hour gained by not working an additional day?"),
      P([{text:"Marginal \u03C0 = \u00A314.64/hr (constant, the decision metric). ",bold:true},{text:"Each rest day costs \u00A3161 of net income (gross minus variable cost) and provides 11 extra free hours. \u00A3161/11 = \u00A314.64. Same whether it is your 9th or 15th working day \u2014 no diminishing returns."}]),
      P([{text:"Average \u03C0 = \u00A36.24/hr (varies, descriptive only). ",bold:true},{text:"Total net earnings \u00F7 total free hours. Lower than marginal because it includes cost recovery overhead. At current \u03B4, about 57% of each working day is just paying rent."}]),
      exBox("Should You Work an Extra Day?",[
        "Decision rule: if a free hour is worth more than \u00A314.64, do not add a working day.",
        [{text:"Career example: ",bold:true},{text:"Cybersecurity traineeship study hour = \u00A335,000 \u00F7 1,311 = \u00A326.70. Since \u00A326.70 > \u00A314.64, every study hour earns more than driving. Minimise working days."}],
        [{text:"Leisure example: ",bold:true},{text:"If you value relaxation at \u00A310/hr, then \u00A310 < \u00A314.64 \u2014 work the extra day. But NLW already forces 12 days regardless."}],
      ]),
      sp(80),
      H("7.4 \u03B7 (eta) \u2014 Study Conversion",HeadingLevel.HEADING_2),
      P([{text:"\u03B7 \u2265 0.55.",bold:true},{text:" The fraction of free hours that must become productive study to meet 1,311 hours by November 2026. On working days: ~2.75h study out of 5h free. On rest days: ~8.8h out of 16h. The rest-day figure is demanding. \u03B7 is tracked during the trial, not assumed."}]),
      pb(),

      // 8. DECISION RULE
      H("8. The Decision Rule"),
      P([{text:"Work if marginal \u03C0 (\u00A314.64) < value of a free hour. Otherwise, stop.",bold:true}]),
      P("Since marginal \u03C0 is constant, the decision is binary. Two forces resolve it:"),
      P([{text:"NLW constraint: ",bold:true},{text:"At \u03C1 = \u00A329.55, minimum \u03B4 for NLW = 11.93 days \u2192 rounds to 12. You cannot legally work fewer."}]),
      P([{text:"Career transition value: ",bold:true},{text:"Study hour = \u00A326.70 > \u00A314.64. Every free hour spent studying earns more than driving. Minimise days; NLW sets floor at 12."}]),
      exBox("Why Not Just Work More and Save?",[
        "Working 15 days instead of 12 generates an extra \u00A3635/month. But it costs 33 hours of free time per cycle \u2014 worth 33 \u00D7 \u00A326.70 = \u00A3881 in study value. You gain \u00A3635 cash but lose \u00A3881 in future career value. The study trade is nearly 40% more valuable.",
      ]),

      // 9. MONITORING SYSTEM
      H("9. The Monitoring System"),
      P("The schedule includes a built-in feedback system \u2014 not ad hoc rules but a mathematically grounded control system, like a thermostat."),
      sp(80),
      H("9.1 The Thermostat Analogy",HeadingLevel.HEADING_2),
      exBox("How a Thermostat Works",[
        "A thermostat has three parts: a target temperature (20\u00B0C), a sensor (thermometer), and an actuator (boiler). Sensor reads below target \u2192 boiler on. Reaches target \u2192 boiler off. Self-correcting.",
        "The work schedule operates identically:",
        [{text:"  Target: ",bold:true},{text:"NLW = \u00A312.21/hr (the temperature you must maintain)"}],
        [{text:"  Sensor: ",bold:true},{text:"Day-3 checkpoint at \u00A3608 cumulative (the thermometer)"}],
        [{text:"  Actuator: ",bold:true},{text:"Add a working day / sacrifice a rest day (the boiler)"}],
        "Below target on Wednesday evening \u2192 actuator fires (Friday becomes a working day). On target or above \u2192 rest days protected.",
      ]),
      sp(80),
      H("9.2 Property 1: The NLW Attractor",HeadingLevel.HEADING_2),
      P("When you minimise work to the NLW boundary, CNHR(e) collapses to exactly \u00A312.21 regardless of trip rate \u03C1. This is algebraic \u2014 substituting minimum \u03B4 back into the formula causes \u03C1 to cancel. Higher productivity \u2192 fewer required days, not higher pay. The framework is a subsistence optimiser."),
      sp(80),
      H("9.3 Property 2: Why Day 3 (Wednesday)?",HeadingLevel.HEADING_2),
      P([{text:"Enough data: ",bold:true},{text:"After 30 shift hours, cost recovery noise has decayed enough that genuine performance variation is visible. Day 1 tells you almost nothing; Day 3 gives a clear picture."}]),
      P([{text:"Last moment to act: ",bold:true},{text:"The sacrifice decision (add Friday) must be made Wednesday evening. Day 4 gives better data but no time to act within the current week."}]),
      P("Day 3 is where these constraints cross: enough data to project reliably, and the last moment to enact a correction."),
      sp(80),
      H("9.4 Property 3: Why Adding a Day Beats Chasing Better Trips",HeadingLevel.HEADING_2),
      P([{text:"Adjusting how many days you work moves CNHR 14\u00D7 more effectively than improving trip rates.",bold:true},{text:" This is a mathematical consequence of large fixed costs, not a data accident."}]),
      exBox("Why \u2018Work Smarter\u2019 Does Not Apply Here",[
        "In many jobs, earning more per hour beats working longer. For PHV driving, the opposite holds. The \u00A3220 weekly fixed cost creates leverage: each extra day spreads the same burden across more hours.",
        "Improving \u03C1 by \u00A31/hr raises CNHR by \u00A30.79. Working one extra day raises it comparably per unit \u03B4. But \u03B4 can change by a full day while \u03C1 fluctuates randomly. The sacrifice rule (adding Friday) is the correct response to underperformance \u2014 not surge-chasing.",
      ]),

      // 10. MONITORING TABLE
      H("10. The Monitoring Table"),
      P("Each week follows this progression:",{after:120}),
      mkTable(["After shift","Cumul. target","If below","If above"],[
        ["Day 1 (Mon)","\u00A3203","Note only \u2014 too early to tell","On track"],
        ["Day 2 (Tue)","\u00A3406","Trend forming \u2014 be alert","On track"],
        [{text:"Day 3 (Wed)",bold:true},{text:"\u00A3608",bold:true},{text:"FLAG: sacrifice a rest day",bold:true,color:"CC0000"},{text:"Rest days protected",bold:true,color:"28a745"}],
        ["Day 4 (Thu)","\u00A3811","Record & assess for next week","NLW compliant"],
      ],[1400,1400,2600,2238]),
      sp(120),
      H("10.1 The Sacrifice Rule",HeadingLevel.HEADING_2),
      P("When below \u00A3608 at Day 3, convert one rest day to working for that week only:"),
      mkTable(["Priority","Day","Demand Score","Notes"],[
        ["1st choice","Friday","10/20","Highest rest-day demand. Most likely to recover the shortfall."],
        ["2nd choice","Saturday","8/20","Moderate demand. Use only if Friday insufficient."],
        ["Never","Sunday","6/20","Structurally dead 04:00\u201308:00. Always protected."],
      ],[1200,1000,1200,4238]),
      sp(120),
      P("A sacrifice converts the week from 4-on-3-off to 5-on-2-off for that week only. Maximum one sacrifice per week."),
      P([{text:"Regime change: ",bold:true},{text:"Two consecutive sacrifice weeks \u2192 the assumed \u03C1 is not achievable. Revert to d=13 fallback permanently and reassess."}]),
      pb(),

      // 11. FALLBACK
      H("11. The Fallback Pattern (d=13)"),
      P("If \u03C1 consistently falls below \u00A3203/day, the schedule reverts to 13 working days per cycle. This is the reason the cycle is 3 weeks long \u2014 13 days cannot be distributed evenly across identical weeks.",{after:160}),
      mkTable(["","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],[
        ["Week 1","WORK","WORK","WORK","WORK","REST","WORK","REST"],
        ["Week 2","WORK","WORK","WORK","WORK","REST","WORK","REST"],
        ["Week 3","WORK","WORK","WORK","REST","REST","REST","REST"],
      ],[1000,948,948,948,948,948,948,950]),
      sp(120),
      P([{text:"Structure: ",bold:true},{text:"Weeks 1\u20132 are heavier (5 working days each), with rest on Friday and Sunday \u2014 preserving weekend bookends. Saturday is an isolated working day. Week 3 is a recovery week (3 days, Mon\u2013Wed), followed by a 4-day rest block Thursday\u2013Sunday."}]),
      P([{text:"Why Friday and Sunday? ",bold:true},{text:"Friday has the highest demand among rest days (10/20), but resting on Friday and Sunday gives two non-consecutive breaks \u2014 one at the start and one at the end of the weekend \u2014 while capturing Saturday\u2019s demand. Sunday is structurally dead in the early morning (04:00\u201308:00), making it the weakest earning day."}]),
      P("Maximum consecutive working days: 4 (Mon\u2013Thu in weeks 1\u20132). Same K=4 as the primary. Week 3 maximum is 3 (Mon\u2013Wed)."),
      sp(80),
      H("11.1 Fallback Metrics",HeadingLevel.HEADING_2),
      mkTable(["Metric","Primary (d=12)","Fallback (d=13)"],[
        ["Daily floor","\u00A3203","\u00A3199"],
        ["CNHR(e)","\u00A312.25/hr","\u00A312.39/hr"],
        ["NLW headroom","+\u00A30.04/hr","+\u00A30.18/hr"],
        ["\u03C4 (free hrs per hr worked)","1.55","1.35"],
        ["\u03C0 marginal","\u00A314.64/hr","\u00A314.36/hr"],
        ["Monthly net","\u00A31,844","\u00A32,021"],
        ["\u03B7 required","\u22650.55","\u22650.59"],
      ],[2500,2569,2569]),
      sp(120),
      P("The fallback earns more per month (\u00A32,021 vs \u00A31,844) but \u03C4 drops from 1.55 to 1.35 (less freedom per hour worked) and \u03B7 rises from 0.55 to 0.59 (more study required per free hour). More financial headroom, less time for study."),
      exBox("When to Use the Fallback",[
        "The fallback is not a failure \u2014 it is a pre-planned gear change. If daily earnings average \u00A3190 instead of \u00A3203, the framework shifts to d=13 (NLW-compliant at \u00A3199/day). The architecture was designed with this contingency built in.",
      ]),

      // 12. CONSTRAINTS
      H("12. Regulatory and Platform Constraints"),
      P("The 40-hour week operates within three constraint layers. None are currently binding."),
      P([{text:"Uber platform: ",bold:true},{text:"Disconnects after 10 hours of trip time, then 6-hour offline break. At r = 0.687, a 10-hour clock shift produces only 6.87 hours of trip time \u2014 well under the cap. You would need a 14.5-hour shift to hit it."}]),
      P([{text:"Working Time Regulations: ",bold:true},{text:"11 hours rest between shifts, 48-hour weekly average (opt-out available), 24 hours rest per 7-day period. The current pattern provides 13 hours between shifts and full rest days every week."}]),
      P([{text:"Practical fatigue: ",bold:true},{text:"Hours 9\u201310 of a shift carry disproportionate accident risk. The 10-hour shift is a safety boundary, not just a scheduling convenience."}]),
      pb(),

      // 13. PENDING
      H("13. What Remains to Be Validated"),
      P("The framework is trial-ready. The mathematics are verified, the tables are consistent, and the monitoring protocol is operational. Outstanding parameters require real-world data:",{after:160}),
      mkTable(["Parameter","Current Status","Resolution"],[
        ["\u03C1 (day shift rate)","Target \u00A329.55/hr, not yet measured","2\u20133 weeks of trial data"],
        ["\u03B1 (engagement)","1.26 from night data; day may differ","Re-measure during trial"],
        ["K=4 (consecutive days)","Untested for day shifts","Observe fatigue over 2\u20133 weeks"],
        ["v_per_hour","Naive \u00A34.20; needs refinement","Correlate charging receipts with hours"],
        ["\u03B7 (study conversion)","Required \u22650.55; unobserved","Track weekly during trial"],
      ],[1800,2919,2919]),
      sp(160),
      P([{text:"The trial validates the inputs; the architecture is sound. ",bold:true},{text:"If \u03C1 is higher than expected, the framework reduces required days \u2014 converting the surprise into free time. If lower, the fallback activates via the sacrifice rule."}]),

      // 14. DOCUMENT CHAIN
      H("14. Document Reference"),
      P("The framework is a layered set of documents. Information flows one direction: core \u2192 applications \u2192 evaluation.",{after:160}),
      mkTable(["Document","Layer","Question It Answers"],[
        ["CORE-001","Core","How do we measure earnings? (CNHR, MNHR, attractor, convergence)"],
        ["APP-001 (SOM)","Application","How many days, what pattern? (Costs, \u03B4, monitoring, sacrifice rule)"],
        ["APP-002","Application","Is this schedule liveable? (\u03C4, \u03C0, H(\u03B4), \u03B7)"],
        ["ARCH-001","Architecture","How does it fit together? (Properties 1\u20133, control system, history)"],
        ["cnhr_calculator.py","Reference","What are the exact numbers? (Single source of truth)"],
        ["Work Schedule PDF","Operational","What do I do each day? (One-page printable)"],
        ["This document","Companion","What does it all mean?"],
      ],[1800,1200,4638]),
      sp(200),
      P([{text:"End of Companion Guide.",italics:true,color:"999999"}],{align:AlignmentType.CENTER}),
    ],
  }],
});

Packer.toBuffer(doc).then(b=>{fs.writeFileSync("/home/claude/Work_Schedule_Companion_Guide.docx",b);console.log("Companion guide created successfully");});
