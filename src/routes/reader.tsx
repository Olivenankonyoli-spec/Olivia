import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Search, ZoomIn, ZoomOut, Download, Maximize2, ChevronUp, ChevronDown, Info, List, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reader")({
  head: () => ({ meta: [{ title: "PDF Reader — Apex Tutors" }] }),
  component: ReaderPage,
});

const outline = [
  "1. Introduction",
  "2. Limits and Continuity",
  "3. The Derivative",
  "3.1 Geometric Meaning",
  "3.2 Rules of Differentiation",
  "4. Applications",
  "5. Summary",
];

function ReaderPage() {
  const [zoom, setZoom] = useState(100);
  const [page, setPage] = useState(3);
  const [tab, setTab] = useState<"outline" | "thumbs">("outline");
  const total = 24;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      {/* Toolbar */}
      <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 lg:px-5 h-14">
          <Link to="/materials" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition">
            <ChevronLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
          </Link>
          <div className="min-w-0 text-center">
            <div className="truncate text-sm font-semibold">Lecture 3 — Applications of Differentiation.pdf</div>
            <div className="text-[11px] text-muted-foreground">Foundations of Calculus</div>
          </div>
          <div className="flex items-center gap-1">
            <button className="hidden md:grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Search className="h-4 w-4" /></button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Download className="h-4 w-4" /></button>
            <button className="hidden md:grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"><Maximize2 className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 pb-2 px-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-0.5">
            <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><ZoomOut className="h-3.5 w-3.5" /></button>
            <span className="text-xs font-semibold w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><ZoomIn className="h-3.5 w-3.5" /></button>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card px-1 py-0.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><ChevronUp className="h-3.5 w-3.5" /></button>
            <span className="text-xs font-semibold w-14 text-center">{page} / {total}</span>
            <button onClick={() => setPage(p => Math.min(total, p + 1))} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted"><ChevronDown className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-[260px_minmax(0,1fr)_280px] gap-4 p-4">
        {/* Left sidebar */}
        <aside className="hidden lg:block rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="flex p-1 m-2 rounded-xl bg-muted">
            <button onClick={() => setTab("outline")} className={cn("flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", tab === "outline" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
              <List className="h-3.5 w-3.5" /> Outline
            </button>
            <button onClick={() => setTab("thumbs")} className={cn("flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition", tab === "thumbs" ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
              <ImageIcon className="h-3.5 w-3.5" /> Pages
            </button>
          </div>
          {tab === "outline" ? (
            <ul className="px-2 pb-3 space-y-0.5">
              {outline.map((o, i) => (
                <li key={i}>
                  <button className={cn("w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition", o.startsWith(" ") || /^\d+\.\d/.test(o) ? "pl-6 text-muted-foreground hover:bg-muted" : "hover:bg-muted")}>
                    {o}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2 pb-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {Array.from({ length: 8 }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={cn("rounded-lg overflow-hidden border-2 transition", page === i + 1 ? "border-primary" : "border-border hover:border-primary/40")}>
                  <div className="aspect-[3/4] bg-gradient-to-br from-background to-muted grid place-items-center text-[10px] font-semibold text-muted-foreground">Page {i + 1}</div>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* Document */}
        <main className="grid place-items-start overflow-auto">
          <div
            className="mx-auto bg-card rounded-2xl shadow-lift border border-border p-8 lg:p-12 transition-all"
            style={{ width: `${Math.min(800, 600 * (zoom / 100))}px`, maxWidth: "100%" }}
          >
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chapter 3</div>
            <h1 className="mt-2 text-2xl lg:text-3xl font-bold tracking-tight">Applications of Differentiation</h1>
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">
              The derivative is more than an abstract operation — it is a tool for understanding how
              quantities change in relation to one another. In this chapter we apply differentiation
              to problems in optimization, related rates, and curve sketching, drawing connections to
              physics, economics, and engineering.
            </p>
            <h2 className="mt-6 text-lg font-semibold">3.1 Geometric Meaning</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              Geometrically, the derivative at a point gives the slope of the tangent line to the
              curve. Consider a smooth function f(x); the tangent at x = a captures the local linear
              behavior of f near a.
            </p>
            <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4 text-sm">
              <div className="text-xs font-semibold text-primary uppercase tracking-wider">Definition</div>
              <p className="mt-1 italic">f′(a) = lim<sub>h→0</sub> [ f(a + h) − f(a) ] / h</p>
            </div>
            <h2 className="mt-6 text-lg font-semibold">3.2 Optimization</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              A function attains a local maximum or minimum at points where its derivative vanishes
              or fails to exist. We classify these critical points using the first and second
              derivative tests, then apply the technique to real-world problems.
            </p>
            <div className="mt-10 text-center text-xs text-muted-foreground">— Page {page} —</div>
          </div>
        </main>

        {/* Right info */}
        <aside className="hidden lg:block rounded-2xl border border-border bg-card shadow-soft p-5 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold">Document info</h4>
          </div>
          <dl className="space-y-2 text-xs">
            {[
              ["Title", "Applications of Differentiation"],
              ["Author", "Dr. Amelia Chen"],
              ["Pages", String(total)],
              ["Size", "2.8 MB"],
              ["Uploaded", "1 week ago"],
              ["Course", "Foundations of Calculus"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-right truncate">{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
