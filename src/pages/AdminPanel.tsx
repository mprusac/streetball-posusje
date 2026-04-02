
import { useState, useEffect, useRef } from "react";
import { Trash2, Edit, Plus, LogOut, Save, X, Upload, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image_url: string | null;
  image_position: string;
  pinned: boolean;
  created_at: string;
}

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-news`;

function getTodayFormatted(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  return `${dd}. ${mm}. ${yyyy}.`;
}

const AdminPanel = () => {
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("admin_token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [form, setForm] = useState({
    title: "", excerpt: "", image_url: "", image_position: "center", pinned: false
  });

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${FUNCTION_URL}/login`, {
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
    setLoading(true);
    try {
      const res = await fetch(`${FUNCTION_URL}/list`, { headers });
      if (res.status === 401) { logout(); return; }
      const data = await res.json();
      setNews(data);
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  useEffect(() => { if (token) fetchNews(); }, [token]);

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

  const saveNews = async () => {
    setLoading(true);
    try {
      if (editing) {
        const res = await fetch(`${FUNCTION_URL}/update`, {
          method: "PUT", headers,
          body: JSON.stringify({ id: editing.id, ...form }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vijest ažurirana!" });
      } else {
        const now = getTodayFormatted();
        const year = String(new Date().getFullYear());
        const res = await fetch(`${FUNCTION_URL}/create`, {
          method: "POST", headers,
          body: JSON.stringify({ ...form, date: now, category: year }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vijest objavljena!" });
      }
      setEditing(null);
      setCreating(false);
      setForm({ title: "", excerpt: "", image_url: "", image_position: "center", pinned: false });
      fetchNews();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const deleteNews = async (id: string) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovu vijest?")) return;
    try {
      const res = await fetch(`${FUNCTION_URL}/delete`, {
        method: "DELETE", headers,
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Vijest obrisana!" });
      fetchNews();
    } catch (err: any) {
      toast({ title: "Greška", description: err.message, variant: "destructive" });
    }
  };

  const startEdit = (item: NewsItem) => {
    setEditing(item);
    setCreating(true);
    setForm({
      title: item.title,
      excerpt: item.excerpt || "",
      image_url: item.image_url || "",
      image_position: item.image_position,
      pinned: item.pinned,
    });
  };

  const startCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm({ title: "", excerpt: "", image_url: "", image_position: "center", pinned: false });
  };

  // Login screen
  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 bg-card p-8 rounded-xl border border-border">
          <h1 className="font-display text-3xl text-primary text-center mb-6">Admin Panel</h1>
          <Input placeholder="Korisničko ime" value={username} onChange={e => setUsername(e.target.value)} required />
          <Input type="password" placeholder="Lozinka" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Prijava..." : "Prijavi se"}
          </Button>
        </form>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl text-primary">Admin Panel - Vijesti</h1>
          <Button variant="outline" onClick={logout} size="sm">
            <LogOut size={16} /> Odjava
          </Button>
        </div>

        {/* Create/Edit Form */}
        {creating ? (
          <div className="bg-card p-6 rounded-xl border border-border mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground">{editing ? "Uredi vijest" : "Nova vijest"}</h2>
              <Button variant="ghost" size="icon" onClick={() => { setCreating(false); setEditing(null); }}>
                <X size={20} />
              </Button>
            </div>
            <Input placeholder="Naslov *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea
              placeholder="Kratki opis / izvadak"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.excerpt}
              onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
            />
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e => setForm(f => ({ ...f, pinned: e.target.checked }))} />
                <Pin size={14} /> Prikvači
              </label>
            </div>
            
            {/* Image upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Thumbnail slika</label>
              <div className="flex gap-2">
                <Input
                  placeholder="URL slike"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="flex-1"
                />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) uploadImage(e.target.files[0]); }} />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  <Upload size={16} /> {uploadingImage ? "..." : "Upload"}
                </Button>
              </div>
              {form.image_url && (
                <img src={form.image_url} alt="Preview" className="h-32 rounded-lg object-cover" />
              )}
            </div>

            <Button onClick={saveNews} disabled={loading || !form.title} className="w-full">
              <Save size={16} /> {loading ? "Spremanje..." : editing ? "Spremi promjene" : "Objavi vijest"}
            </Button>
          </div>
        ) : (
          <Button onClick={startCreate} className="mb-6">
            <Plus size={16} /> Nova vijest
          </Button>
        )}

        {/* News list */}
        <div className="space-y-3">
          {loading && news.length === 0 && <p className="text-muted-foreground text-center py-8">Učitavanje...</p>}
          {!loading && news.length === 0 && <p className="text-muted-foreground text-center py-8">Nema vijesti u bazi. Dodajte prvu!</p>}
          {news.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground font-medium truncate">{item.title}</h3>
                  {item.pinned && <Pin size={14} className="text-primary rotate-45 flex-shrink-0" />}
                </div>
                <p className="text-muted-foreground text-sm">{item.date} • {item.category}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="icon" onClick={() => startEdit(item)}>
                  <Edit size={16} />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => deleteNews(item.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
