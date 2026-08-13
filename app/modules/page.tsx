import Link from "next/link";

const modules = [
  { group: "Core", items: [["Dashboard", "/dashboard"], ["Students", "/students"], ["Academics", "/academics"], ["Timetable", "/timetable"]] },
  { group: "Student Life", items: [["Attendance", "/attendance"], ["Library", "/library"], ["Transport", "/transport"], ["Hostel", "/hostel"], ["Medical Center", "/medical"], ["Counseling", "/counseling"], ["College & Career", "/college-career"], ["Special Education", "/special-ed"]] },
  { group: "Admissions & Growth", items: [["Admissions", "/admissions"], ["Fundraising", "/fundraising"]] },
  { group: "Finance & Operations", items: [["Fees", "/fees"], ["Finance & Accounting", "/finance"], ["Inventory", "/inventory"], ["Procurement", "/procurement"]] },
  { group: "People", items: [["HR & Payroll", "/hr"]] },
  { group: "Engagement", items: [["Communication", "/communication"], ["Portals", "/portals"], ["Events", "/events"], ["Visitors", "/visitors"]] },
  { group: "Learning", items: [["LMS", "/lms"]] },
  { group: "Platform", items: [["Campuses", "/campuses"], ["Analytics", "/analytics"], ["Settings", "/settings"], ["API Management", "/api-management"]] },
];

export default function ModulesIndex() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", padding: "40px 32px", maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, marginBottom: 6 }}>MonaLearn</h1>
      <p style={{ color: "#4B5568", marginBottom: 32 }}>All 28 modules — every route below is live in this deployment.</p>
      {modules.map((g) => (
        <div key={g.group} style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0E7C5A", marginBottom: 10 }}>
            {g.group}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {g.items.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                style={{
                  textDecoration: "none",
                  color: "#12294B",
                  border: "1px solid #DDE3EC",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13.5,
                  fontWeight: 600,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
