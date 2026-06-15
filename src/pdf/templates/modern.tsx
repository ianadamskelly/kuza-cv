import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { formatDateRange, hasContent } from "../shared";
import { Watermark } from "../watermark";

const INK = "#0f172a";
const SIDEBAR_BG = "#0f172a";
const SIDEBAR_INK = "#e2e8f0";
const SIDEBAR_MUTED = "#94a3b8";
const SIDEBAR_TITLE = "#7dd3fc";
const ACCENT = "#0284c7";
const MUTED = "#475569";
const FAINT = "#94a3b8";

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.5,
    flexDirection: "row",
  },
  sidebar: {
    width: "34%",
    backgroundColor: SIDEBAR_BG,
    color: SIDEBAR_INK,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  main: {
    width: "66%",
    paddingHorizontal: 28,
    paddingVertical: 36,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    objectFit: "cover",
    marginBottom: 18,
  },
  name: {
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 4,
    lineHeight: 1.2,
  },
  title: {
    fontSize: 10.5,
    color: SIDEBAR_TITLE,
    marginBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    color: SIDEBAR_TITLE,
    marginTop: 18,
    marginBottom: 8,
  },
  sidebarText: {
    fontSize: 9.5,
    color: SIDEBAR_INK,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  sidebarMuted: {
    fontSize: 9,
    color: SIDEBAR_MUTED,
    marginTop: 1,
  },

  sectionTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    color: ACCENT,
    marginBottom: 8,
  },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  itemTitle: { fontSize: 10.5, fontWeight: 700 },
  itemSub: { fontSize: 10, color: MUTED, marginTop: 1 },
  date: { fontSize: 9.5, color: FAINT },
  bullet: { flexDirection: "row", marginTop: 3, paddingLeft: 2 },
  bulletDot: { width: 9, color: ACCENT, fontSize: 10 },
  bulletText: { flex: 1 },
  block: { marginBottom: 8 },
});

export function ModernTemplate({
  data,
  preview,
}: {
  data: ResumeData;
  preview?: boolean;
}) {
  const has = hasContent(data);
  const avatar = data.personal.avatarUrl;

  return (
    <Document
      title={`${data.personal.fullName || "Resume"} — CV`}
      author={data.personal.fullName}
    >
      <Page size="A4" style={s.page}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          {avatar ? <Image src={avatar} style={s.avatar} /> : null}
          <Text style={s.name}>{data.personal.fullName || "Your Name"}</Text>
          {data.personal.title ? (
            <Text style={s.title}>{data.personal.title}</Text>
          ) : null}

          <Text style={s.sidebarSectionTitle}>Contact</Text>
          {data.personal.email ? (
            <Text style={s.sidebarText}>{data.personal.email}</Text>
          ) : null}
          {data.personal.phone ? (
            <Text style={s.sidebarText}>{data.personal.phone}</Text>
          ) : null}
          {data.personal.location ? (
            <Text style={s.sidebarText}>{data.personal.location}</Text>
          ) : null}
          {data.personal.linkedin ? (
            <Text style={s.sidebarText}>{data.personal.linkedin}</Text>
          ) : null}
          {data.personal.website ? (
            <Text style={s.sidebarText}>{data.personal.website}</Text>
          ) : null}

          {has.skills ? (
            <>
              <Text style={s.sidebarSectionTitle}>Skills</Text>
              {data.skills.map((sk) => (
                <Text key={sk} style={s.sidebarText}>
                  {sk}
                </Text>
              ))}
            </>
          ) : null}

          {has.languages ? (
            <>
              <Text style={s.sidebarSectionTitle}>Languages</Text>
              {(data.extras.languages ?? []).map((l) => (
                <Text key={l} style={s.sidebarText}>
                  {l}
                </Text>
              ))}
            </>
          ) : null}

          {has.certifications ? (
            <>
              <Text style={s.sidebarSectionTitle}>Certifications</Text>
              {(data.extras.certifications ?? []).map((c) => (
                <View key={c.id} style={{ marginBottom: 4 }}>
                  <Text style={s.sidebarText}>{c.name}</Text>
                  {c.issuer || c.year ? (
                    <Text style={s.sidebarMuted}>
                      {[c.issuer, c.year].filter(Boolean).join(" · ")}
                    </Text>
                  ) : null}
                </View>
              ))}
            </>
          ) : null}
        </View>

        {/* Main */}
        <View style={s.main}>
          {has.summary ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Profile</Text>
              <Text>{data.summary}</Text>
            </View>
          ) : null}

          {has.experience ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Experience</Text>
              {data.experience.map((e) => (
                <View key={e.id} style={s.block}>
                  <View style={s.row}>
                    <Text style={s.itemTitle}>{e.role}</Text>
                    <Text style={s.date}>
                      {formatDateRange(e.startDate, e.endDate, e.current)}
                    </Text>
                  </View>
                  {e.company ? <Text style={s.itemSub}>{e.company}</Text> : null}
                  {e.bullets
                    .filter((b) => b.trim())
                    .map((b, i) => (
                      <View key={i} style={s.bullet}>
                        <Text style={s.bulletDot}>›</Text>
                        <Text style={s.bulletText}>{b}</Text>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          ) : null}

          {has.education ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Education</Text>
              {data.education.map((e) => (
                <View key={e.id} style={s.block}>
                  <View style={s.row}>
                    <Text style={s.itemTitle}>{e.qualification}</Text>
                    <Text style={s.date}>
                      {formatDateRange(e.startDate, e.endDate)}
                    </Text>
                  </View>
                  <Text style={s.itemSub}>{e.institution}</Text>
                  {e.details ? <Text style={{ marginTop: 2 }}>{e.details}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {has.projects ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>Projects</Text>
              {(data.extras.projects ?? []).map((p) => (
                <View key={p.id} style={s.block}>
                  <Text style={s.itemTitle}>{p.name}</Text>
                  <Text style={{ marginTop: 2 }}>{p.description}</Text>
                  {p.link ? <Text style={s.date}>{p.link}</Text> : null}
                </View>
              ))}
            </View>
          ) : null}

          {has.references ? (
            <View style={s.section}>
              <Text style={s.sectionTitle}>References</Text>
              {(data.extras.references ?? []).map((r) => (
                <Text key={r.id} style={s.itemSub}>
                  {r.name}
                  {r.role ? `, ${r.role}` : ""}
                  {r.contact ? ` — ${r.contact}` : ""}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {preview ? <Watermark /> : null}
      </Page>
    </Document>
  );
}
