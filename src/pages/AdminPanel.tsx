
import { useState, useEffect, useRef, useCallback } from "react";
import { Trash2, Edit, Plus, LogOut, Save, X, Upload, Pin, ArrowLeft, ImagePlus, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image_url: string | null;
  image_position: string;
  pinned: boolean;
  gallery_images: string[];
  created_at: string;
}

interface GalleryItem {
  id: string;
  title: string;
  date: string;
  images: string[];
  cover_image: string | null;
  created_at: string;
}

const NEWS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-news`;
const GALLERY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-galleries`;

function getTodayFormatted(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function handleDateInput(value: string, setter: (fn: (prev: any) => any) => void) {
  // Strip everything except digits
  const digits = value.replace(/\D/g, '').slice(0, 8);
  let formatted = '';
  for (let i = 0; i < digits.length; i++) {
    formatted += digits[i];
    if (i === 1 || i === 3) formatted += '.';
  }
  setter((f: any) => ({ ...f, date: formatted }));
}

type AdminView = "main" | "news-form" | "gallery-form";

// Concurrent upload helper - uploads in batches of 5
async function uploadFilesBatch(
  files: File[],
  bucket: string,
  pathPrefix: string,
  onProgress: (completed: number, total: number) => void
): Promise<string[]> {
  const CONCURRENCY = 5;
  const urls: string[] = [];
  let completed = 0;
  const total = files.length;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (file) => {
        const filePath = `${pathPrefix}${Date.now()}-${Math.random().toString(36).slice(2, 6)}-${file.name}`;
        const { error } = await supabase.storage.from(bucket).upload(filePath, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filePath);
        completed++;
        onProgress(completed, total);
        return publicUrl;
      })
    );
    urls.push(...results);
  }
  return urls;
}

