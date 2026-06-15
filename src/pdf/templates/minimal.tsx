import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { contactLine, formatDateRange, hasContent } from "../shared";
import { Watermark } from "../watermark";

// Quiet, sophisticated slate — no shout.
const ACCENT = "#1e293b";
const INK = "#0f172a";
const MUTED = "#475569";
const FAINT = "#94a3b8";

const s = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.45,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    marginBottom: 18,
  },
  headerText: { flex: 1 },
  avatar: { width: 60, height: 60, borderRadius: 30, objectFit: "cover" },
  name: {
    fontSize: 24,
    fontWeight: 400,
    color: ACCENT,
    letterSpacing: 0.3,
    lineHeight: 1.15,
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    color: MUTED,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  contact: { fontSize: 9.5, color: FAINT },

  sectionTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 2.4,
    color: ACCENT,
    marginBottom: 6,
  },
  section: { marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  itemTitle: { fontSize: 10.5, fontWeight: 700 },
  itemSub: { fontSize: 10, color: MUTED, marginTop: 1 },
  date: { fontSize: 9.5, color: FAINT },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletDot: { width: 14, color: FAINT },
  bulletText: { flex: 1 },
  block: { marginBottom: 7 },
});

export function MinimalTemplate({
  data,
  preview,
}: {
  data: ResumeData;
  preview?: boolean;
}) {
  const has = hasContent(data);
  const contact = contactLine(data.personal);
  const avatar = data.personal.avatarUrl;

  return (
    <Document
      title={`${data.personal.fullName || "Resume"} — CV`}
      author={data.personal.fullName}
    >
      <Page size="A4" style={s.page}>
        <View style={s.headerRow}>
          {avatar ? <Image src={avatar} style={s.avatar} /> : null}
          <View style={s.headerText}>
            <Text style={s.name}>{data.personal.fullName || "Your Name"}</Text>
            {data.personal.title ? (
              <Text style={s.title}>{data.personal.title}</Text>
            ) : null}
            {contact.length > 0 ? (
              <Text style={s.contact}>{contact.join("   ·   ")}</Text>
            ) : null}
          </View>
        </View>

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

        {has.skills ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <Text>{data.skills.join("   ·   ")}</Text>
          </View>
        ) : null}

        {has.summary ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>About</Text>
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
                      <Text style={s.bulletDot}>–</Text>
                      <Text style={s.bulletText}>{b}</Text>
                    </View>
                  ))}
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

        {has.certifications ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Certifications</Text>
            {(data.extras.certifications ?? []).map((c) => (
              <View key={c.id} style={s.row}>
                <Text style={s.itemSub}>
                  {c.name}
                  {c.issuer ? ` — ${c.issuer}` : ""}
                </Text>
                <Text style={s.date}>{c.year}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {has.languages ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Languages</Text>
            <Text>{(data.extras.languages ?? []).join("   ·   ")}</Text>
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

        {preview ? <Watermark /> : null}
      </Page>
    </Document>
  );
}
