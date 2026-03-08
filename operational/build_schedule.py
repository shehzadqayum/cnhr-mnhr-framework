from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle

W, H = A4

# Colours
BLUE = HexColor("#1F4E79")
ACCENT = HexColor("#2E75B6")
LIGHT = HexColor("#E8F0F8")
GREEN = HexColor("#D4EDDA")
GREEN_DARK = HexColor("#28a745")
AMBER = HexColor("#FFF3CD")
RED_LIGHT = HexColor("#F8D7DA")
GREY = HexColor("#F2F2F2")
DARK = HexColor("#2D2D2D")
WHITE = white

OUTPUT = "/home/claude/Work_Schedule_21Day_Cycle.pdf"
c = canvas.Canvas(OUTPUT, pagesize=A4)

# Margins
LM = 18*mm
RM = W - 18*mm
TM = H - 15*mm
BM = 15*mm
CW = RM - LM

# ============================================================================
# HEADER
# ============================================================================
c.setFillColor(BLUE)
c.rect(0, H - 28*mm, W, 28*mm, fill=1, stroke=0)

c.setFillColor(WHITE)
c.setFont("Helvetica-Bold", 18)
c.drawString(LM, H - 14*mm, "WORK SCHEDULE")
c.setFont("Helvetica", 11)
c.drawString(LM, H - 21*mm, "21-Day Cycle  |  12 Working Days  |  04:00\u201314:00 Shift")
c.setFont("Helvetica", 8)
c.drawRightString(RM, H - 14*mm, "CNHR Framework v4.0  |  APP-001 + ARCH-001")
c.drawRightString(RM, H - 21*mm, "Target: \u00A3203/day  |  \u03B4 = 0.571  |  Pattern: 4-on-3-off")

y = H - 35*mm

# ============================================================================
# DAILY SCHEDULE STRIP
# ============================================================================
c.setFillColor(BLUE)
c.setFont("Helvetica-Bold", 10)
c.drawString(LM, y, "DAILY SCHEDULE (WORKING DAY)")
y -= 5*mm

# Time blocks proportional
hours = [0.25, 10, 1, 5, 7.75]  # wake, shift, transition, free, sleep
labels = [
    ("03:45", "Wake", GREY),
    ("04:00", "SHIFT (10h)", ACCENT),
    ("14:00", "Transit", GREY),
    ("15:00", "Free (5h)", GREEN),
    ("20:00", "SLEEP (8h)", HexColor("#C5CAE9")),
]

total_h = sum(hours)
bar_h = 8*mm
bx = LM
for i, (time_label, desc, col) in enumerate(labels):
    bw = (hours[i] / total_h) * CW
    c.setFillColor(col)
    c.rect(bx, y - bar_h, bw, bar_h, fill=1, stroke=0)
    c.setFillColor(DARK if col != ACCENT else WHITE)
    c.setFont("Helvetica-Bold", 6.5)
    if bw > 12*mm:
        c.drawString(bx + 1.5*mm, y - 3.5*mm, time_label)
        c.setFont("Helvetica", 6)
        c.drawString(bx + 1.5*mm, y - 6.5*mm, desc)
    bx += bw

y -= bar_h + 5*mm

# ============================================================================
# 3-WEEK SCHEDULE TABLE
# ============================================================================
c.setFillColor(BLUE)
c.setFont("Helvetica-Bold", 10)
c.drawString(LM, y, "3-WEEK CYCLE (EVERY WEEK IDENTICAL)")
y -= 3*mm

days_hdr = ["", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
w1 = ["Week 1", "WORK", "WORK", "WORK", "WORK", "REST", "REST", "REST"]
w2 = ["Week 2", "WORK", "WORK", "WORK", "WORK", "REST", "REST", "REST"]
w3 = ["Week 3", "WORK", "WORK", "WORK", "WORK", "REST", "REST", "REST"]

col_w = CW / 8
t = Table([days_hdr, w1, w2, w3], colWidths=[col_w]*8,
          rowHeights=[7*mm, 9*mm, 9*mm, 9*mm])

style_cmds = [
    ('BACKGROUND', (0,0), (-1,0), BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,0), 8),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('FONTNAME', (0,1), (0,-1), 'Helvetica-Bold'),
    ('FONTSIZE', (0,1), (-1,-1), 9),
    ('GRID', (0,0), (-1,-1), 0.5, HexColor("#CCCCCC")),
    ('BACKGROUND', (0,1), (0,3), GREY),
    ('FONTSIZE', (0,1), (0,-1), 8),
]

