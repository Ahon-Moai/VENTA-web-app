import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#080b0f;--bg2:#0e1117;--bg3:#141820;--bg4:#1c2230;
      --border:#1f2a3a;--border2:#253040;
      --accent:#00c9ff;--accent2:#0098cc;--accent3:#00fff0;
      --red:#ff4d6d;--green:#00e5a0;--yellow:#ffc740;--orange:#ff8c42;--purple:#a78bfa;
      --text:#e8edf5;--text2:#8a97aa;--text3:#4a5568;
      font-family:'DM Sans',sans-serif;
      color-scheme:dark;
    }
    body{background:var(--bg);color:var(--text);min-height:100vh}
    h1,h2,h3,h4,h5{font-family:'Syne',sans-serif}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:var(--bg2)}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
    input,textarea,select{font-family:'DM Sans',sans-serif}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fade-in{animation:fadeIn .3s ease}
    .slide-in{animation:slideIn .25s ease}
    .kanban-col{min-height:300px;transition:background .2s}
    .kanban-col.drag-over{background:rgba(0,201,255,.06)!important;border-color:var(--accent)!important}
    .kanban-card{cursor:grab;transition:transform .15s,box-shadow .15s}
    .kanban-card:active{cursor:grabbing;transform:rotate(1deg);box-shadow:0 8px 32px rgba(0,0,0,.5)}
    .kanban-card.dragging{opacity:.4}
    .btn{cursor:pointer;border:none;outline:none;font-family:'DM Sans',sans-serif;font-weight:500;transition:all .15s;display:inline-flex;align-items:center;gap:6px}
    .btn:active{transform:scale(.97)}
    .input{background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:9px 13px;font-size:14px;width:100%;outline:none;transition:border .15s}
    .input:focus{border-color:var(--accent)}
    .select{background:var(--bg3);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:9px 13px;font-size:14px;outline:none;cursor:pointer;transition:border .15s}
    .select:focus{border-color:var(--accent)}
    .tag{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.3px}
    .tooltip{position:relative}
    .tooltip:hover::after{content:attr(data-tip);position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);background:#1c2230;color:var(--text);font-size:11px;padding:4px 8px;border-radius:6px;white-space:nowrap;border:1px solid var(--border);pointer-events:none;z-index:100}
    .stat-card{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:20px;transition:border .2s,transform .15s}
    .stat-card:hover{border-color:var(--border2);transform:translateY(-1px)}
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .15s ease}
    .modal{background:var(--bg2);border:1px solid var(--border2);border-radius:16px;padding:28px;width:min(560px,95vw);max-height:90vh;overflow-y:auto;animation:fadeIn .2s ease}
    .sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:10px;cursor:pointer;transition:all .15s;font-size:14px;font-weight:500;color:var(--text2);border:1px solid transparent}
    .sidebar-item:hover{background:var(--bg3);color:var(--text)}
    .sidebar-item.active{background:rgba(0,201,255,.1);color:var(--accent);border-color:rgba(0,201,255,.15)}
    .progress-bar{height:4px;background:var(--bg4);border-radius:2px;overflow:hidden}
    .progress-fill{height:100%;border-radius:2px;transition:width .5s ease}
    table{width:100%;border-collapse:collapse}
    th{text-align:left;padding:10px 14px;font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:var(--text3);border-bottom:1px solid var(--border)}
    td{padding:11px 14px;font-size:13.5px;border-bottom:1px solid var(--border);vertical-align:middle}
    tr:hover td{background:rgba(255,255,255,.02)}
    .notification-dot{width:8px;height:8px;background:var(--red);border-radius:50%;animation:pulse 2s infinite}
  `}</style>
);

/* ─── Seed Data ─── */
const SEED = {
  users: [
    {
      id: "u1",
      name: "Alex Rivera",
      email: "alex@venta.studio",
      role: "admin",
      avatar: "AR",
      password: "admin123",
      department: "Management",
    },
    {
      id: "u2",
      name: "Sarah Kim",
      email: "sarah@venta.studio",
      role: "employee",
      avatar: "SK",
      password: "emp123",
      department: "Sales",
    },
    {
      id: "u3",
      name: "Marcus Dev",
      email: "marcus@venta.studio",
      role: "employee",
      avatar: "MD",
      password: "emp123",
      department: "Design",
    },
  ],
  leads: [
    {
      id: "l1",
      name: "Jordan Blake",
      company: "BlakeMedia Co",
      email: "jordan@blakemedia.com",
      phone: "+1 555-0101",
      source: "Cold DM",
      status: "Interested",
      tags: ["Hot Lead", "High Ticket"],
      notes: "Very responsive, wants website + social",
      followUpDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      assignedTo: "u2",
      dealValue: 8500,
      createdAt: "2025-03-10",
    },
    {
      id: "l2",
      name: "Priya Sharma",
      company: "TechStart Inc",
      email: "priya@techstart.io",
      phone: "+1 555-0202",
      source: "Referral",
      status: "Contacted",
      tags: ["High Ticket"],
      notes: "Needs full brand overhaul",
      followUpDate: new Date().toISOString().split("T")[0],
      assignedTo: "u2",
      dealValue: 15000,
      createdAt: "2025-03-12",
    },
    {
      id: "l3",
      name: "David Chen",
      company: "Chen Logistics",
      email: "d.chen@chenlog.com",
      phone: "+1 555-0303",
      source: "Ads",
      status: "New",
      tags: [],
      notes: "Clicked Google ad for web design",
      followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      assignedTo: "u3",
      dealValue: 3200,
      createdAt: "2025-03-14",
    },
    {
      id: "l4",
      name: "Emma Wilson",
      company: "WilsonFit",
      email: "emma@wilsonfit.co",
      phone: "+1 555-0404",
      source: "Instagram",
      status: "Closed",
      tags: ["Hot Lead"],
      notes: "Signed! New website + branding",
      followUpDate: "",
      assignedTo: "u2",
      dealValue: 5800,
      createdAt: "2025-03-01",
    },
    {
      id: "l5",
      name: "Tom Nakamura",
      company: "Nakamura Realty",
      email: "tom@nakamurarealtor.com",
      phone: "+1 555-0505",
      source: "Cold DM",
      status: "Lost",
      tags: [],
      notes: "Went with another agency",
      followUpDate: "",
      assignedTo: "u3",
      dealValue: 0,
      createdAt: "2025-02-28",
    },
    {
      id: "l6",
      name: "Lisa Grant",
      company: "Grant Wellness",
      email: "lisa@grantwellness.com",
      phone: "+1 555-0606",
      source: "Referral",
      status: "Interested",
      tags: ["Hot Lead", "High Ticket"],
      notes: "Ready to move forward next week",
      followUpDate: new Date(Date.now() + 172800000)
        .toISOString()
        .split("T")[0],
      assignedTo: "u2",
      dealValue: 12000,
      createdAt: "2025-03-15",
    },
  ],
  clients: [
    {
      id: "c1",
      name: "Emma Wilson",
      company: "WilsonFit",
      email: "emma@wilsonfit.co",
      phone: "+1 555-0404",
      projectDetails: "Website redesign + brand identity",
      paymentStatus: "Paid",
      totalValue: 5800,
      paidAmount: 5800,
      startDate: "2025-03-05",
      notes: "Great client, very clear on vision",
      leadId: "l4",
    },
    {
      id: "c2",
      name: "Rachel Torres",
      company: "Torres Bakery",
      email: "rachel@torresbakery.com",
      phone: "+1 555-0707",
      projectDetails: "E-commerce website",
      paymentStatus: "Partial",
      totalValue: 4500,
      paidAmount: 2250,
      startDate: "2025-02-20",
      notes: "Needs extra attention on product photos",
      leadId: null,
    },
  ],
  projects: [
    {
      id: "p1",
      clientId: "c1",
      name: "WilsonFit Rebrand",
      status: "In Progress",
      deadline: "2025-04-15",
      progress: 65,
      tasks: [
        {
          id: "t1",
          title: "Logo Design",
          status: "Done",
          assignedTo: "u3",
          deadline: "2025-03-20",
          priority: "High",
        },
        {
          id: "t2",
          title: "Homepage Wireframes",
          status: "Done",
          assignedTo: "u3",
          deadline: "2025-03-25",
          priority: "High",
        },
        {
          id: "t3",
          title: "Website Development",
          status: "In Progress",
          assignedTo: "u3",
          deadline: "2025-04-10",
          priority: "High",
        },
        {
          id: "t4",
          title: "Content Writing",
          status: "To Do",
          assignedTo: "u2",
          deadline: "2025-04-05",
          priority: "Medium",
        },
        {
          id: "t5",
          title: "Final QA & Launch",
          status: "To Do",
          assignedTo: "u3",
          deadline: "2025-04-14",
          priority: "High",
        },
      ],
    },
    {
      id: "p2",
      clientId: "c2",
      name: "Torres Bakery E-Commerce",
      status: "In Progress",
      deadline: "2025-05-01",
      progress: 30,
      tasks: [
        {
          id: "t6",
          title: "Product Catalog Setup",
          status: "In Progress",
          assignedTo: "u3",
          deadline: "2025-04-01",
          priority: "High",
        },
        {
          id: "t7",
          title: "Payment Integration",
          status: "To Do",
          assignedTo: "u3",
          deadline: "2025-04-15",
          priority: "High",
        },
        {
          id: "t8",
          title: "Photography Brief",
          status: "Done",
          assignedTo: "u2",
          deadline: "2025-03-22",
          priority: "Low",
        },
      ],
    },
  ],
  outreach: [
    {
      id: "o1",
      date: new Date().toISOString().split("T")[0],
      userId: "u2",
      sent: 24,
      replies: 7,
      calls: 3,
      dms: 21,
      notes: "Good day, found 3 warm leads",
    },
    {
      id: "o2",
      date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      userId: "u2",
      sent: 18,
      replies: 4,
      calls: 1,
      dms: 17,
      notes: "",
    },
    {
      id: "o3",
      date: new Date().toISOString().split("T")[0],
      userId: "u3",
      sent: 15,
      replies: 3,
      calls: 0,
      dms: 15,
      notes: "Mostly design agencies",
    },
  ],
  activities: [
    {
      id: "a1",
      leadId: "l1",
      type: "call",
      note: "30-min discovery call, very interested",
      date: "2025-03-14",
      userId: "u2",
    },
    {
      id: "a2",
      leadId: "l1",
      type: "dm",
      note: "Sent proposal PDF",
      date: "2025-03-15",
      userId: "u2",
    },
    {
      id: "a3",
      leadId: "l2",
      type: "email",
      note: "Initial outreach email sent",
      date: "2025-03-12",
      userId: "u2",
    },
    {
      id: "a4",
      leadId: "l6",
      type: "call",
      note: "Quick 15-min intro, very receptive",
      date: "2025-03-15",
      userId: "u2",
    },
  ],
  notifications: [
    {
      id: "n1",
      type: "followup",
      message: "Follow-up overdue: Jordan Blake",
      read: false,
      date: new Date().toISOString(),
    },
    {
      id: "n2",
      type: "task",
      message: "Task due today: Content Writing (WilsonFit)",
      read: false,
      date: new Date().toISOString(),
    },
    {
      id: "n3",
      type: "lead",
      message: "New lead assigned: David Chen",
      read: true,
      date: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
};

/* ─── Helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().split("T")[0];

const STATUS_COLORS = {
  New: {
    bg: "rgba(167,139,250,.15)",
    color: "#a78bfa",
    border: "rgba(167,139,250,.3)",
  },
  Contacted: {
    bg: "rgba(255,199,64,.12)",
    color: "#ffc740",
    border: "rgba(255,199,64,.3)",
  },
  Interested: {
    bg: "rgba(0,201,255,.12)",
    color: "#00c9ff",
    border: "rgba(0,201,255,.3)",
  },
  Closed: {
    bg: "rgba(0,229,160,.12)",
    color: "#00e5a0",
    border: "rgba(0,229,160,.3)",
  },
  Lost: {
    bg: "rgba(255,77,109,.12)",
    color: "#ff4d6d",
    border: "rgba(255,77,109,.3)",
  },
};

const TAG_COLORS = {
  "Hot Lead": { bg: "rgba(255,140,66,.15)", color: "#ff8c42" },
  "High Ticket": { bg: "rgba(0,229,160,.12)", color: "#00e5a0" },
  Cold: { bg: "rgba(138,151,170,.12)", color: "#8a97aa" },
  VIP: { bg: "rgba(167,139,250,.15)", color: "#a78bfa" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d + "T00:00:00");
  return dt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);

const followUpStatus = (date) => {
  if (!date) return null;
  const t = today();
  if (date < t) return "overdue";
  if (date === t) return "today";
  return "upcoming";
};

/* ─── Icons (inline SVG) ─── */
const Icon = ({ n, s = 16, c }) => {
  const paths = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    leads:
      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    followup: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M12 6v6l4 2",
    pipeline: "M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01",
    clients:
      "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    projects:
      "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
    team: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    outreach:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z",
    analytics: "M18 20V10 M12 20V4 M6 20v-6",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    plus: "M12 5v14 M5 12h14",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash:
      "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    x: "M18 6L6 18 M6 6l12 12",
    check: "M20 6L9 17l-5-5",
    arrow: "M5 12h14 M12 5l7 7-7 7",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6",
    mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3",
    download:
      "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    dots: "M12 5h.01 M12 12h.01 M12 19h.01",
    calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    convert: "M7 16V4m0 0L3 8m4-4l4 4 M17 8v12m0 0l4-4m-4 4l-4-4",
    settings:
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  };
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke={c || "currentColor"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(paths[n] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

/* ─── Avatar ─── */
const Avatar = ({ initials, size = 32, color = "#00c9ff" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: `rgba(0,201,255,.15)`,
      border: `1.5px solid rgba(0,201,255,.3)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.36,
      fontWeight: 700,
      color: "#00c9ff",
      flexShrink: 0,
      fontFamily: "Syne,sans-serif",
    }}
  >
    {initials}
  </div>
);

