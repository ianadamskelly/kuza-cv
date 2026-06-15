import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { contactLine, formatDateRange, hasContent } from "../shared";
import { Watermark } from "../watermark";

const INK = "#111827";
const MUTED = "#4b5563";
const FAINT = "#9ca3af";
const RULE = "#d1d5db";

const s = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: INK,
    lineHeight: 1.4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  headerText: { flex: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, objectFit: "cover" },
  name: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 0.5,
    lineHeight: 1.15,
    marginBottom: 8,
  },
  title: { fontSize: 11.5, color: MUTED, lineHeight: 1.2, marginBottom: 8 },
  contact: { fontSize: 9.5, color: MUTED },
  rule: { borderBottomWidth: 0.5, borderBottomColor: RULE, marginBottom: 10 },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    marginBottom: 5,
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  itemTitle: { fontSize: 10.5, fontWeight: 700 },
  itemSub: { fontSize: 10, color: MUTED, marginTop: 1 },
  date: { fontSize: 9.5, color: FAINT },
  bullet: { flexDirection: "row", marginTop: 2, paddingLeft: 2 },
  bulletDot: { width: 9, fontSize: 10 },
  bulletText: { flex: 1 },
  block: { marginBottom: 6 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap" },
  skill: { fontSize: 10, marginRight: 4 },
  skillSep: { fontSize: 10, color: FAINT, marginRight: 4 },
});

export function ClassicTemplate({
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
            <Text style={s.name}>
              {data.personal.fullName || "Your Name"}
            </Text>
            {data.personal.title ? (
              <Text style={s.title}>{data.personal.title}</Text>
            ) : null}
            {contact.length > 0 ? (
              <Text style={s.contact}>{contact.join("  ·  ")}</Text>
            ) : null}
          </View>
        </View>
        <View style={s.rule} />

        {has.summary ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Summary</Text>
            <Text>{data.summary}</Text>
          </View>
        ) : null}

        {has.experience ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Experience</Text>
            {data.experience.map((e) => (
              <View key={e.id} style={s.block}>
                <View style={s.row}>
                  <Text style={s.itemTitle}>{e.role || ""}</Text>
                  <Text style={s.date}>
                    {formatDateRange(e.startDate, e.endDate, e.current)}
                  </Text>
                </View>
                {e.company ? <Text style={s.itemSub}>{e.company}</Text> : null}
                {e.bullets
                  .filter((b) => b.trim())
                  .map((b, i) => (
                    <View key={i} style={s.bullet}>
                      <Text style={s.bulletDot}>•</Text>
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

        {has.skills ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Skills</Text>
            <View style={s.skillsRow}>
              {data.skills.map((sk, i) => (
                <View key={sk} style={{ flexDirection: "row" }}>
                  <Text style={s.skill}>{sk}</Text>
                  {i < data.skills.length - 1 ? (
                    <Text style={s.skillSep}>·</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {has.languages ? (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Languages</Text>
            <Text>{(data.extras.languages ?? []).join("   ·   ")}</Text>
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

        {preview ? <Watermark /> : null}
      </Page>
    </Document>
  );
}