for row_idx, row_data in enumerate([w1, w2, w3], start=1):
    for col_idx in range(1, 8):
        if row_data[col_idx] == "WORK":
            style_cmds.append(('BACKGROUND', (col_idx, row_idx), (col_idx, row_idx), LIGHT))
            style_cmds.append(('TEXTCOLOR', (col_idx, row_idx), (col_idx, row_idx), BLUE))
            style_cmds.append(('FONTNAME', (col_idx, row_idx), (col_idx, row_idx), 'Helvetica-Bold'))
        else:
            style_cmds.append(('BACKGROUND', (col_idx, row_idx), (col_idx, row_idx), GREEN))
            style_cmds.append(('TEXTCOLOR', (col_idx, row_idx), (col_idx, row_idx), GREEN_DARK))
            style_cmds.append(('FONTNAME', (col_idx, row_idx), (col_idx, row_idx), 'Helvetica-Bold'))

t.setStyle(TableStyle(style_cmds))
tw, th = t.wrapOn(c, CW, 200*mm)
t.drawOn(c, LM, y - th)
y -= th + 3*mm

c.setFont("Helvetica", 7.5)
c.setFillColor(DARK)
c.drawString(LM, y,
    "Working: 12 days (4+4+4)   |   Rest: 9 days (3+3+3)   |   "
    "Max consecutive: 4 (Mon\u2013Thu)   |   40 clock hrs/week   |   "
    "Engaged: 8.66 hrs/shift")
y -= 7*mm

# ============================================================================
# KEY METRICS - Two column layout
# ============================================================================
c.setFillColor(BLUE)
c.setFont("Helvetica-Bold", 10)
c.drawString(LM, y, "KEY METRICS (from cnhr_calculator.py)")
y -= 3*mm

left_data = [
    ["FINANCIAL", "", ""],
    ["Daily floor (= target)", "", "\u00A3203"],
    ["Net contribution/day", "", "\u00A3161"],
    ["Monthly net income", "", "\u00A31,844"],
    ["CNHR(e)", "", "\u00A312.25/hr"],
    ["NLW headroom", "", "+\u00A30.04/hr"],
    ["Fixed cost F (per day)", "", "\u00A331.43"],
    ["Variable cost v (per day)", "", "\u00A342.00"],
]

right_data = [
    ["TIME & FREEDOM", "", ""],
    ["Free hrs/day (avg H(\u03B4))", "", "9.71h"],
    ["Free hrs (work day / rest day)", "", "5h / 16h"],
    ["\u03C4 (free hrs per hr worked)", "", "1.55"],
    ["\u03C0 marginal (decision metric)", "", "\u00A314.64/hr"],
    ["\u03C0 average (descriptive)", "", "\u00A36.24/hr"],
    ["\u03B7 required (study target)", "", "\u22650.55"],
    ["Weekly hours (clock / engaged)", "", "40 / 34.6"],
]

half_w = CW / 2 - 2*mm
lcol = [half_w * 0.65, half_w * 0.05, half_w * 0.30]

def make_metric_table(data, col_widths):
    t = Table(data, colWidths=col_widths, rowHeights=[7*mm] + [6*mm] * (len(data)-1))
    style = [
        ('BACKGROUND', (0,0), (-1,0), BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), WHITE),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 8),
        ('FONTNAME', (0,1), (0,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 7.5),
        ('FONTNAME', (2,1), (2,-1), 'Helvetica-Bold'),
        ('ALIGN', (2,0), (2,-1), 'RIGHT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('GRID', (0,0), (-1,-1), 0.3, HexColor("#DDDDDD")),
        ('LINEBELOW', (0,0), (-1,0), 1, BLUE),
    ]
    for i in range(1, len(data)):
        if i % 2 == 0:
            style.append(('BACKGROUND', (0,i), (-1,i), GREY))
    t.setStyle(TableStyle(style))
    return t

lt = make_metric_table(left_data, lcol)
rt = make_metric_table(right_data, lcol)

ltw, lth = lt.wrapOn(c, half_w, 200*mm)
rtw, rth = rt.wrapOn(c, half_w, 200*mm)
max_h = max(lth, rth)

lt.drawOn(c, LM, y - max_h)
rt.drawOn(c, LM + half_w + 4*mm, y - max_h)
y -= max_h + 6*mm

# ============================================================================
# MONITORING PROTOCOL (CONTROL SYSTEM)
# ============================================================================
c.setFillColor(BLUE)
c.setFont("Helvetica-Bold", 10)
c.drawString(LM, y, "MONITORING PROTOCOL (CONTROL SYSTEM \u2014 ARCH-001 \u00A73.4)")
y -= 3*mm

mon_data = [
    ["After shift", "Cumul. target", "If below", "If above"],
    ["Day 1 (Mon)", "\u00A3203", "Note only", "On track"],
    ["Day 2 (Tue)", "\u00A3406", "Trend forming", "On track"],
    ["Day 3 (Wed)", "\u00A3608", "FLAG: sacrifice rest day", "Rest days protected"],
    ["Day 4 (Thu)", "\u00A3811", "Record & assess", "NLW compliant"],
]

mon_col = [CW*0.15, CW*0.18, CW*0.35, CW*0.32]
mt = Table(mon_data, colWidths=mon_col, rowHeights=[7*mm]*5)
mon_style = [
    ('BACKGROUND', (0,0), (-1,0), BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), WHITE),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('FONTSIZE', (0,0), (-1,-1), 8),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('GRID', (0,0), (-1,-1), 0.3, HexColor("#DDDDDD")),
    ('BACKGROUND', (0,3), (0,3), AMBER),
    ('BACKGROUND', (1,3), (1,3), AMBER),
    ('BACKGROUND', (2,3), (2,3), RED_LIGHT),
    ('BACKGROUND', (3,3), (3,3), GREEN),
    ('FONTNAME', (0,3), (-1,3), 'Helvetica-Bold'),
    ('BACKGROUND', (0,1), (-1,1), WHITE),
    ('BACKGROUND', (0,2), (-1,2), GREY),
    ('BACKGROUND', (0,4), (-1,4), GREY),
]
mt.setStyle(TableStyle(mon_style))
mtw, mth = mt.wrapOn(c, CW, 200*mm)
mt.drawOn(c, LM, y - mth)
y -= mth + 2.5*mm