// Paginated image grid component for large galleries
const PaginatedImageGrid = ({ images, onRemove }: { images: string[]; onRemove: (index: number) => void }) => {
  const PAGE_SIZE = 30;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset visible count when images change significantly
  useEffect(() => {
    if (visibleCount > images.length + PAGE_SIZE) {
      setVisibleCount(Math.max(PAGE_SIZE, images.length));
    }
  }, [images.length]);

  const visible = images.slice(0, visibleCount);
  const hasMore = visibleCount < images.length;

  return (
    <div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
        {visible.map((url, i) => (
          <div key={`${i}-${url.slice(-20)}`} className="relative group">
            <img src={url} alt={`Slika ${i + 1}`} loading="lazy" decoding="async" className="w-full h-16 rounded-lg object-cover" />
            <button
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, images.length))}
          className="mt-2 w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg"
        >
          Prikaži još ({images.length - visibleCount} preostalo)
        </button>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("admin_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [view, setView] = useState<AdminView>("main");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingGalleryImages, setUploadingGalleryImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const galleryImagesInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "", excerpt: "", date: getTodayFormatted(), image_url: "", image_position: "center", pinned: false, gallery_images: [] as string[], category: String(new Date().getFullYear())
  });

  const [galleryForm, setGalleryForm] = useState({
    title: "", date: getTodayFormatted(), images: [] as string[], cover_image: "" as string
  });
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${NEWS_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("admin_token", data.token);
      setToken(data.token);
      toast({ title: "Uspješna prijava!" });
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    setToken(null);
  };

  const fetchNews = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${NEWS_URL}/list`, { headers });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setNews(data);
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const fetchGalleries = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${GALLERY_URL}/list`, { headers });
      if (res.status === 401) return;
      const data = await res.json();
      setGalleries(data);
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchNews(), fetchGalleries()]).finally(() => setLoading(false));
    }
  }, [token]);

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const filePath = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("news-images").upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("news-images").getPublicUrl(filePath);
      setForm(f => ({ ...f, image_url: publicUrl }));
      toast({ title: "Slika uploadana!" });
    } catch (err: any) {
      toast({ title: "Greška pri uploadu", description: err.message, variant: "destructive" });
    }
    setUploadingImage(false);
  };

  const uploadGalleryImagesForNews = async (files: FileList) => {
    setUploadingGallery(true);
    setUploadProgress("");
    try {
      const newUrls = await uploadFilesBatch(
        Array.from(files), "news-images", "gallery/",
        (done, total) => setUploadProgress(`${done}/${total}`)
      );
      setForm(f => ({ ...f, gallery_images: [...f.gallery_images, ...newUrls] }));
      toast({ title: `${newUrls.length} slika uploadano!` });
    } catch (err: any) {
      toast({ title: "Greška pri uploadu galerije", description: err.message, variant: "destructive" });
    }
    setUploadingGallery(false);
    setUploadProgress("");
  };

  const uploadCoverImage = async (file: File) => {
    setUploadingCoverImage(true);
    try {
      const filePath = `galleries/cover-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("news-images").upload(filePath, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("news-images").getPublicUrl(filePath);
      setGalleryForm(f => ({ ...f, cover_image: publicUrl }));
      toast({ title: "Naslovna slika uploadana!" });
    } catch (err: any) {
      toast({ title: "Greška pri uploadu", description: err.message, variant: "destructive" });
    }
    setUploadingCoverImage(false);
  };

  const uploadGalleryImages = async (files: FileList) => {
    setUploadingGalleryImages(true);
    setUploadProgress("");
    try {
      const newUrls = await uploadFilesBatch(
        Array.from(files), "news-images", "galleries/",
        (done, total) => setUploadProgress(`${done}/${total}`)
      );
      setGalleryForm(f => ({ ...f, images: [...f.images, ...newUrls] }));
      toast({ title: `${newUrls.length} slika uploadano!` });
    } catch (err: any) {
      toast({ title: "Greška pri uploadu", description: err.message, variant: "destructive" });
    }
    setUploadingGalleryImages(false);
    setUploadProgress("");
  };

  const removeGalleryImage = (index: number) => {
    setForm(f => ({ ...f, gallery_images: f.gallery_images.filter((_, i) => i !== index) }));
  };

  const removeGalleryFormImage = (index: number) => {
    setGalleryForm(f => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  };

  const saveNews = async () => {
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`${NEWS_URL}/update`, {
          method: "POST", headers,
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vijest ažurirana!" });
      } else {
        const res = await fetch(`${NEWS_URL}/create`, {
          method: "POST", headers,
          body: JSON.stringify({ ...form, date: form.date }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vijest objavljena!" });
      }
      setEditing(null);
      setView("main");
      setForm({ title: "", excerpt: "", date: getTodayFormatted(), image_url: "", image_position: "center", pinned: false, gallery_images: [], category: String(new Date().getFullYear()) });
      fetchNews();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const saveGallery = async () => {
    setLoading(true);
    try {
      if (editingGallery) {
        const res = await fetch(`${GALLERY_URL}/update`, {
          method: "POST", headers,
          body: JSON.stringify({ id: editingGallery.id, ...galleryForm }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Galerija ažurirana!" });
      } else {
        const res = await fetch(`${GALLERY_URL}/create`, {
          method: "POST", headers,
          body: JSON.stringify(galleryForm),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Galerija objavljena!" });
      }
      setEditingGallery(null);
      setView("main");
      setGalleryForm({ title: "", date: getTodayFormatted(), images: [], cover_image: "" });
      fetchGalleries();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const deleteNews = async (id: string) => {
    try {
      const res = await fetch(`${NEWS_URL}/delete`, {
        method: "POST", headers,
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Vijest obrisana!" });
      fetchNews();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const deleteGallery = async (id: string) => {
    try {
      const res = await fetch(`${GALLERY_URL}/delete`, {
        method: "POST", headers,
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Galerija obrisana!" });
      fetchGalleries();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const startEditNews = (item: NewsItem) => {
    setEditing(item);
    setView("news-form");
    setForm({
      title: item.title,
      excerpt: item.excerpt || "",
      date: item.date || getTodayFormatted(),
      image_url: item.image_url || "",
      image_position: item.image_position,
      pinned: item.pinned,
      gallery_images: item.gallery_images || [],
      category: item.category || String(new Date().getFullYear()),
    });
  };

  const startEditGallery = (item: GalleryItem) => {
    setEditingGallery(item);
    setView("gallery-form");
    setGalleryForm({
      title: item.title,
      date: item.date,
      images: item.images || [],
      cover_image: item.cover_image || "",
    });
  };

  const startCreateNews = () => {
    setEditing(null);
    setView("news-form");
    setForm({ title: "", excerpt: "", date: getTodayFormatted(), image_url: "", image_position: "center", pinned: false, gallery_images: [], category: String(new Date().getFullYear()) });
  };

  const startCreateGallery = () => {
    setEditingGallery(null);
    setView("gallery-form");
    setGalleryForm({ title: "", date: getTodayFormatted(), images: [], cover_image: "" });
  };

  // Login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Nazad</span>
          </button>
          <form onSubmit={login} className="space-y-4 bg-card p-8 rounded-xl border border-border">
            <h1 className="font-display text-3xl text-primary text-center mb-6">Admin Panel</h1>
            <Input placeholder="Korisničko ime" value={username} onChange={e => setUsername(e.target.value)} required />
            <Input type="password" placeholder="Lozinka" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Prijava..." : "Prijavi se"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-[hsl(0,0%,7%)] shadow-md">
        <div className="container mx-auto relative flex items-center justify-between px-4 md:px-8 h-14">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 font-display text-lg md:text-xl text-primary tracking-wide whitespace-nowrap">
            Admin Panel <span className="text-foreground">|</span> <span className="text-foreground">Vijesti & Galerija</span>
          </h1>
          <Button variant="outline" onClick={logout} size="sm" className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
            <LogOut size={16} /> Odjava
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* News Form */}
        {view === "news-form" && (
          <div className="bg-card p-6 rounded-xl border border-border mb-8 space-y-4">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => { setView("main"); setEditing(null); }}
                className="absolute left-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-display text-xl text-primary">{editing ? "Uredi vijest" : "Nova vijest"}</h2>
            </div>
            <Input placeholder="Naslov *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Input placeholder="dd.mm.yyyy" value={form.date} onChange={e => handleDateInput(e.target.value, setForm)} maxLength={10} />
            <textarea
              ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
              placeholder="Tekst vijesti / članka"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] resize-none overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
              onInput={e => { const t = e.currentTarget; t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }}
            />
            <div className="flex gap-4 items-center flex-wrap">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} />
                <Pin size={14} /> Prikvači
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Kategorija:</span>
                <select
                  value={form.category}
                  onChange={e => {
                    if (e.target.value === '__custom__') {
                      setCustomCategory("");
                      setShowCategoryModal(true);
                    } else {
                      setForm(f => ({ ...f, category: e.target.value }));
                    }
                  }}
                  className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="najava">Najava</option>
                  {form.category && !["2026", "2025", "najava"].includes(form.category) && (
                    <option value={form.category}>{form.category}</option>
                  )}
                  <option value="__custom__">+ nova kategorija...</option>
                </select>

                {/* Custom category modal */}
                {showCategoryModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCategoryModal(false)}>
                    <div className="bg-[hsl(0,0%,10%)] border border-primary/30 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                      <h3 className="font-display text-lg text-primary text-center mb-4">Nova kategorija</h3>
                      <input
                        autoFocus
                        value={customCategory}
                        onChange={e => setCustomCategory(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customCategory.trim()) {
                            setForm(f => ({ ...f, category: customCategory.trim() }));
                            setShowCategoryModal(false);
                          }
                        }}
                        placeholder="Unesite naziv kategorije"
                        className="w-full rounded-md border border-primary/30 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowCategoryModal(false)}
                          className="flex-1 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Odustani
                        </button>
                        <button
                          onClick={() => {
                            if (customCategory.trim()) {
                              setForm(f => ({ ...f, category: customCategory.trim() }));
                              setShowCategoryModal(false);
                            }
                          }}
                          disabled={!customCategory.trim()}
                          className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                          Dodaj
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Naslovna slika (thumbnail)</label>
              <div
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); if (e.dataTransfer.files?.[0]) uploadImage(e.dataTransfer.files[0]); }}
                className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
                <Upload size={20} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{uploadingImage ? "Učitavanje..." : "Klikni ili povuci sliku ovdje"}</p>
              </div>
              {form.image_url && (
                <div className="relative inline-block">
                  <img src={form.image_url} alt="Preview" className="h-20 rounded-lg object-cover" />
                  <button
                    onClick={() => setForm(f => ({ ...f, image_url: "" }))}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery images upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Slike članka (galerija)</label>
              <div
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); if (e.dataTransfer.files?.length) uploadGalleryImagesForNews(e.dataTransfer.files); }}
                className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors cursor-pointer"
                onClick={() => galleryInputRef.current?.click()}
              >
                <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files?.length) uploadGalleryImagesForNews(e.target.files); }} />
                <ImagePlus size={20} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{uploadingGallery ? `Učitavanje${uploadProgress ? ` (${uploadProgress})` : ""}...` : "Klikni ili povuci slike ovdje"}</p>
              </div>
              {form.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {form.gallery_images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Galerija ${i + 1}`} className="w-full h-16 rounded-lg object-cover" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={saveNews} disabled={loading || !form.title} className="w-full">
              <Save size={16} /> {loading ? "Spremanje..." : editing ? "Spremi promjene" : "Objavi vijest"}
            </Button>
          </div>
        )}

        {/* Gallery Form */}
        {view === "gallery-form" && (
          <div className="bg-card p-6 rounded-xl border border-border mb-8 space-y-4">
            <div className="relative flex items-center justify-center">
              <button
                onClick={() => { setView("main"); setEditingGallery(null); }}
                className="absolute left-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="font-display text-xl text-primary">{editingGallery ? "Uredi galeriju" : "Nova galerija"}</h2>
            </div>
            <Input placeholder="Naslov galerije *" value={galleryForm.title} onChange={e => setGalleryForm(f => ({ ...f, title: e.target.value }))} />
            <Input placeholder="dd.mm.yyyy" value={galleryForm.date} onChange={e => handleDateInput(e.target.value, setGalleryForm)} maxLength={10} />
            
            {/* Cover image upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Naslovna slika</label>
              <div
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); if (e.dataTransfer.files?.[0]) uploadCoverImage(e.dataTransfer.files[0]); }}
                className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors cursor-pointer"
                onClick={() => coverImageInputRef.current?.click()}
              >
                <input ref={coverImageInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadCoverImage(e.target.files[0]); }} />
                <Upload size={20} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{uploadingCoverImage ? "Učitavanje..." : "Klikni ili povuci naslovnu sliku ovdje"}</p>
              </div>
              {galleryForm.cover_image && (
                <div className="relative inline-block">
                  <img src={galleryForm.cover_image} alt="Cover" className="h-20 rounded-lg object-cover" />
                  <button
                    onClick={() => setGalleryForm(f => ({ ...f, cover_image: "" }))}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Gallery images upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium">Slike galerije</label>
              <div
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('border-primary', 'bg-primary/5'); }}
                onDragLeave={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('border-primary', 'bg-primary/5'); if (e.dataTransfer.files?.length) uploadGalleryImages(e.dataTransfer.files); }}
                className="border-2 border-dashed border-border rounded-lg p-4 text-center transition-colors cursor-pointer"
                onClick={() => galleryImagesInputRef.current?.click()}
              >
                <input ref={galleryImagesInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files?.length) uploadGalleryImages(e.target.files); }} />
                <ImagePlus size={20} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{uploadingGalleryImages ? "Učitavanje..." : "Klikni ili povuci slike ovdje"}</p>
              </div>
              {galleryForm.images.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {galleryForm.images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Slika ${i + 1}`} className="w-full h-16 rounded-lg object-cover" />
                      <button
                        onClick={() => removeGalleryFormImage(i)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{galleryForm.images.length} slika dodano</p>
            </div>

            <Button onClick={saveGallery} disabled={loading || !galleryForm.title || !galleryForm.date} className="w-full">
              <Save size={16} /> {loading ? "Spremanje..." : editingGallery ? "Spremi promjene" : "Objavi galeriju"}
            </Button>
          </div>
        )}

        {/* Main view - buttons and lists */}
        {view === "main" && (
          <>
            <div className="flex items-center justify-center gap-4 mb-8">
              <Button onClick={startCreateNews} variant="outline" size="lg" className="border-primary bg-background text-foreground hover:bg-primary hover:text-primary-foreground px-6 py-3 text-base transition-colors">
                <Newspaper size={20} /> Nova vijest
              </Button>
              <Button onClick={startCreateGallery} variant="outline" size="lg" className="border-primary bg-background text-foreground hover:bg-primary hover:text-primary-foreground px-6 py-3 text-base transition-colors">
                <ImagePlus size={20} /> Nova galerija
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* News section */}
              <div>
                <h2 className="font-display text-xl text-primary mb-4 text-center">Vijesti</h2>
                <div className="space-y-3">
                  {loading && news.length === 0 && <p className="text-muted-foreground text-center py-4">Učitavanje...</p>}
                  {!loading && news.length === 0 && <p className="text-muted-foreground text-center py-4">Nema vijesti. Dodajte prvu!</p>}
                  {news.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-foreground font-medium truncate text-sm">{item.title}</h3>
                          {item.pinned && <Pin size={12} className="text-primary rotate-45 flex-shrink-0" />}
                        </div>
                        <p className="text-muted-foreground text-xs flex items-center leading-none">
                          <span>{item.date} • {item.category}</span>
                          {item.gallery_images?.length > 0 && <span className="ml-1.5 text-primary inline-flex items-center gap-0.5"><ImagePlus size={11} className="flex-shrink-0" /> {item.gallery_images.length}</span>}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => startEditNews(item)}>
                          <Edit size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[hsl(0,0%,7%)] border-primary/30 text-foreground">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-primary">Obriši vijest</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Jeste li sigurni da želite obrisati ovu vijest? Ova radnja se ne može poništiti.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-muted">Odustani</AlertDialogCancel>
                              <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/80" onClick={() => deleteNews(item.id)}>Obriši</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Galleries section */}
              <div>
                <h2 className="font-display text-xl text-primary mb-4 text-center">Galerije</h2>
                <div className="space-y-3">
                  {!loading && galleries.length === 0 && <p className="text-muted-foreground text-center py-4">Nema galerija. Dodajte prvu!</p>}
                  {galleries.map(item => (
                    <div key={item.id} className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border">
                      {(item.cover_image || item.images?.[0]) && (
                        <img src={item.cover_image || item.images[0]} alt={item.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground font-medium truncate text-sm">{item.title}</h3>
                        <p className="text-muted-foreground text-xs flex items-center leading-none">
                          <span>{item.date}</span>
                          {item.images?.length > 0 && <span className="ml-1.5 text-primary inline-flex items-center gap-0.5"><ImagePlus size={11} className="flex-shrink-0" /> {item.images.length}</span>}
                        </p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => startEditGallery(item)}>
                          <Edit size={14} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 size={14} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-[hsl(0,0%,7%)] border-primary/30 text-foreground">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-primary">Obriši galeriju</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Jeste li sigurni da želite obrisati ovu galeriju? Ova radnja se ne može poništiti.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent border-border text-foreground hover:bg-muted">Odustani</AlertDialogCancel>
                              <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/80" onClick={() => deleteGallery(item.id)}>Obriši</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
};

export default AdminPanel;