/* ─── Status Badge ─── */
const StatusBadge = ({ status }) => {
  const col = STATUS_COLORS[status] || {
    bg: "rgba(100,116,139,.15)",
    color: "#64748b",
    border: "rgba(100,116,139,.3)",
  };
  return (
    <span
      className="tag"
      style={{
        background: col.bg,
        color: col.color,
        border: `1px solid ${col.border}`,
      }}
    >
      {status}
    </span>
  );
};

/* ─── Tag Badge ─── */
const TagBadge = ({ tag }) => {
  const col = TAG_COLORS[tag] || {
    bg: "rgba(138,151,170,.12)",
    color: "#8a97aa",
  };
  return (
    <span className="tag" style={{ background: col.bg, color: col.color }}>
      #{tag}
    </span>
  );
};

/* ─── Modal ─── */
const Modal = ({ title, onClose, children, wide }) => (
  <div
    className="modal-backdrop"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="modal"
      style={{ width: wide ? "min(780px,95vw)" : undefined }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <h3 style={{ fontSize: 18 }}>{title}</h3>
        <button
          className="btn"
          onClick={onClose}
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 10px",
            color: "var(--text2)",
          }}
        >
          <Icon n="x" s={15} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ─── Form Row ─── */
const FRow = ({ label, children, half }) => (
  <div style={{ gridColumn: half ? "span 1" : "span 2" }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--text2)",
        marginBottom: 6,
        letterSpacing: ".3px",
      }}
    >
      {label}
    </label>
    {children}
  </div>
);

