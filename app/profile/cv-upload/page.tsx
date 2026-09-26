"use client";

import { useState } from "react";
import Link from "next/link";
import { StructuredCV } from "@/lib/ai/types";

export default function CVUploadPage() {
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<StructuredCV | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCvText(content || "");
    };
    reader.readAsText(file);
  };

  const handleParse = async () => {
    if (!cvText.trim()) {
      setMessage("Please upload or paste your CV text first.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/cv/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: cvText }),
      });

      const json = await res.json();
      if (res.ok) {
        setParsed(json.data);
        setMessage("CV parsed successfully! Review the extracted data below.");
      } else {
        setMessage(`Error: ${json.error}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Upload or Paste Your CV</h2>
        <p className="text-sm text-slate-600 mt-1 mb-6">
          The radar parses your experience and skills into structured data. Your original document is kept private.
        </p>

        {message && (
          <div className="p-4 mb-6 text-sm rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Upload CV File (.txt, .md)
            </label>
            <input
              type="file"
              accept=".txt,.md"
              onChange={handleFileUpload}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Or Paste CV Text Directly
            </label>
            <textarea
              rows={8}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste the contents of your CV / resume here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm font-mono focus:outline-indigo-500"
            />
          </div>

          <button
            onClick={handleParse}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow transition disabled:opacity-50"
          >
            {loading ? "Extracting with AI..." : "Parse CV"}
          </button>
        </div>
      </div>

      {parsed && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Extracted Structured Profile</h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-1 rounded">
              Ready to Review
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Extracted Skills</h4>
            <div className="flex flex-wrap gap-2">
              {[
                ...parsed.skills.technical,
                ...parsed.skills.soft,
                ...parsed.skills.domain,
              ].map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Work Experience</h4>
            <div className="space-y-3">
              {parsed.experience.map((exp, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                  <div className="font-semibold text-slate-800">{exp.title}</div>
                  <div className="text-slate-500 text-xs">{exp.company} • {exp.years ? `${exp.years} years` : "Duration unstated"}</div>
                  {exp.summary && <p className="text-xs text-slate-600 mt-1">{exp.summary}</p>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Education & Languages</h4>
            <p className="text-xs text-slate-600">
              <strong>Languages:</strong> {parsed.languages.join(", ") || "None specified"}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Link
              href="/profile"
              className="inline-block w-full text-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition"
            >
              Confirm & Return to Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
