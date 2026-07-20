import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Upload, FileType2, Eye, Download, Trash2, X, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useMaterials, useDeleteMaterial, useLessons, useCreateMaterial } from "@/lib/queries";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/materials")({
  head: () => ({ meta: [{ title: "PDF Materials — Apex Tutors" }] }),
  component: MaterialsPage,
});

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function MaterialsPage() {
  const [showUpload, setShowUpload] = useState(false);
  const { data: materials, isLoading } = useMaterials();
  const deleteMutation = useDeleteMaterial();

  const items = materials || [];

  return (
    <AppShell
      title="PDF Materials"
      subtitle="All course documents, lecture notes, and worksheets."
      actions={
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition">
          <Upload className="h-4 w-4" /> Upload PDF
        </button>
      }
    >
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-5">File</th>
                <th className="py-3 px-5 hidden md:table-cell">Lesson</th>
                <th className="py-3 px-5 hidden lg:table-cell">Size</th>
                <th className="py-3 px-5 hidden lg:table-cell">Uploaded by</th>
                <th className="py-3 px-5 hidden sm:table-cell">Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">Loading materials...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">No materials found.</td>
                </tr>
              ) : (
                items.map((m: any) => (
                  <tr key={m.id} className="hover:bg-muted/40 transition">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
                          <FileType2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold">{m.title}</div>
                          <div className="md:hidden text-xs text-muted-foreground truncate">{m.lesson_title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-5 hidden md:table-cell text-muted-foreground">{m.lesson_title || "—"}</td>
                    <td className="py-3 px-5 hidden lg:table-cell text-muted-foreground">{formatBytes(m.size_bytes)}</td>
                    <td className="py-3 px-5 hidden lg:table-cell text-muted-foreground">{m.uploader_name || "Unknown"}</td>
                    <td className="py-3 px-5 hidden sm:table-cell text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</td>
                    <td className="py-3 px-5">
                      <div className="flex justify-end items-center gap-1">
                        <Link to="/reader" className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition" title="View"><Eye className="h-4 w-4" /></Link>
                        <button className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition" title="Download"><Download className="h-4 w-4" /></button>
                        <button 
                          onClick={() => { if (confirm("Are you sure?")) deleteMutation.mutate(m.id); }}
                          disabled={deleteMutation.isPending}
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition disabled:opacity-50" 
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted-foreground">
          <div>Showing 1–{items.length} of {items.length} files</div>
          <div className="flex gap-1">
            <button className="rounded-lg border border-border px-2.5 py-1 hover:bg-muted">Prev</button>
            <button className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1">1</button>
            <button className="rounded-lg border border-border px-2.5 py-1 hover:bg-muted">Next</button>
          </div>
        </div>
      </div>

      {/* Floating upload button (mobile) */}
      <button onClick={() => setShowUpload(true)} className="lg:hidden fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift hover:bg-primary/90 transition">
        <Upload className="h-5 w-5" />
      </button>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </AppShell>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  
  const [title, setTitle] = useState("");
  const [lessonId, setLessonId] = useState("");
  
  const { data: lessons } = useLessons();
  const createMutation = useCreateMaterial();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !lessonId) return;

    setProgress(30);
    // In a real app we would upload the file to Supabase Storage here.
    // For now we just create the database record.
    setProgress(70);
    
    createMutation.mutate({
      title,
      lesson_id: lessonId,
      file_url: URL.createObjectURL(file), // mock url
      size_bytes: file.size,
    }, {
      onSuccess: () => {
        setProgress(100);
        setTimeout(onClose, 500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-card shadow-lift border border-border p-6" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleUpload}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold">Upload PDF</h3>
            <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition"><X className="h-4 w-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Attach a new document to a lesson.</p>

          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) { setFile(f); setTitle(f.name); } }}
            className={`block rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/40"}`}
          >
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setTitle(f.name); } }} />
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-3">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="font-semibold">Drop PDF here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse files (max 25 MB)</div>
          </label>

          {file && (
            <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <FileType2 className="h-5 w-5 text-destructive" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{file.name}</div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{progress}%</span>
              </div>
            </div>
          )}

          <div className="mt-5 space-y-3">
            <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Lecture 5 — Series & Convergence" />
            <div>
              <label className="text-sm font-medium">Lesson</label>
              <select required value={lessonId} onChange={e => setLessonId(e.target.value)} className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary">
                <option value="" disabled>Select a lesson</option>
                {lessons?.map((l: any) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted transition">Cancel</button>
            <button type="submit" disabled={!file || createMutation.isPending} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition disabled:opacity-50">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input {...rest} className="mt-1.5 w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition" />
    </label>
  );
}