/* ─── Login Screen ─── */
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("alex@venta.studio");
  const [pass, setPass] = useState("admin123");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const u = SEED.users.find(
        (u) => u.email === email && u.password === pass,
      );
      if (u) onLogin(u);
      else {
        setErr("Invalid credentials");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 800px 600px at 50% 0%, rgba(0,201,255,.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(0,201,255,.04) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="fade-in"
        style={{
          width: 420,
          background: "var(--bg2)",
          border: "1px solid var(--border2)",
          borderRadius: 20,
          padding: 40,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #00c9ff, #00fff0)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne,sans-serif",
                fontWeight: 800,
                fontSize: 16,
                color: "#080b0f",
              }}
            >
              V
            </div>
            <span
              style={{
                fontFamily: "Syne,sans-serif",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              VENTA Studios
            </span>
          </div>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>
            Internal Operations Dashboard
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text2)",
                marginBottom: 6,
              }}
            >
              EMAIL
            </label>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@venta.studio"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text2)",
                marginBottom: 6,
              }}
            >
              PASSWORD
            </label>
            <input
              className="input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handle()}
              placeholder="••••••••"
            />
          </div>
          {err && <p style={{ color: "var(--red)", fontSize: 13 }}>{err}</p>}
          <button
            className="btn"
            onClick={handle}
            disabled={loading}
            style={{
              background: "linear-gradient(135deg, #00c9ff, #00b8e6)",
              color: "#080b0f",
              borderRadius: 10,
              padding: "12px 20px",
              fontWeight: 700,
              fontSize: 15,
              justifyContent: "center",
              marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </div>

        <div
          style={{
            marginTop: 24,
            padding: "14px 16px",
            background: "var(--bg3)",
            borderRadius: 10,
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "var(--text3)",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            DEMO ACCOUNTS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { label: "Admin", e: "alex@venta.studio", p: "admin123" },
              { label: "Employee", e: "sarah@venta.studio", p: "emp123" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => {
                  setEmail(a.e);
                  setPass(a.p);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  fontSize: 12,
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "2px 0",
                }}
              >
                {a.label}: {a.e}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── DASHBOARD ─── */
const Dashboard = ({ data, user }) => {
  const { leads, clients, projects, outreach, activities } = data;
  const totalLeads = leads.length;
  const closedLeads = leads.filter((l) => l.status === "Closed").length;
  const convRate = totalLeads
    ? ((closedLeads / totalLeads) * 100).toFixed(0)
    : 0;
  const totalRevenue = clients.reduce((s, c) => s + c.paidAmount, 0);
  const pipeline = leads
    .filter((l) => ["Interested", "Contacted"].includes(l.status))
    .reduce((s, l) => s + (l.dealValue || 0), 0);
  const overdueFollowups = leads.filter(
    (l) => l.followUpDate && l.followUpDate < today(),
  ).length;
  const todayFollowups = leads.filter((l) => l.followUpDate === today()).length;
  const todayOutreach = outreach.filter((o) => o.date === today());
  const totalSent = todayOutreach.reduce((s, o) => s + o.sent, 0);
  const totalReplies = todayOutreach.reduce((s, o) => s + o.replies, 0);

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      sub: `+${leads.filter((l) => l.createdAt >= "2025-03-10").length} this week`,
      color: "#00c9ff",
      icon: "leads",
    },
    {
      label: "Conversion Rate",
      value: convRate + "%",
      sub: `${closedLeads} deals closed`,
      color: "#00e5a0",
      icon: "analytics",
    },
    {
      label: "Revenue Collected",
      value: fmtMoney(totalRevenue),
      sub: `${fmtMoney(pipeline)} in pipeline`,
      color: "#a78bfa",
      icon: "star",
    },
    {
      label: "Follow-ups Today",
      value: todayFollowups,
      sub:
        overdueFollowups > 0
          ? `⚠ ${overdueFollowups} overdue`
          : "All caught up!",
      color: overdueFollowups > 0 ? "#ff4d6d" : "#ffc740",
      icon: "followup",
    },
    {
      label: "Outreach Today",
      value: totalSent,
      sub: `${totalReplies} replies (${totalSent ? ((totalReplies / totalSent) * 100).toFixed(0) : 0}%)`,
      color: "#ff8c42",
      icon: "outreach",
    },
    {
      label: "Active Projects",
      value: projects.filter((p) => p.status === "In Progress").length,
      sub: `${projects.reduce((s, p) => s + p.tasks.filter((t) => t.status !== "Done").length, 0)} tasks pending`,
      color: "#ffc740",
      icon: "projects",
    },
  ];

  const recentLeads = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  const overdue = leads.filter(
    (l) => l.followUpDate && l.followUpDate < today(),
  );

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 17
                ? "afternoon"
                : "evening"}
            , {user.name.split(" ")[0]} 👋
          </h2>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {overdueFollowups > 0 && (
            <div
              style={{
                background: "rgba(255,77,109,.12)",
                border: "1px solid rgba(255,77,109,.3)",
                borderRadius: 10,
                padding: "8px 14px",
                fontSize: 13,
                color: "#ff4d6d",
                fontWeight: 600,
              }}
            >
              ⚠ {overdueFollowups} Overdue Follow-ups
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: `rgba(${s.color === "#00c9ff" ? "0,201,255" : s.color === "#00e5a0" ? "0,229,160" : s.color === "#a78bfa" ? "167,139,250" : s.color === "#ff4d6d" ? "255,77,109" : s.color === "#ffc740" ? "255,199,64" : s.color === "#ff8c42" ? "255,140,66" : "0,201,255"},.12)`,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color,
                }}
              >
                <Icon n={s.icon} s={18} c={s.color} />
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "Syne,sans-serif",
                color: "var(--text)",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 11.5,
                color: s.sub.includes("⚠") ? "#ff4d6d" : "var(--text3)",
                marginTop: 6,
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent Leads */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 15 }}>Recent Leads</h3>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              LATEST 5
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentLeads.map((l) => (
              <div
                key={l.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 10px",
                  background: "var(--bg3)",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar
                    initials={l.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                    size={30}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {l.name}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>
                      {l.company}
                    </div>
                  </div>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Overdue & Today's Follow-ups */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 15 }}>Follow-up Radar</h3>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              PRIORITY
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {leads
              .filter((l) => l.followUpDate && l.followUpDate <= today())
              .slice(0, 5)
              .map((l) => {
                const st = followUpStatus(l.followUpDate);
                return (
                  <div
                    key={l.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background:
                        st === "overdue"
                          ? "rgba(255,77,109,.06)"
                          : "rgba(255,199,64,.05)",
                      borderRadius: 9,
                      border: `1px solid ${st === "overdue" ? "rgba(255,77,109,.2)" : "rgba(255,199,64,.2)"}`,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {l.company}
                      </div>
                    </div>
                    <span
                      className="tag"
                      style={{
                        background:
                          st === "overdue"
                            ? "rgba(255,77,109,.15)"
                            : "rgba(255,199,64,.12)",
                        color: st === "overdue" ? "#ff4d6d" : "#ffc740",
                        border: `1px solid ${st === "overdue" ? "rgba(255,77,109,.3)" : "rgba(255,199,64,.3)"}`,
                      }}
                    >
                      {st === "overdue" ? "Overdue" : "Today"}
                    </span>
                  </div>
                );
              })}
            {leads.filter((l) => l.followUpDate && l.followUpDate <= today())
              .length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "30px 0",
                  color: "var(--text3)",
                  fontSize: 13,
                }}
              >
                ✓ All follow-ups on track!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 15, marginBottom: 16 }}>Pipeline Overview</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 12,
          }}
        >
          {["New", "Contacted", "Interested", "Closed"].map((s) => {
            const cnt = leads.filter((l) => l.status === s).length;
            const val = leads
              .filter((l) => l.status === s)
              .reduce((sum, l) => sum + (l.dealValue || 0), 0);
            return (
              <div
                key={s}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "14px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    fontFamily: "Syne,sans-serif",
                    color: STATUS_COLORS[s]?.color,
                  }}
                >
                  {cnt}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text2)",
                    margin: "4px 0",
                  }}
                >
                  {s}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  {fmtMoney(val)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── LEAD MANAGEMENT ─── */
const Leads = ({ data, setData, user }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSource, setFilterSource] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [viewLead, setViewLead] = useState(null);

  const blank = {
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "Cold DM",
    status: "New",
    tags: [],
    notes: "",
    followUpDate: "",
    assignedTo: user.id,
    dealValue: "",
  };
  const [form, setForm] = useState(blank);

  const sources = [
    "All",
    "Cold DM",
    "Referral",
    "Ads",
    "Instagram",
    "LinkedIn",
    "Website",
  ];
  const statuses = ["All", "New", "Contacted", "Interested", "Closed", "Lost"];
  const allTags = ["Hot Lead", "High Ticket", "Cold", "VIP"];

  const filtered = useMemo(() => {
    let l = data.leads;
    if (search)
      l = l.filter((x) =>
        [x.name, x.company, x.email]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
    if (filterStatus !== "All") l = l.filter((x) => x.status === filterStatus);
    if (filterSource !== "All") l = l.filter((x) => x.source === filterSource);
    l = [...l].sort((a, b) => {
      let va = a[sortBy] || "",
        vb = b[sortBy] || "";
      if (sortBy === "dealValue") {
        va = +va;
        vb = +vb;
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return l;
  }, [data.leads, search, filterStatus, filterSource, sortBy, sortDir]);

  const openAdd = () => {
    setForm(blank);
    setEditLead(null);
    setShowModal(true);
  };
  const openEdit = (l) => {
    setForm({ ...l, dealValue: l.dealValue || "" });
    setEditLead(l.id);
    setShowModal(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    const lead = {
      ...form,
      dealValue: parseFloat(form.dealValue) || 0,
      id: editLead || uid(),
      createdAt: editLead
        ? data.leads.find((l) => l.id === editLead)?.createdAt || today()
        : today(),
    };
    setData((d) => ({
      ...d,
      leads: editLead
        ? d.leads.map((l) => (l.id === editLead ? lead : l))
        : [...d.leads, lead],
    }));
    setShowModal(false);
  };

  const deleteLead = (id) =>
    setData((d) => ({ ...d, leads: d.leads.filter((l) => l.id !== id) }));

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));

  const convertToClient = (lead) => {
    const client = {
      id: uid(),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      projectDetails: lead.notes,
      paymentStatus: "Pending",
      totalValue: lead.dealValue || 0,
      paidAmount: 0,
      startDate: today(),
      notes: "",
      leadId: lead.id,
    };
    setData((d) => ({
      ...d,
      clients: [...d.clients, client],
      leads: d.leads.map((l) =>
        l.id === lead.id ? { ...l, status: "Closed" } : l,
      ),
    }));
  };

  const sortToggle = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "Name",
        "Company",
        "Email",
        "Phone",
        "Source",
        "Status",
        "Deal Value",
        "Tags",
        "Notes",
        "Follow Up",
      ],
    ];
    filtered.forEach((l) =>
      rows.push([
        l.name,
        l.company,
        l.email,
        l.phone,
        l.source,
        l.status,
        l.dealValue,
        l.tags.join(";"),
        l.notes,
        l.followUpDate,
      ]),
    );
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "venta_leads.csv";
    a.click();
  };

  const assignedUser = (uid) => SEED.users.find((u) => u.id === uid);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Lead Management</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            {filtered.length} leads ·{" "}
            {data.leads.filter((l) => l.status === "Interested").length}{" "}
            interested
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn"
            onClick={exportCSV}
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "8px 14px",
              color: "var(--text2)",
              fontSize: 13,
            }}
          >
            <Icon n="download" s={14} />
            CSV
          </button>
          <button
            className="btn"
            onClick={openAdd}
            style={{
              background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
              color: "#080b0f",
              borderRadius: 9,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Icon n="plus" s={14} c="#080b0f" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Icon n="search" s={14} c="var(--text3)" />
          <input
            className="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            style={{ paddingLeft: 34 }}
          />
          <div
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            <Icon n="search" s={14} c="var(--text3)" />
          </div>
        </div>
        <select
          className="select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="select"
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
        >
          {sources.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                {[
                  ["name", "Name"],
                  ["company", "Company"],
                  ["source", "Source"],
                  ["status", "Status"],
                  ["followUpDate", "Follow Up"],
                  ["dealValue", "Value"],
                  ["", "Tags"],
                  ["", ""],
                ].map(([col, label]) => (
                  <th
                    key={label}
                    onClick={() => col && sortToggle(col)}
                    style={{
                      cursor: col ? "pointer" : "default",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      {label}
                      {col && sortBy === col && (
                        <span style={{ color: "var(--accent)" }}>
                          {sortDir === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => {
                const fu = followUpStatus(l.followUpDate);
                const au = assignedUser(l.assignedTo);
                return (
                  <tr
                    key={l.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setViewLead(l)}
                  >
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 9,
                        }}
                      >
                        <Avatar
                          initials={l.name
                            .split(" ")
                            .map((x) => x[0])
                            .join("")
                            .slice(0, 2)}
                          size={28}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {l.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>
                            {l.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: "var(--text2)" }}>
                      {l.company}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "var(--text3)" }}>
                        {l.source}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <StatusBadge status={l.status} />
                    </td>
                    <td>
                      {l.followUpDate ? (
                        <span
                          className="tag"
                          style={{
                            background:
                              fu === "overdue"
                                ? "rgba(255,77,109,.12)"
                                : fu === "today"
                                  ? "rgba(255,199,64,.12)"
                                  : "rgba(0,229,160,.1)",
                            color:
                              fu === "overdue"
                                ? "#ff4d6d"
                                : fu === "today"
                                  ? "#ffc740"
                                  : "#00e5a0",
                            border: `1px solid ${fu === "overdue" ? "rgba(255,77,109,.25)" : fu === "today" ? "rgba(255,199,64,.25)" : "rgba(0,229,160,.2)"}`,
                          }}
                        >
                          {fu === "overdue" ? "⚠ " : fu === "today" ? "● " : ""}
                          {fmtDate(l.followUpDate)}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text3)", fontSize: 12 }}>
                          —
                        </span>
                      )}
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>
                      {l.dealValue ? fmtMoney(l.dealValue) : "—"}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div
                        style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                      >
                        {l.tags.map((t) => (
                          <TagBadge key={t} tag={t} />
                        ))}
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          justifyContent: "flex-end",
                        }}
                      >
                        {l.status !== "Closed" && (
                          <button
                            className="btn tooltip"
                            data-tip="Convert to Client"
                            onClick={() => convertToClient(l)}
                            style={{
                              background: "rgba(0,229,160,.1)",
                              border: "1px solid rgba(0,229,160,.2)",
                              color: "#00e5a0",
                              borderRadius: 7,
                              padding: "5px 9px",
                              fontSize: 11,
                            }}
                          >
                            <Icon n="convert" s={12} c="#00e5a0" />
                          </button>
                        )}
                        <button
                          className="btn"
                          onClick={() => openEdit(l)}
                          style={{
                            background: "var(--bg3)",
                            border: "1px solid var(--border)",
                            color: "var(--text2)",
                            borderRadius: 7,
                            padding: "5px 9px",
                          }}
                        >
                          <Icon n="edit" s={13} />
                        </button>
                        {user.role === "admin" && (
                          <button
                            className="btn"
                            onClick={() => deleteLead(l.id)}
                            style={{
                              background: "rgba(255,77,109,.08)",
                              border: "1px solid rgba(255,77,109,.15)",
                              color: "#ff4d6d",
                              borderRadius: 7,
                              padding: "5px 9px",
                            }}
                          >
                            <Icon n="trash" s={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: "var(--text3)",
                    }}
                  >
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <Modal
          title={editLead ? "Edit Lead" : "Add New Lead"}
          onClose={() => setShowModal(false)}
          wide
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <FRow label="FULL NAME" half>
              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Jordan Blake"
              />
            </FRow>
            <FRow label="COMPANY" half>
              <input
                className="input"
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="BlakeCo"
              />
            </FRow>
            <FRow label="EMAIL" half>
              <input
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="jordan@company.com"
              />
            </FRow>
            <FRow label="PHONE" half>
              <input
                className="input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+1 555-0000"
              />
            </FRow>
            <FRow label="SOURCE" half>
              <select
                className="select"
                style={{ width: "100%" }}
                value={form.source}
                onChange={(e) =>
                  setForm((f) => ({ ...f, source: e.target.value }))
                }
              >
                {[
                  "Cold DM",
                  "Referral",
                  "Ads",
                  "Instagram",
                  "LinkedIn",
                  "Website",
                  "Event",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FRow>
            <FRow label="STATUS" half>
              <select
                className="select"
                style={{ width: "100%" }}
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
              >
                {["New", "Contacted", "Interested", "Closed", "Lost"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            </FRow>
            <FRow label="DEAL VALUE ($)" half>
              <input
                className="input"
                type="number"
                value={form.dealValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dealValue: e.target.value }))
                }
                placeholder="5000"
              />
            </FRow>
            <FRow label="FOLLOW-UP DATE" half>
              <input
                className="input"
                type="date"
                value={form.followUpDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, followUpDate: e.target.value }))
                }
              />
            </FRow>
            <FRow label="ASSIGN TO" half>
              <select
                className="select"
                style={{ width: "100%" }}
                value={form.assignedTo}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignedTo: e.target.value }))
                }
              >
                {SEED.users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </FRow>
            <FRow label="TAGS">
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {allTags.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className="btn tag"
                    style={{
                      background: form.tags.includes(t)
                        ? TAG_COLORS[t]?.bg
                        : "var(--bg3)",
                      color: form.tags.includes(t)
                        ? TAG_COLORS[t]?.color
                        : "var(--text3)",
                      border: `1px solid ${form.tags.includes(t) ? "transparent" : "var(--border)"}`,
                      padding: "5px 12px",
                      borderRadius: 20,
                    }}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </FRow>
            <FRow label="NOTES">
              <textarea
                className="input"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Any notes about this lead..."
                style={{ resize: "vertical" }}
              />
            </FRow>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              className="btn"
              onClick={() => setShowModal(false)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "9px 18px",
                color: "var(--text2)",
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={save}
              style={{
                background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
                color: "#080b0f",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              <Icon n="check" s={14} c="#080b0f" />
              {editLead ? "Update" : "Add Lead"}
            </button>
          </div>
        </Modal>
      )}

      {/* View Lead Modal */}
      {viewLead && (
        <LeadDetailModal
          lead={viewLead}
          data={data}
          setData={setData}
          user={user}
          onClose={() => setViewLead(null)}
          onEdit={() => {
            openEdit(viewLead);
            setViewLead(null);
          }}
        />
      )}
    </div>
  );
};

/* ─── Lead Detail Modal ─── */
const LeadDetailModal = ({ lead, data, setData, user, onClose, onEdit }) => {
  const [note, setNote] = useState("");
  const [actType, setActType] = useState("call");
  const activities = data.activities
    .filter((a) => a.leadId === lead.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const actUser = (uid) => SEED.users.find((u) => u.id === uid);

  const addActivity = () => {
    if (!note.trim()) return;
    const act = {
      id: uid(),
      leadId: lead.id,
      type: actType,
      note,
      date: today(),
      userId: user.id,
    };
    setData((d) => ({ ...d, activities: [...d.activities, act] }));
    setNote("");
  };

  const fu = followUpStatus(lead.followUpDate);
  const actIcons = {
    call: "📞",
    dm: "💬",
    email: "📧",
    note: "📝",
    meeting: "🤝",
  };

  return (
    <Modal title={`${lead.name} — ${lead.company}`} onClose={onClose} wide>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 10,
              padding: 16,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <StatusBadge status={lead.status} />
              <div style={{ display: "flex", gap: 4 }}>
                {lead.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            </div>
            {[
              ["Email", lead.email, "mail"],
              ["Phone", lead.phone, "phone"],
              ["Source", lead.source, "link"],
              ["Deal Value", fmtMoney(lead.dealValue), "star"],
            ].map(([l, v, i]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  marginBottom: 8,
                  fontSize: 13,
                }}
              >
                <Icon n={i} s={13} c="var(--text3)" />
                <span style={{ color: "var(--text3)", minWidth: 70 }}>
                  {l}:
                </span>
                <span style={{ color: "var(--text)" }}>{v || "—"}</span>
              </div>
            ))}
            {lead.followUpDate && (
              <div
                style={{
                  marginTop: 10,
                  padding: "8px 10px",
                  background:
                    fu === "overdue"
                      ? "rgba(255,77,109,.08)"
                      : "rgba(255,199,64,.07)",
                  borderRadius: 7,
                  border: `1px solid ${fu === "overdue" ? "rgba(255,77,109,.2)" : "rgba(255,199,64,.2)"}`,
                  fontSize: 12,
                  color: fu === "overdue" ? "#ff4d6d" : "#ffc740",
                }}
              >
                📅 Follow-up: {fmtDate(lead.followUpDate)}{" "}
                {fu === "overdue"
                  ? "(OVERDUE)"
                  : fu === "today"
                    ? "(TODAY)"
                    : ""}
              </div>
            )}
          </div>
          {lead.notes && (
            <div
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: 14,
                border: "1px solid var(--border)",
                fontSize: 13,
                color: "var(--text2)",
                lineHeight: 1.6,
              }}
            >
              <strong
                style={{
                  color: "var(--text3)",
                  fontSize: 11,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                NOTES
              </strong>
              {lead.notes}
            </div>
          )}
          <button
            onClick={onEdit}
            className="btn"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "9px 0",
              justifyContent: "center",
              color: "var(--text2)",
              fontSize: 13,
            }}
          >
            <Icon n="edit" s={13} /> Edit Lead
          </button>
        </div>

        {/* Activity Timeline */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text2)",
              marginBottom: 12,
              letterSpacing: ".3px",
            }}
          >
            ACTIVITY TIMELINE
          </h4>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <select
              className="select"
              value={actType}
              onChange={(e) => setActType(e.target.value)}
              style={{ flex: "0 0 auto" }}
            >
              {["call", "dm", "email", "note", "meeting"].map((t) => (
                <option key={t} value={t}>
                  {actIcons[t]} {t}
                </option>
              ))}
            </select>
            <input
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addActivity()}
              placeholder="Log activity..."
            />
            <button
              className="btn"
              onClick={addActivity}
              style={{
                background: "var(--accent)",
                color: "#080b0f",
                borderRadius: 8,
                padding: "0 12px",
                flexShrink: 0,
                fontWeight: 700,
              }}
            >
              <Icon n="plus" s={14} c="#080b0f" />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {activities.length === 0 && (
              <div
                style={{
                  color: "var(--text3)",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No activities yet
              </div>
            )}
            {activities.map((a) => {
              const u = actUser(a.userId);
              return (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 12px",
                    background: "var(--bg3)",
                    borderRadius: 9,
                    border: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontSize: 16 }}>
                    {actIcons[a.type] || "📝"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5 }}>{a.note}</div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginTop: 4,
                      }}
                    >
                      {u?.name} · {fmtDate(a.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

/* ─── FOLLOW-UP TRACKER ─── */
const FollowUps = ({ data, setData, user }) => {
  const leads = data.leads.filter(
    (l) =>
      l.followUpDate || l.status === "Interested" || l.status === "Contacted",
  );
  const overdue = leads.filter(
    (l) => l.followUpDate && l.followUpDate < today(),
  );
  const todayLeads = leads.filter((l) => l.followUpDate === today());
  const upcoming = leads.filter((l) => l.followUpDate > today());

  const reschedule = (lead, days) => {
    const newDate = new Date(Date.now() + days * 86400000)
      .toISOString()
      .split("T")[0];
    setData((d) => ({
      ...d,
      leads: d.leads.map((l) =>
        l.id === lead.id ? { ...l, followUpDate: newDate } : l,
      ),
    }));
  };

  const markDone = (lead) => {
    setData((d) => ({
      ...d,
      leads: d.leads.map((l) =>
        l.id === lead.id ? { ...l, followUpDate: "" } : l,
      ),
    }));
  };

  const Section = ({ title, items, color, emptyMsg }) => (
    <div
      style={{
        background: "var(--bg2)",
        border: `1px solid var(--border)`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: color,
          }}
        />
        <h3 style={{ fontSize: 14, fontWeight: 700 }}>{title}</h3>
        <span
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: "1px 8px",
            fontSize: 11,
            color: "var(--text3)",
          }}
        >
          {items.length}
        </span>
      </div>
      {items.length === 0 ? (
        <div
          style={{
            padding: "24px 18px",
            color: "var(--text3)",
            fontSize: 13,
            textAlign: "center",
          }}
        >
          {emptyMsg}
        </div>
      ) : (
        items.map((l) => (
          <div
            key={l.id}
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flex: 1,
              }}
            >
              <Avatar
                initials={l.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
                size={34}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {l.company} · {fmtDate(l.followUpDate)}
                </div>
                {l.notes && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text2)",
                      marginTop: 4,
                      maxWidth: 300,
                    }}
                  >
                    {l.notes.slice(0, 80)}
                    {l.notes.length > 80 ? "..." : ""}
                  </div>
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <StatusBadge status={l.status} />
              <button
                className="btn"
                onClick={() => reschedule(l, 1)}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "5px 10px",
                  color: "var(--text2)",
                  fontSize: 11,
                }}
              >
                +1d
              </button>
              <button
                className="btn"
                onClick={() => reschedule(l, 3)}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 7,
                  padding: "5px 10px",
                  color: "var(--text2)",
                  fontSize: 11,
                }}
              >
                +3d
              </button>
              <button
                className="btn"
                onClick={() => markDone(l)}
                style={{
                  background: "rgba(0,229,160,.1)",
                  border: "1px solid rgba(0,229,160,.2)",
                  borderRadius: 7,
                  padding: "5px 10px",
                  color: "#00e5a0",
                  fontSize: 11,
                }}
              >
                ✓ Done
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Follow-Up Tracker</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
          {overdue.length} overdue · {todayLeads.length} today ·{" "}
          {upcoming.length} upcoming
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "Overdue", count: overdue.length, color: "#ff4d6d" },
          { label: "Today", count: todayLeads.length, color: "#ffc740" },
          { label: "Upcoming", count: upcoming.length, color: "#00e5a0" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "16px 20px",
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "Syne,sans-serif",
                color: s.color,
              }}
            >
              {s.count}
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Section
        title="⚠ Overdue"
        items={overdue}
        color="#ff4d6d"
        emptyMsg="🎉 No overdue follow-ups!"
      />
      <Section
        title="📅 Due Today"
        items={todayLeads}
        color="#ffc740"
        emptyMsg="Nothing due today"
      />
      <Section
        title="🔜 Upcoming"
        items={upcoming}
        color="#00e5a0"
        emptyMsg="No upcoming follow-ups scheduled"
      />
    </div>
  );
};

