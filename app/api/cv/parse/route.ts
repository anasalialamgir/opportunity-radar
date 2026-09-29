import { NextResponse } from "next/server";
import { parseCVContent } from "@/lib/ai/cv-parser";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/current-user";
import type { StructuredCV } from "@/lib/ai/types";

export const runtime = "nodejs";
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((s): s is string => typeof s === "string" && !!s.trim()).map(s => s.trim().slice(0, 150)).slice(0, 80) : [];
function valid(cv: StructuredCV): boolean {
  return !!cv && !!cv.skills && Array.isArray(cv.experience) && Array.isArray(cv.education) && Array.isArray(cv.certifications) && Array.isArray(cv.languages) &&
    [cv.skills.technical, cv.skills.soft, cv.skills.domain].every(Array.isArray);
}

export async function POST(req: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ error: "Sign in to save your CV." }, { status: 401 });
  try {
    let rawText = "";
    const type = req.headers.get("content-type") || "";
    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File) || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Choose a CV file under 5 MB." }, { status: 400 });
      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext === "pdf") {
        if (!bytes.subarray(0, 5).equals(Buffer.from("%PDF-"))) return NextResponse.json({ error: "Invalid PDF." }, { status: 400 });
        const parse = require("pdf-parse"); rawText = (await parse(bytes)).text;
      } else if (ext === "docx") {
        if (!bytes.subarray(0, 2).equals(Buffer.from("PK"))) return NextResponse.json({ error: "Invalid DOCX." }, { status: 400 });
        const mammoth = require("mammoth"); rawText = (await mammoth.extractRawText({ buffer: bytes })).value;
      } else if (ext === "txt" || ext === "md") rawText = bytes.toString("utf8");
      else return NextResponse.json({ error: "Supported files: PDF, DOCX, TXT, MD." }, { status: 400 });
    } else {
      const body = await req.json(); rawText = typeof body.rawText === "string" ? body.rawText : "";
    }
    rawText = rawText.trim();
    if (rawText.length < 40 || rawText.length > 50000) return NextResponse.json({ error: "CV text must contain 40 to 50,000 characters." }, { status: 400 });
    const parsed = await parseCVContent(rawText);
    if (!valid(parsed)) throw new Error("AI returned incomplete CV data. Please retry or edit your profile manually.");
    const profile = await prisma.profile.upsert({ where: { userId }, create: { userId }, update: {} });
    await prisma.$transaction(async tx => {
      await tx.skill.deleteMany({ where: { profileId: profile.id } });
      await tx.experience.deleteMany({ where: { profileId: profile.id } });
      await tx.education.deleteMany({ where: { profileId: profile.id } });
      await tx.certification.deleteMany({ where: { profileId: profile.id } });
      await tx.profile.update({ where: { id: profile.id }, data: { rawCvText: rawText, languages: strings(parsed.languages), country: profile.country || parsed.location || undefined } });
      const skillRows = (Object.entries(parsed.skills) as [string, unknown][]).flatMap(([category, values]) => strings(values).map(name => ({ profileId: profile.id, name, category })));
      if (skillRows.length) await tx.skill.createMany({ data: skillRows });
      if (parsed.experience.length) await tx.experience.createMany({ data: parsed.experience.filter(e => typeof e.title === "string" && e.title.trim()).slice(0, 40).map(e => ({ profileId: profile.id, title: e.title.slice(0, 200), company: e.company?.slice(0, 200), years: Number.isFinite(e.years) ? e.years : null, summary: e.summary?.slice(0, 4000) })) });
      if (parsed.education.length) await tx.education.createMany({ data: parsed.education.filter(e => e.degree).slice(0, 30).map(e => ({ profileId: profile.id, degree: e.degree, institution: e.institution || "", year: Number.isInteger(e.year) ? e.year : null })) });
      if (parsed.certifications.length) await tx.certification.createMany({ data: parsed.certifications.filter(e => e.name).slice(0, 30).map(e => ({ profileId: profile.id, name: e.name, issuer: e.issuer, year: Number.isInteger(e.year) ? e.year : null })) });
      await tx.opportunityMatch.deleteMany({ where: { userId } });
    });
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Could not process CV." }, { status: 503 });
  }
}
