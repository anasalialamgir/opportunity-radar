import Link from "next/link";
export default function HomePage() {
  return <div className="max-w-5xl mx-auto py-12 sm:py-20 space-y-16">
    <section className="text-center max-w-3xl mx-auto space-y-6"><span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">A clearer path from CV to opportunity</span>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight">Find jobs that fit <span className="text-indigo-600">your actual experience.</span></h1>
      <p className="text-lg text-slate-600">Upload your CV, add the strengths it misses, and review published listings ranked against your skills and preferences.</p>
      <div className="flex flex-wrap justify-center gap-3"><Link href="/signup" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700">Build my profile →</Link><Link href="/login" className="px-6 py-3 bg-white border rounded-xl font-semibold">Log in</Link></div>
    </section>
    <section className="grid sm:grid-cols-3 gap-5">{[
      ["01", "Tell us about you", "Upload a PDF, DOCX, or text CV. Review the extracted skills and add practical strengths."],
      ["02", "Scan published jobs", "Fetch linked opportunities from Remotive and GitHub. We never invent listings."],
      ["03", "Decide with context", "Compare skill overlap, location concerns, and the original listing before you apply."],
    ].map(([number, title, body]) => <div key={number} className="bg-white border rounded-2xl p-6 shadow-sm"><span className="text-indigo-600 font-bold">{number}</span><h2 className="font-semibold text-xl mt-4">{title}</h2><p className="text-slate-600 text-sm mt-2 leading-relaxed">{body}</p></div>)}</section>
    <p className="text-center text-sm text-slate-500">Matching is a guide. Job availability, pay, and country eligibility must be checked at the source.</p>
  </div>;
}