/* ─── KANBAN PIPELINE ─── */
const Pipeline = ({ data, setData }) => {
  const stages = ["New", "Contacted", "Qualified", "Closed", "Lost"];
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    company: "",
    dealValue: "",
    stage: "New",
  });

  const leadsByStage = (stage) =>
    data.leads.filter((l) => {
      if (stage === "Qualified") return l.status === "Interested";
      return l.status === stage;
    });

  const stageMap = {
    New: "New",
    Contacted: "Contacted",
    Qualified: "Interested",
    Closed: "Closed",
    Lost: "Lost",
  };

  const onDrop = (stage) => {
    if (dragging) {
      setData((d) => ({
        ...d,
        leads: d.leads.map((l) =>
          l.id === dragging ? { ...l, status: stageMap[stage] } : l,
        ),
      }));
      setDragging(null);
      setDragOver(null);
    }
  };

  const stageColors = {
    New: "#a78bfa",
    Contacted: "#ffc740",
    Qualified: "#00c9ff",
    Closed: "#00e5a0",
    Lost: "#ff4d6d",
  };
  const totalByStage = (stage) =>
    leadsByStage(stage).reduce((s, l) => s + (l.dealValue || 0), 0);

  const addDeal = () => {
    if (!addForm.name.trim()) return;
    const lead = {
      id: uid(),
      name: addForm.name,
      company: addForm.company,
      email: "",
      phone: "",
      source: "Pipeline",
      status: stageMap[addForm.stage] || "New",
      tags: [],
      notes: "",
      followUpDate: "",
      assignedTo: "u1",
      dealValue: parseFloat(addForm.dealValue) || 0,
      createdAt: today(),
    };
    setData((d) => ({ ...d, leads: [...d.leads, lead] }));
    setShowAdd(false);
    setAddForm({ name: "", company: "", dealValue: "", stage: "New" });
  };

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Sales Pipeline</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            Drag deals across stages
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowAdd(true)}
          style={{
            background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
            color: "#080b0f",
            borderRadius: 9,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Icon n="plus" s={14} c="#080b0f" />
          Add Deal
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 8,
        }}
      >
        {stages.map((stage) => {
          const cards = leadsByStage(stage);
          return (
            <div
              key={stage}
              className={`kanban-col${dragOver === stage ? " drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(stage);
              }}
              onDrop={() => onDrop(stage)}
              onDragLeave={() => setDragOver(null)}
              style={{
                minWidth: 230,
                flex: "1 0 230px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: stageColors[stage],
                      }}
                    />
                    <span style={{ fontWeight: 700, fontSize: 13 }}>
                      {stage}
                    </span>
                  </div>
                  <span
                    style={{
                      background: "var(--bg3)",
                      borderRadius: 20,
                      padding: "1px 8px",
                      fontSize: 11,
                      color: "var(--text3)",
                    }}
                  >
                    {cards.length}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>
                  {fmtMoney(totalByStage(stage))}
                </div>
              </div>
              <div
                style={{
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                  minHeight: 200,
                }}
              >
                {cards.map((l) => (
                  <div
                    key={l.id}
                    className={`kanban-card${dragging === l.id ? " dragging" : ""}`}
                    draggable
                    onDragStart={() => setDragging(l.id)}
                    onDragEnd={() => {
                      setDragging(null);
                      setDragOver(null);
                    }}
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border2)",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <div
                      style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}
                    >
                      {l.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginBottom: 8,
                      }}
                    >
                      {l.company}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: stageColors[stage],
                        }}
                      >
                        {l.dealValue ? fmtMoney(l.dealValue) : "—"}
                      </span>
                      <div style={{ display: "flex", gap: 4 }}>
                        {l.tags.slice(0, 2).map((t) => (
                          <TagBadge key={t} tag={t} />
                        ))}
                      </div>
                    </div>
                    {l.followUpDate && (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 11,
                          color:
                            followUpStatus(l.followUpDate) === "overdue"
                              ? "#ff4d6d"
                              : "var(--text3)",
                        }}
                      >
                        📅 {fmtDate(l.followUpDate)}
                      </div>
                    )}
                  </div>
                ))}
                {cards.length === 0 && (
                  <div
                    style={{
                      padding: "20px 0",
                      color: "var(--text3)",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline stats */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "14px 20px",
        }}
      >
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Total Pipeline:{" "}
            <strong style={{ color: "var(--accent)" }}>
              {fmtMoney(
                data.leads
                  .filter((l) =>
                    ["New", "Contacted", "Interested"].includes(l.status),
                  )
                  .reduce((s, l) => s + (l.dealValue || 0), 0),
              )}
            </strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Won:{" "}
            <strong style={{ color: "#00e5a0" }}>
              {fmtMoney(
                data.leads
                  .filter((l) => l.status === "Closed")
                  .reduce((s, l) => s + (l.dealValue || 0), 0),
              )}
            </strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Win Rate:{" "}
            <strong style={{ color: "#ffc740" }}>
              {data.leads.length
                ? (
                    (data.leads.filter((l) => l.status === "Closed").length /
                      data.leads.length) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)" }}>
            Avg Deal:{" "}
            <strong style={{ color: "var(--text)" }}>
              {fmtMoney(
                data.leads
                  .filter((l) => l.dealValue)
                  .reduce((s, l) => s + l.dealValue, 0) /
                  (data.leads.filter((l) => l.dealValue).length || 1),
              )}
            </strong>
          </div>
        </div>
      </div>

      {showAdd && (
        <Modal title="Add Deal to Pipeline" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FRow label="CONTACT NAME">
              <input
                className="input"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Jordan Blake"
              />
            </FRow>
            <FRow label="COMPANY">
              <input
                className="input"
                value={addForm.company}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="BlakeCo"
              />
            </FRow>
            <FRow label="DEAL VALUE ($)">
              <input
                className="input"
                type="number"
                value={addForm.dealValue}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, dealValue: e.target.value }))
                }
                placeholder="5000"
              />
            </FRow>
            <FRow label="PIPELINE STAGE">
              <select
                className="select"
                style={{ width: "100%" }}
                value={addForm.stage}
                onChange={(e) =>
                  setAddForm((f) => ({ ...f, stage: e.target.value }))
                }
              >
                {stages.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FRow>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              className="btn"
              onClick={() => setShowAdd(false)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "9px 18px",
                color: "var(--text2)",
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={addDeal}
              style={{
                background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
                color: "#080b0f",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Add Deal
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── CLIENTS ─── */
const Clients = ({ data, setData, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectDetails: "",
    paymentStatus: "Pending",
    totalValue: "",
    paidAmount: "",
  });

  const save = () => {
    const client = {
      ...form,
      totalValue: parseFloat(form.totalValue) || 0,
      paidAmount: parseFloat(form.paidAmount) || 0,
      id: editClient || uid(),
      startDate: editClient
        ? data.clients.find((c) => c.id === editClient)?.startDate || today()
        : today(),
    };
    setData((d) => ({
      ...d,
      clients: editClient
        ? d.clients.map((c) => (c.id === editClient ? client : c))
        : [...d.clients, client],
    }));
    setShowModal(false);
  };

  const openEdit = (c) => {
    setForm({
      ...c,
      totalValue: c.totalValue || "",
      paidAmount: c.paidAmount || "",
    });
    setEditClient(c.id);
    setShowModal(true);
  };
  const openAdd = () => {
    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      projectDetails: "",
      paymentStatus: "Pending",
      totalValue: "",
      paidAmount: "",
      notes: "",
    });
    setEditClient(null);
    setShowModal(true);
  };

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Client Management</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            {data.clients.length} active clients
          </p>
        </div>
        <button
          className="btn"
          onClick={openAdd}
          style={{
            background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
            color: "#080b0f",
            borderRadius: 9,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Icon n="plus" s={14} c="#080b0f" />
          Add Client
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
          gap: 14,
        }}
      >
        {data.clients.map((c) => {
          const pct = c.totalValue
            ? Math.round((c.paidAmount / c.totalValue) * 100)
            : 0;
          const payColor =
            c.paymentStatus === "Paid"
              ? "#00e5a0"
              : c.paymentStatus === "Partial"
                ? "#ffc740"
                : "#ff4d6d";
          const clientProjects = data.projects.filter(
            (p) => p.clientId === c.id,
          );
          return (
            <div
              key={c.id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 20,
                transition: "border .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar
                    initials={c.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                    size={38}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>
                      {c.company}
                    </div>
                  </div>
                </div>
                <span
                  className="tag"
                  style={{
                    background: `rgba(${payColor === "#00e5a0" ? "0,229,160" : payColor === "#ffc740" ? "255,199,64" : "255,77,109"},.12)`,
                    color: payColor,
                    border: `1px solid ${payColor}33`,
                  }}
                >
                  {c.paymentStatus}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text2)",
                  marginBottom: 10,
                }}
              >
                {c.projectDetails}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ color: "var(--text3)" }}>Payment</span>
                  <span style={{ fontWeight: 600 }}>
                    {fmtMoney(c.paidAmount)} / {fmtMoney(c.totalValue)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: pct + "%",
                      background: `linear-gradient(90deg, ${payColor}, ${payColor}99)`,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  📁 {clientProjects.length} project
                  {clientProjects.length !== 1 ? "s" : ""}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="btn"
                    onClick={() => openEdit(c)}
                    style={{
                      background: "var(--bg3)",
                      border: "1px solid var(--border)",
                      color: "var(--text2)",
                      borderRadius: 7,
                      padding: "5px 10px",
                      fontSize: 12,
                    }}
                  >
                    <Icon n="edit" s={12} /> Edit
                  </button>
                  {user.role === "admin" && (
                    <button
                      className="btn"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          clients: d.clients.filter((cl) => cl.id !== c.id),
                        }))
                      }
                      style={{
                        background: "rgba(255,77,109,.08)",
                        border: "1px solid rgba(255,77,109,.15)",
                        color: "#ff4d6d",
                        borderRadius: 7,
                        padding: "5px 10px",
                      }}
                    >
                      <Icon n="trash" s={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {data.clients.length === 0 && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "50px 0",
              color: "var(--text3)",
            }}
          >
            No clients yet. Convert leads or add manually.
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editClient ? "Edit Client" : "Add Client"}
          onClose={() => setShowModal(false)}
          wide
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <FRow label="FULL NAME" half>
              <input
                className="input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Emma Wilson"
              />
            </FRow>
            <FRow label="COMPANY" half>
              <input
                className="input"
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="WilsonFit"
              />
            </FRow>
            <FRow label="EMAIL" half>
              <input
                className="input"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="emma@company.com"
              />
            </FRow>
            <FRow label="PHONE" half>
              <input
                className="input"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+1 555-0000"
              />
            </FRow>
            <FRow label="TOTAL CONTRACT VALUE ($)" half>
              <input
                className="input"
                type="number"
                value={form.totalValue}
                onChange={(e) =>
                  setForm((f) => ({ ...f, totalValue: e.target.value }))
                }
                placeholder="5000"
              />
            </FRow>
            <FRow label="AMOUNT PAID ($)" half>
              <input
                className="input"
                type="number"
                value={form.paidAmount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paidAmount: e.target.value }))
                }
                placeholder="2500"
              />
            </FRow>
            <FRow label="PAYMENT STATUS" half>
              <select
                className="select"
                style={{ width: "100%" }}
                value={form.paymentStatus}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paymentStatus: e.target.value }))
                }
              >
                {["Pending", "Partial", "Paid"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </FRow>
            <FRow label="PROJECT DETAILS">
              <textarea
                className="input"
                rows={3}
                value={form.projectDetails}
                onChange={(e) =>
                  setForm((f) => ({ ...f, projectDetails: e.target.value }))
                }
                placeholder="Describe project scope..."
                style={{ resize: "vertical" }}
              />
            </FRow>
            <FRow label="NOTES">
              <textarea
                className="input"
                rows={2}
                value={form.notes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Additional notes..."
                style={{ resize: "vertical" }}
              />
            </FRow>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              className="btn"
              onClick={() => setShowModal(false)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "9px 18px",
                color: "var(--text2)",
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={save}
              style={{
                background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
                color: "#080b0f",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              {editClient ? "Update" : "Add Client"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── PROJECTS ─── */
const Projects = ({ data, setData, user }) => {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    assignedTo: "u1",
    deadline: "",
    priority: "Medium",
    status: "To Do",
  });
  const [projForm, setProjForm] = useState({
    clientId: "",
    name: "",
    deadline: "",
    status: "In Progress",
  });

  const taskStatuses = ["To Do", "In Progress", "Done"];
  const priorityColors = { High: "#ff4d6d", Medium: "#ffc740", Low: "#00e5a0" };

  const updateTaskStatus = (projectId, taskId, status) => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id !== projectId
          ? p
          : {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === taskId ? { ...t, status } : t,
              ),
              progress: Math.round(
                (p.tasks.filter((t) =>
                  t.id === taskId ? status === "Done" : t.status === "Done",
                ).length /
                  p.tasks.length) *
                  100,
              ),
            },
      ),
    }));
  };

  const addTask = (projectId) => {
    if (!taskForm.title.trim()) return;
    const task = { id: uid(), ...taskForm };
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) =>
        p.id === projectId ? { ...p, tasks: [...p.tasks, task] } : p,
      ),
    }));
    setTaskForm({
      title: "",
      assignedTo: "u1",
      deadline: "",
      priority: "Medium",
      status: "To Do",
    });
    setShowAddTask(null);
  };

  const addProject = () => {
    if (!projForm.name.trim()) return;
    const project = { id: uid(), ...projForm, tasks: [], progress: 0 };
    setData((d) => ({ ...d, projects: [...d.projects, project] }));
    setShowAddProject(false);
    setProjForm({
      clientId: "",
      name: "",
      deadline: "",
      status: "In Progress",
    });
  };

  const getUser = (uid) => SEED.users.find((u) => u.id === uid);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Project Management</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            {data.projects.length} projects ·{" "}
            {data.projects.reduce(
              (s, p) => s + p.tasks.filter((t) => t.status !== "Done").length,
              0,
            )}{" "}
            open tasks
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowAddProject(true)}
          style={{
            background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
            color: "#080b0f",
            borderRadius: 9,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Icon n="plus" s={14} c="#080b0f" />
          New Project
        </button>
      </div>

      {data.projects.map((project) => {
        const client = data.clients.find((c) => c.id === project.clientId);
        const done = project.tasks.filter((t) => t.status === "Done").length;
        const pct = project.tasks.length
          ? Math.round((done / project.tasks.length) * 100)
          : 0;
        return (
          <div
            key={project.id}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                      {project.name}
                    </h3>
                    <span
                      className="tag"
                      style={{
                        background:
                          project.status === "In Progress"
                            ? "rgba(0,201,255,.12)"
                            : "rgba(0,229,160,.12)",
                        color:
                          project.status === "In Progress"
                            ? "#00c9ff"
                            : "#00e5a0",
                        border: "none",
                        fontSize: 10,
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginTop: 2,
                    }}
                  >
                    {client
                      ? `${client.name} · ${client.company}`
                      : "No client"}{" "}
                    · Due {fmtDate(project.deadline)}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: "Syne,sans-serif",
                      color:
                        pct >= 80
                          ? "#00e5a0"
                          : pct >= 50
                            ? "#ffc740"
                            : "#00c9ff",
                    }}
                  >
                    {pct}%
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {done}/{project.tasks.length} tasks
                  </div>
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: pct + "%",
                    background: `linear-gradient(90deg, ${pct >= 80 ? "#00e5a0" : pct >= 50 ? "#ffc740" : "#00c9ff"}, ${pct >= 80 ? "#00e5a099" : pct >= 50 ? "#ffc74099" : "#00c9ff99"})`,
                  }}
                />
              </div>
            </div>
            <div style={{ padding: "0 20px" }}>
              {project.tasks.map((task) => {
                const assignee = getUser(task.assignedTo);
                return (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 6 }}>
                      {taskStatuses.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateTaskStatus(project.id, task.id, s)
                          }
                          className="btn"
                          style={{
                            padding: "3px 8px",
                            borderRadius: 6,
                            fontSize: 11,
                            background:
                              task.status === s
                                ? s === "Done"
                                  ? "rgba(0,229,160,.15)"
                                  : s === "In Progress"
                                    ? "rgba(0,201,255,.12)"
                                    : "rgba(167,139,250,.12)"
                                : "var(--bg3)",
                            color:
                              task.status === s
                                ? s === "Done"
                                  ? "#00e5a0"
                                  : s === "In Progress"
                                    ? "#00c9ff"
                                    : "#a78bfa"
                                : "var(--text3)",
                            border: `1px solid ${task.status === s ? "transparent" : "var(--border)"}`,
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        textDecoration:
                          task.status === "Done" ? "line-through" : "none",
                        color:
                          task.status === "Done"
                            ? "var(--text3)"
                            : "var(--text)",
                      }}
                    >
                      {task.title}
                    </span>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span
                        className="tag"
                        style={{
                          background: `rgba(${priorityColors[task.priority] === "#ff4d6d" ? "255,77,109" : priorityColors[task.priority] === "#ffc740" ? "255,199,64" : "0,229,160"},.1)`,
                          color: priorityColors[task.priority],
                          fontSize: 10,
                        }}
                      >
                        {task.priority}
                      </span>
                      {assignee && (
                        <Avatar initials={assignee.avatar} size={22} />
                      )}
                      {task.deadline && (
                        <span style={{ fontSize: 11, color: "var(--text3)" }}>
                          {fmtDate(task.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div style={{ padding: "10px 0" }}>
                {showAddTask === project.id ? (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input
                      className="input"
                      value={taskForm.title}
                      onChange={(e) =>
                        setTaskForm((f) => ({ ...f, title: e.target.value }))
                      }
                      placeholder="Task title..."
                      style={{ flex: 1, minWidth: 150 }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && addTask(project.id)
                      }
                    />
                    <select
                      className="select"
                      value={taskForm.assignedTo}
                      onChange={(e) =>
                        setTaskForm((f) => ({
                          ...f,
                          assignedTo: e.target.value,
                        }))
                      }
                    >
                      {SEED.users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input"
                      type="date"
                      value={taskForm.deadline}
                      onChange={(e) =>
                        setTaskForm((f) => ({ ...f, deadline: e.target.value }))
                      }
                      style={{ width: 140 }}
                    />
                    <select
                      className="select"
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm((f) => ({ ...f, priority: e.target.value }))
                      }
                    >
                      {["High", "Medium", "Low"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <button
                      className="btn"
                      onClick={() => addTask(project.id)}
                      style={{
                        background: "var(--accent)",
                        color: "#080b0f",
                        borderRadius: 8,
                        padding: "0 14px",
                        fontWeight: 700,
                      }}
                    >
                      Add
                    </button>
                    <button
                      className="btn"
                      onClick={() => setShowAddTask(null)}
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "0 10px",
                        color: "var(--text2)",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn"
                    onClick={() => setShowAddTask(project.id)}
                    style={{
                      background: "none",
                      border: "1px dashed var(--border)",
                      borderRadius: 8,
                      padding: "7px 14px",
                      color: "var(--text3)",
                      fontSize: 13,
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <Icon n="plus" s={13} c="var(--text3)" /> Add Task
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {showAddProject && (
        <Modal title="New Project" onClose={() => setShowAddProject(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FRow label="PROJECT NAME">
              <input
                className="input"
                value={projForm.name}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="WilsonFit Rebrand"
              />
            </FRow>
            <FRow label="CLIENT">
              <select
                className="select"
                style={{ width: "100%" }}
                value={projForm.clientId}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, clientId: e.target.value }))
                }
              >
                <option value="">No client</option>
                {data.clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
            </FRow>
            <FRow label="DEADLINE">
              <input
                className="input"
                type="date"
                value={projForm.deadline}
                onChange={(e) =>
                  setProjForm((f) => ({ ...f, deadline: e.target.value }))
                }
              />
            </FRow>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              className="btn"
              onClick={() => setShowAddProject(false)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "9px 18px",
                color: "var(--text2)",
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={addProject}
              style={{
                background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
                color: "#080b0f",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Create Project
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── OUTREACH TRACKER ─── */
const Outreach = ({ data, setData, user }) => {
  const [showLog, setShowLog] = useState(false);
  const [form, setForm] = useState({
    userId: user.id,
    sent: "",
    replies: "",
    calls: "",
    dms: "",
    notes: "",
  });

  const logOutreach = () => {
    const entry = {
      id: uid(),
      date: today(),
      ...form,
      sent: parseInt(form.sent) || 0,
      replies: parseInt(form.replies) || 0,
      calls: parseInt(form.calls) || 0,
      dms: parseInt(form.dms) || 0,
    };
    setData((d) => ({ ...d, outreach: [...d.outreach, entry] }));
    setShowLog(false);
    setForm({
      userId: user.id,
      sent: "",
      replies: "",
      calls: "",
      dms: "",
      notes: "",
    });
  };

  const byUser = (uid) => data.outreach.filter((o) => o.userId === uid);
  const userStats = (uid) => {
    const logs = byUser(uid);
    return {
      sent: logs.reduce((s, o) => s + o.sent, 0),
      replies: logs.reduce((s, o) => s + o.replies, 0),
      calls: logs.reduce((s, o) => s + o.calls, 0),
    };
  };

  const last7 = [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
      .toISOString()
      .split("T")[0];
    const logs = data.outreach.filter((o) => o.date === d);
    return {
      date: d,
      label: new Date(d + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "short",
      }),
      sent: logs.reduce((s, o) => s + o.sent, 0),
      replies: logs.reduce((s, o) => s + o.replies, 0),
    };
  });
  const maxSent = Math.max(...last7.map((d) => d.sent), 1);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Outreach Tracker</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            Daily outreach performance
          </p>
        </div>
        <button
          className="btn"
          onClick={() => setShowLog(true)}
          style={{
            background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
            color: "#080b0f",
            borderRadius: 9,
            padding: "9px 16px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Icon n="plus" s={14} c="#080b0f" />
          Log Outreach
        </button>
      </div>

      {/* 7-day chart */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 14, marginBottom: 20 }}>
          7-Day Outreach Volume
        </h3>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
            height: 120,
          }}
        >
          {last7.map((d) => (
            <div
              key={d.date}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: 90,
                  gap: 2,
                }}
              >
                <div
                  style={{
                    background: "rgba(0,201,255,.2)",
                    borderRadius: "3px 3px 0 0",
                    height: `${(d.replies / maxSent) * 90}px`,
                    minHeight: d.replies ? 4 : 0,
                    transition: "height .5s",
                  }}
                />
                <div
                  style={{
                    background: "#00c9ff",
                    borderRadius: "3px 3px 0 0",
                    height: `${(d.sent / maxSent) * 90}px`,
                    minHeight: d.sent ? 4 : 0,
                    transition: "height .5s",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                {d.label}
              </div>
              <div
                style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600 }}
              >
                {d.sent}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontSize: 12,
              color: "var(--text3)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "#00c9ff",
                borderRadius: 2,
              }}
            />
            Sent
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "center",
              fontSize: 12,
              color: "var(--text3)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "rgba(0,201,255,.2)",
                borderRadius: 2,
              }}
            />
            Replies
          </div>
        </div>
      </div>

      {/* Team performance */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>
          Team Performance (All Time)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SEED.users.map((u) => {
            const s = userStats(u.id);
            const rate = s.sent ? ((s.replies / s.sent) * 100).toFixed(0) : 0;
            return (
              <div
                key={u.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 14px",
                  background: "var(--bg3)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <Avatar initials={u.avatar} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {u.department}
                  </div>
                </div>
                {[
                  ["Sent", s.sent, "#00c9ff"],
                  ["Replies", s.replies, "#00e5a0"],
                  ["Calls", s.calls, "#ffc740"],
                  ["Rate", rate + "%", "#a78bfa"],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ textAlign: "center", minWidth: 55 }}>
                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: 800,
                        fontFamily: "Syne,sans-serif",
                        color: c,
                      }}
                    >
                      {v}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log history */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <h3 style={{ fontSize: 14 }}>Recent Logs</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Sent</th>
              <th>Replies</th>
              <th>Calls</th>
              <th>Reply Rate</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {[...data.outreach]
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((o) => {
                const u = SEED.users.find((u) => u.id === o.userId);
                const rate = o.sent
                  ? ((o.replies / o.sent) * 100).toFixed(0)
                  : 0;
                return (
                  <tr key={o.id}>
                    <td style={{ fontSize: 12 }}>{fmtDate(o.date)}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: 7,
                          alignItems: "center",
                        }}
                      >
                        <Avatar initials={u?.avatar || "??"} size={24} />
                        <span style={{ fontSize: 13 }}>{u?.name}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.sent}</td>
                    <td style={{ color: "#00e5a0", fontWeight: 600 }}>
                      {o.replies}
                    </td>
                    <td>{o.calls}</td>
                    <td>
                      <span
                        style={{
                          color:
                            +rate >= 20
                              ? "#00e5a0"
                              : +rate >= 10
                                ? "#ffc740"
                                : "#ff4d6d",
                          fontWeight: 700,
                        }}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--text2)" }}>
                      {o.notes || "—"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {showLog && (
        <Modal title="Log Today's Outreach" onClose={() => setShowLog(false)}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            <FRow label="TEAM MEMBER" half>
              <select
                className="select"
                style={{ width: "100%" }}
                value={form.userId}
                onChange={(e) =>
                  setForm((f) => ({ ...f, userId: e.target.value }))
                }
              >
                {SEED.users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </FRow>
            <FRow label="MESSAGES SENT" half>
              <input
                className="input"
                type="number"
                value={form.sent}
                onChange={(e) =>
                  setForm((f) => ({ ...f, sent: e.target.value }))
                }
                placeholder="20"
              />
            </FRow>
            <FRow label="REPLIES RECEIVED" half>
              <input
                className="input"
                type="number"
                value={form.replies}
                onChange={(e) =>
                  setForm((f) => ({ ...f, replies: e.target.value }))
                }
                placeholder="5"
              />
            </FRow>
            <FRow label="CALLS MADE" half>
              <input
                className="input"
                type="number"
                value={form.calls}
                onChange={(e) =>
                  setForm((f) => ({ ...f, calls: e.target.value }))
                }
                placeholder="2"
              />
            </FRow>
            <FRow label="NOTES">
              <textarea
                className="input"
                rows={2}
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Quick notes about today's outreach..."
                style={{ resize: "vertical" }}
              />
            </FRow>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 20,
            }}
          >
            <button
              className="btn"
              onClick={() => setShowLog(false)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "9px 18px",
                color: "var(--text2)",
                fontSize: 14,
              }}
            >
              Cancel
            </button>
            <button
              className="btn"
              onClick={logOutreach}
              style={{
                background: "linear-gradient(135deg,#00c9ff,#00b8e6)",
                color: "#080b0f",
                borderRadius: 9,
                padding: "9px 20px",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              Log Outreach
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ─── TEAM ─── */
const Team = ({ data }) => {
  const userLeads = (uid) => data.leads.filter((l) => l.assignedTo === uid);
  const userClosed = (uid) =>
    data.leads.filter((l) => l.assignedTo === uid && l.status === "Closed");
  const userFollowups = (uid) =>
    data.leads.filter((l) => l.assignedTo === uid && l.followUpDate);
  const userRevenue = (uid) =>
    data.leads
      .filter((l) => l.assignedTo === uid && l.status === "Closed")
      .reduce((s, l) => s + (l.dealValue || 0), 0);
  const userOutreach = (uid) =>
    data.outreach
      .filter((o) => o.userId === uid)
      .reduce((s, o) => s + o.sent, 0);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Team Dashboard</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
          {SEED.users.length} team members
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 16,
        }}
      >
        {SEED.users.map((u) => {
          const leads = userLeads(u.id).length;
          const closed = userClosed(u.id).length;
          const revenue = userRevenue(u.id);
          const outreach = userOutreach(u.id);
          const rate = leads ? ((closed / leads) * 100).toFixed(0) : 0;
          return (
            <div
              key={u.id}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 22,
                transition: "border .2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--border2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 18,
                }}
              >
                <Avatar initials={u.avatar} size={48} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{u.name}</div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text3)",
                      marginTop: 2,
                    }}
                  >
                    {u.department}
                  </div>
                  <span
                    className="tag"
                    style={{
                      marginTop: 4,
                      background:
                        u.role === "admin"
                          ? "rgba(0,201,255,.12)"
                          : "rgba(167,139,250,.12)",
                      color: u.role === "admin" ? "#00c9ff" : "#a78bfa",
                      border: "none",
                      fontSize: 10,
                    }}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                }}
              >
                {[
                  ["Leads", leads, "#00c9ff"],
                  ["Closed", closed, "#00e5a0"],
                  ["Revenue", fmtMoney(revenue), "#a78bfa"],
                  ["Conv. Rate", rate + "%", "#ffc740"],
                  ["Outreach", outreach, "#ff8c42"],
                ].map(([l, v, c]) => (
                  <div
                    key={l}
                    style={{
                      background: "var(--bg3)",
                      borderRadius: 9,
                      padding: "10px 12px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        fontFamily: "Syne,sans-serif",
                        color: c,
                      }}
                    >
                      {v}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        marginTop: 2,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 11,
                    color: "var(--text3)",
                    marginBottom: 5,
                  }}
                >
                  <span>Conversion Rate</span>
                  <span style={{ color: "var(--text2)" }}>{rate}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: rate + "%",
                      background: "linear-gradient(90deg, #00c9ff, #00e5a0)",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team tasks */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>
          Open Task Distribution
        </h3>
        {SEED.users.map((u) => {
          const tasks = data.projects
            .flatMap((p) => p.tasks)
            .filter((t) => t.assignedTo === u.id && t.status !== "Done");
          return tasks.length > 0 ? (
            <div
              key={u.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <Avatar initials={u.avatar} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                  {u.name}{" "}
                  <span
                    style={{
                      color: "var(--text3)",
                      fontWeight: 400,
                      fontSize: 12,
                    }}
                  >
                    ({tasks.length} tasks)
                  </span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {tasks.map((t) => (
                    <span
                      key={t.id}
                      className="tag"
                      style={{
                        background: "var(--bg3)",
                        color: "var(--text2)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {t.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

/* ─── ANALYTICS ─── */
const Analytics = ({ data }) => {
  const totalLeads = data.leads.length;
  const closed = data.leads.filter((l) => l.status === "Closed").length;
  const lost = data.leads.filter((l) => l.status === "Lost").length;
  const convRate = totalLeads ? ((closed / totalLeads) * 100).toFixed(1) : 0;
  const totalRevenue = data.clients.reduce((s, c) => s + c.paidAmount, 0);
  const pipeline = data.leads
    .filter((l) => ["New", "Contacted", "Interested"].includes(l.status))
    .reduce((s, l) => s + (l.dealValue || 0), 0);
  const totalOutreach = data.outreach.reduce((s, o) => s + o.sent, 0);
  const totalReplies = data.outreach.reduce((s, o) => s + o.replies, 0);
  const replyRate = totalOutreach
    ? ((totalReplies / totalOutreach) * 100).toFixed(1)
    : 0;

  const sourceBreakdown = [
    "Cold DM",
    "Referral",
    "Ads",
    "Instagram",
    "LinkedIn",
    "Website",
  ]
    .map((s) => ({
      source: s,
      count: data.leads.filter((l) => l.source === s).length,
      closed: data.leads.filter((l) => l.source === s && l.status === "Closed")
        .length,
    }))
    .filter((s) => s.count > 0);

  const maxSourceCount = Math.max(...sourceBreakdown.map((s) => s.count), 1);

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Analytics Dashboard</h2>
        <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
          Overview of all key metrics
        </p>
      </div>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: 12,
        }}
      >
        {[
          {
            label: "Total Leads",
            value: totalLeads,
            sub: "All time",
            color: "#00c9ff",
          },
          {
            label: "Conversion Rate",
            value: convRate + "%",
            sub: `${closed} closed`,
            color: "#00e5a0",
          },
          {
            label: "Revenue Collected",
            value: fmtMoney(totalRevenue),
            sub: "Paid invoices",
            color: "#a78bfa",
          },
          {
            label: "Pipeline Value",
            value: fmtMoney(pipeline),
            sub: "Active leads",
            color: "#ffc740",
          },
          {
            label: "Total Outreach",
            value: totalOutreach,
            sub: `${totalReplies} replies`,
            color: "#ff8c42",
          },
          {
            label: "Reply Rate",
            value: replyRate + "%",
            sub: "Outreach → reply",
            color: "#00c9ff",
          },
          {
            label: "Deals Lost",
            value: lost,
            sub: `${totalLeads ? ((lost / totalLeads) * 100).toFixed(0) : 0}% loss rate`,
            color: "#ff4d6d",
          },
          {
            label: "Active Clients",
            value: data.clients.length,
            sub: `${data.projects.length} projects`,
            color: "#00e5a0",
          },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: "Syne,sans-serif",
                color: s.color,
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 5 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 3 }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Lead Status Breakdown */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>
            Lead Status Breakdown
          </h3>
          {["New", "Contacted", "Interested", "Closed", "Lost"].map((s) => {
            const cnt = data.leads.filter((l) => l.status === s).length;
            const pct = totalLeads ? ((cnt / totalLeads) * 100).toFixed(0) : 0;
            return (
              <div key={s} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 5,
                  }}
                >
                  <StatusBadge status={s} />
                  <span style={{ color: "var(--text2)", fontWeight: 600 }}>
                    {cnt}{" "}
                    <span style={{ color: "var(--text3)", fontWeight: 400 }}>
                      ({pct}%)
                    </span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: pct + "%",
                      background: STATUS_COLORS[s]?.color || "#888",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Source Performance */}
        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h3 style={{ fontSize: 14, marginBottom: 16 }}>
            Lead Source Performance
          </h3>
          {sourceBreakdown
            .sort((a, b) => b.count - a.count)
            .map((s) => (
              <div key={s.source} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 5,
                  }}
                >
                  <span style={{ color: "var(--text2)" }}>{s.source}</span>
                  <span style={{ color: "var(--text2)", fontWeight: 600 }}>
                    {s.count}{" "}
                    <span style={{ color: "#00e5a0" }}>
                      ({s.closed} closed)
                    </span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(s.count / maxSourceCount) * 100}%`,
                      background: "linear-gradient(90deg, #00c9ff, #a78bfa)",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Revenue tracking */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 14, marginBottom: 16 }}>Revenue by Client</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.clients.map((c) => {
            const pct = c.totalValue ? (c.paidAmount / c.totalValue) * 100 : 0;
            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  padding: "10px 14px",
                  background: "var(--bg3)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <Avatar
                  initials={c.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                  size={30}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {c.company}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 5,
                    }}
                  >
                    <div className="progress-bar" style={{ flex: 1 }}>
                      <div
                        className="progress-fill"
                        style={{ width: pct + "%", background: "#00e5a0" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--text3)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fmtMoney(c.paidAmount)} / {fmtMoney(c.totalValue)}
                    </span>
                  </div>
                </div>
                <span
                  className="tag"
                  style={{
                    background:
                      c.paymentStatus === "Paid"
                        ? "rgba(0,229,160,.12)"
                        : "rgba(255,199,64,.12)",
                    color: c.paymentStatus === "Paid" ? "#00e5a0" : "#ffc740",
                  }}
                >
                  {c.paymentStatus}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ─── NOTIFICATIONS PANEL ─── */
const NotificationsPanel = ({ data, setData }) => {
  const unread = data.notifications.filter((n) => !n.read).length;
  const markRead = (id) =>
    setData((d) => ({
      ...d,
      notifications: d.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  const markAll = () =>
    setData((d) => ({
      ...d,
      notifications: d.notifications.map((n) => ({ ...n, read: true })),
    }));
  const clear = (id) =>
    setData((d) => ({
      ...d,
      notifications: d.notifications.filter((n) => n.id !== id),
    }));

  const typeIcon = { followup: "📅", task: "✅", lead: "👤", deal: "💰" };
  const typeColor = {
    followup: "#ffc740",
    task: "#00c9ff",
    lead: "#a78bfa",
    deal: "#00e5a0",
  };

  return (
    <div
      className="fade-in"
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Notifications</h2>
          <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 3 }}>
            {unread} unread
          </p>
        </div>
        {unread > 0 && (
          <button
            className="btn"
            onClick={markAll}
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "8px 14px",
              color: "var(--text2)",
              fontSize: 13,
            }}
          >
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.notifications.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "50px 0",
              color: "var(--text3)",
            }}
          >
            No notifications
          </div>
        )}
        {[...data.notifications]
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((n) => (
            <div
              key={n.id}
              style={{
                background: n.read ? "var(--bg2)" : "rgba(0,201,255,.04)",
                border: `1px solid ${n.read ? "var(--border)" : "rgba(0,201,255,.15)"}`,
                borderRadius: 12,
                padding: "14px 16px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => markRead(n.id)}
            >
              <span style={{ fontSize: 20 }}>{typeIcon[n.type] || "🔔"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: n.read ? 400 : 600 }}>
                  {n.message}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}
                >
                  {new Date(n.date).toLocaleString()}
                </div>
              </div>
              {!n.read && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                  }}
                />
              )}
              <button
                className="btn"
                onClick={(e) => {
                  e.stopPropagation();
                  clear(n.id);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text3)",
                  padding: 4,
                }}
              >
                <Icon n="x" s={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

/* ─── MAIN APP ─── */
export default function VentaStudios() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState({
    leads: SEED.leads,
    clients: SEED.clients,
    projects: SEED.projects,
    outreach: SEED.outreach,
    activities: SEED.activities,
    notifications: SEED.notifications,
  });

  // Persist data
  useEffect(() => {
    (async () => {
      try {
        const saved = await window.storage.get("venta_data");
        if (saved) setData(JSON.parse(saved.value));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!data) return;
    (async () => {
      try {
        await window.storage.set("venta_data", JSON.stringify(data));
      } catch {}
    })();
  }, [data]);

  const unreadNotifs = data.notifications.filter((n) => !n.read).length;

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "leads", label: "Leads", icon: "leads" },
    { id: "followups", label: "Follow-Ups", icon: "followup" },
    { id: "pipeline", label: "Pipeline", icon: "pipeline" },
    { id: "clients", label: "Clients", icon: "clients" },
    { id: "projects", label: "Projects", icon: "projects" },
    { id: "outreach", label: "Outreach", icon: "outreach" },
    { id: "team", label: "Team", icon: "team" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    {
      id: "notifications",
      label: "Notifications",
      icon: "bell",
      badge: unreadNotifs,
    },
  ];

  if (!user)
    return (
      <>
        <FontLink />
        <LoginScreen
          onLogin={(u) => {
            setUser(u);
          }}
        />
      </>
    );

  const renderPage = () => {
    const props = { data, setData, user };
    switch (page) {
      case "dashboard":
        return <Dashboard {...props} />;
      case "leads":
        return <Leads {...props} />;
      case "followups":
        return <FollowUps {...props} />;
      case "pipeline":
        return <Pipeline {...props} />;
      case "clients":
        return <Clients {...props} />;
      case "projects":
        return <Projects {...props} />;
      case "outreach":
        return <Outreach {...props} />;
      case "team":
        return <Team {...props} />;
      case "analytics":
        return <Analytics {...props} />;
      case "notifications":
        return <NotificationsPanel {...props} />;
      default:
        return <Dashboard {...props} />;
    }
  };

  const overdue = data.leads.filter(
    (l) => l.followUpDate && l.followUpDate < today(),
  ).length;

  return (
    <>
      <FontLink />
      <div
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: sidebarOpen ? 220 : 60,
            flexShrink: 0,
            background: "var(--bg2)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            transition: "width .25s ease",
            overflow: "hidden",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: "18px 14px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg,#00c9ff,#00fff0)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Syne,sans-serif",
                fontWeight: 800,
                fontSize: 14,
                color: "#080b0f",
                flexShrink: 0,
              }}
            >
              V
            </div>
            {sidebarOpen && (
              <div>
                <div
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 800,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  VENTA
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--text3)",
                    letterSpacing: ".5px",
                  }}
                >
                  STUDIOS
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <div
            style={{
              flex: 1,
              padding: "12px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 3,
              overflowY: "auto",
            }}
          >
            {nav.map((item) => (
              <div
                key={item.id}
                className={`sidebar-item${page === item.id ? " active" : ""}`}
                onClick={() => setPage(item.id)}
                style={{
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  position: "relative",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <Icon
                    n={item.icon}
                    s={17}
                    c={page === item.id ? "var(--accent)" : "var(--text3)"}
                  />
                  {item.badge > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: -4,
                        right: -5,
                        width: 14,
                        height: 14,
                        background: "var(--red)",
                        borderRadius: "50%",
                        fontSize: 9,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                      }}
                    >
                      {item.badge}
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                )}
              </div>
            ))}
          </div>

          {/* User */}
          <div
            style={{
              padding: "12px 8px",
              borderTop: "1px solid var(--border)",
            }}
          >
            {sidebarOpen ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                }}
              >
                <Avatar initials={user.avatar} size={28} />
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text3)",
                      textTransform: "capitalize",
                    }}
                  >
                    {user.role}
                  </div>
                </div>
                <button
                  className="btn tooltip"
                  data-tip="Logout"
                  onClick={() => setUser(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text3)",
                    padding: 4,
                    flexShrink: 0,
                  }}
                >
                  <Icon n="logout" s={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Avatar initials={user.avatar} size={32} />
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* Top bar */}
          <div
            style={{
              background: "var(--bg2)",
              borderBottom: "1px solid var(--border)",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <button
              className="btn"
              onClick={() => setSidebarOpen((o) => !o)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "7px 10px",
                color: "var(--text2)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, color: "var(--text3)" }}>
                VENTA Studios /{" "}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {nav.find((n) => n.id === page)?.label}
              </span>
            </div>
            {overdue > 0 && (
              <button
                className="btn"
                onClick={() => setPage("followups")}
                style={{
                  background: "rgba(255,77,109,.1)",
                  border: "1px solid rgba(255,77,109,.25)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  color: "#ff4d6d",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                ⚠ {overdue} Overdue
              </button>
            )}
            <button
              className="btn"
              onClick={() => setPage("notifications")}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "7px 10px",
                color: unreadNotifs ? "var(--accent)" : "var(--text2)",
                position: "relative",
              }}
            >
              <Icon
                n="bell"
                s={16}
                c={unreadNotifs ? "var(--accent)" : "var(--text2)"}
              />
              {unreadNotifs > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 8,
                    height: 8,
                    background: "var(--red)",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite",
                  }}
                />
              )}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar initials={user.avatar} size={28} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {user.name.split(" ")[0]}
              </span>
            </div>
          </div>

          {/* Page content */}
          <div
            style={{ flex: 1, padding: "24px", maxWidth: 1400, width: "100%" }}
          >
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