# Sacrifice + control system note
c.setFont("Helvetica-Bold", 7)
c.setFillColor(DARK)
c.drawString(LM, y, "Sacrifice rule:")
c.setFont("Helvetica", 7)
c.drawString(LM + 20*mm, y,
    "If below at Day 3 (Wed), add Friday (demand score 10). Second choice: Saturday (score 8). "
    "Sunday never sacrificed. Max 1/week.")
y -= 4*mm
c.setFont("Helvetica-Bold", 7)
c.drawString(LM, y, "Control loop:")
c.setFont("Helvetica", 7)
c.drawString(LM + 20*mm, y,
    "Target = NLW \u00A312.21 (Property 1)  |  Sensor = Day 3 at s=30h (Property 2)  |  "
    "Actuator = \u03B4 adjustment (Property 3: 14\u00D7 leverage)")
y -= 4*mm
c.setFont("Helvetica-Bold", 7)
c.drawString(LM, y, "Regime change:")
c.setFont("Helvetica", 7)
c.drawString(LM + 22*mm, y,
    "Two consecutive sacrifice weeks \u2192 revert to d=13 fallback permanently. Reassess \u03C1.")
y -= 7*mm

# ============================================================================
# DECISION RULE BOX
# ============================================================================
box_h = 16*mm
c.setFillColor(LIGHT)
c.roundRect(LM, y - box_h, CW, box_h, 3*mm, fill=1, stroke=0)
c.setStrokeColor(ACCENT)
c.setLineWidth(1.5)
c.roundRect(LM, y - box_h, CW, box_h, 3*mm, fill=0, stroke=1)

c.setFillColor(BLUE)
c.setFont("Helvetica-Bold", 9)
c.drawCentredString(W/2, y - 5*mm, "DECISION RULE")
c.setFont("Helvetica", 7.5)
c.setFillColor(DARK)
c.drawCentredString(W/2, y - 10*mm,
    "Work if marginal \u03C0 (\u00A314.64/hr) < value of a free hour.   "
    "Study hour value \u2248 \u00A326.70.   \u00A326.70 > \u00A314.64  \u2192  minimise working days.")
c.drawCentredString(W/2, y - 14*mm,
    "NLW sets floor at d=12.   Every free hour converted to study earns more than working it.")

y -= box_h + 5*mm

# ============================================================================
# FALLBACK STRIP
# ============================================================================
c.setFillColor(GREY)
c.rect(LM, y - 12*mm, CW, 12*mm, fill=1, stroke=0)
c.setStrokeColor(HexColor("#CCCCCC"))
c.rect(LM, y - 12*mm, CW, 12*mm, fill=0, stroke=1)

c.setFillColor(DARK)
c.setFont("Helvetica-Bold", 7.5)
c.drawString(LM + 3*mm, y - 4.5*mm, "FALLBACK (d=13, \u03C1 < \u00A3203/day):")
c.setFont("Helvetica", 7)
c.drawString(LM + 3*mm, y - 9*mm,
    "Wk 1\u20132: WWWRWWR   |   Wk 3: WWWRRRR   |   "
    "Max consec: 3   |   Floor: \u00A3199/day   |   "
    "CNHR(e): \u00A312.39   |   \u03C4 = 1.35   |   "
    "Net: \u00A32,021/mo")
y -= 17*mm

# ============================================================================
# FOOTER
# ============================================================================
c.setStrokeColor(ACCENT)
c.setLineWidth(0.5)
c.line(LM, BM + 6*mm, RM, BM + 6*mm)
c.setFont("Helvetica-Oblique", 6)
c.setFillColor(ACCENT)
c.drawString(LM, BM + 1*mm,
    "Confidential  \u2022  Shehzad Qayum  \u2022  March 2026  \u2022  "
    "\u03C1 = \u00A329.55/hr (\u00A3203/day)  \u2022  "
    "Pending trial validation")
c.drawRightString(RM, BM + 1*mm, "cnhr_calculator.py  |  Framework v4.0-4on3off")

c.save()
print("Work schedule PDF created successfully")
