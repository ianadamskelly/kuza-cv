import { renderToBuffer } from "@react-pdf/renderer";
import type { ResumeData, TemplateId } from "@/types/resume";
import { ClassicTemplate } from "./templates/classic";
import { ModernTemplate } from "./templates/modern";
import { MinimalTemplate } from "./templates/minimal";

export async function renderResumePdf(
  templateId: TemplateId,
  data: ResumeData,
  preview: boolean,
): Promise<Buffer> {
  const element = (() => {
    switch (templateId) {
      case "modern":
        return <ModernTemplate data={data} preview={preview} />;
      case "minimal":
        return <MinimalTemplate data={data} preview={preview} />;
      case "classic":
      default:
        return <ClassicTemplate data={data} preview={preview} />;
    }
  })();
  return renderToBuffer(element);
}
