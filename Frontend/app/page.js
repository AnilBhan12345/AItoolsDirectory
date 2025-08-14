'use client';
import { useEffect, useMemo, useState } from 'react';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = 60 * 1000;
  const hr = 60 * min;
  const day = 24 * hr;
  if (diff < hr) return Math.floor(diff / min) + 'm ago';
  if (diff < day) return Math.floor(diff / hr) + 'h ago';
  return Math.floor(diff / day) + 'd ago';
}

const MOCK_TOOLS = [
  {
    id: '1',
    name: 'PromptCraft',
    homepage: 'https://example.com/promptcraft',
    logo: 'https://api.dicebear.com/8.x/shapes/svg?seed=promptcraft&backgroundType=gradientLinear',
    short_desc: 'Visual prompt composer with versioning and team sharing.',
    categories: ['Productivity', 'Prompting'],
    pricing: 'Freemium',
    company: 'PromptCraft Inc.',
    tags: ['prompt', 'workflow', 'teams'],
    launch_date: '2024-11-01',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    score: 84,
    stars_delta: 120,
  },
  {
    id: '2',
    name: 'CodeGenie',
    homepage: 'https://example.com/codegenie',
    logo: 'https://api.dicebear.com/8.x/shapes/svg?seed=codegenie&backgroundType=gradientLinear',
    short_desc: 'Inline AI pair programming for every editor.',
    categories: ['Developer Tools'],
    pricing: 'Paid',
    company: 'Genie Labs',
    tags: ['coding', 'IDE', 'autocomplete'],
    launch_date: '2025-03-12',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    score: 92,
    stars_delta: 65,
  },
  {
    id: '3',
    name: 'ImageSmith',
    homepage: 'https://example.com/imagesmith',
    logo: 'https://api.dicebear.com/8.x/shapes/svg?seed=imagesmith&backgroundType=gradientLinear',
    short_desc: 'Generative image studio with layers and masks.',
    categories: ['Design', 'Media'],
    pricing: 'Freemium',
    company: 'Smith Creative',
    tags: ['images', 'editing', 'studio'],
    launch_date: '2023-09-10',
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    score: 76,
    stars_delta: 12,
  },
  {
    id: '4',
    name: 'ChatFlow',
    homepage: 'https://example.com/chatflow',
    logo: 'https://api.dicebear.com/8.x/shapes/svg?seed=chatflow&backgroundType=gradientLinear',
    short_desc: 'Drag-and-drop workflow builder for multi-agent automations.',
    categories: ['Automation', 'Agents'],
    pricing: 'Contact',
    company: 'Flow Systems',
    tags: ['agents', 'workflows', 'automation'],
    launch_date: '2025-05-20',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    score: 89,
    stars_delta: 210,
  },
];

export default function Page() {
  const [tools, setTools] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState('All');
  const [sort, setSort] = useState('Trending');
  const [selected, setSelected] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);
  const ALL_CATEGORIES = ['All','Productivity','Developer Tools','Design','Media','Automation','Agents','Writing','Search','Analytics'];
  const PRICING = ['All','Free','Freemium','Paid','Contact'];

  useEffect(() => {
    // In a future step, replace with fetch('/api/tools')
    setTools(MOCK_TOOLS);
  }, []);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    let list = tools.filter((t) => {
      const matchesText = !text ? true :
        [t.name, t.short_desc, t.tags.join(' '), t.categories.join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(text);
      const matchesCat = category === 'All' || t.categories.includes(category);
      const matchesPrice = price === 'All' || t.pricing === price;
      return matchesText && matchesCat && matchesPrice;
    });
    switch (sort) {
      case 'Trending':
        list = list.sort((a,b)=> b.score - a.score); break;
      case 'Recently Updated':
        list = list.sort((a,b)=> new Date(b.updated_at) - new Date(a.updated_at)); break;
      case 'A → Z':
        list = list.sort((a,b)=> a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [tools, q, category, price, sort]);

  const trending = useMemo(() => [...tools].sort((a,b)=> b.score - a.score).slice(0,5), [tools]);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-items-center shadow">AI</div>
            <span className="font-semibold text-lg tracking-tight">AI Tools Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setShowSubmit(true)} className="rounded-2xl border px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100">Submit Tool</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="container py-10">
        <div className="rounded-3xl border bg-white p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs">Live updates ready</span>
            <span className="rounded-xl border px-3 py-1 text-xs">Auto-discovery engine</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Discover & track the latest <span className="text-slate-600">AI tools</span>
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Search, filter, and compare AI products. This starter connects to a backend API for automatic updates and change detection.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <div className="relative">
                <input
                  className="pl-3 pr-3 py-2 w-full rounded-2xl border"
                  placeholder="Search tools by name, tag, or category"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full rounded-2xl border px-3 py-2">
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <select value={price} onChange={(e)=>setPrice(e.target.value)} className="w-full rounded-2xl border px-3 py-2">
                {PRICING.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="md:col-span-1">
              <select value={sort} onChange={(e)=>setSort(e.target.value)} className="w-full rounded-2xl border px-3 py-2">
                {['Trending','Recently Updated','A → Z'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid gap-4">
          {filtered.length === 0 && (
            <div className="rounded-3xl border p-6 bg-white">
              <div className="font-semibold">No results</div>
              <div className="text-slate-600 text-sm">Try different keywords or filters.</div>
            </div>
          )}
          {filtered.map((t) => (
            <div key={t.id} className="rounded-3xl border bg-white hover:shadow-md transition-shadow">
              <div className="p-6 flex flex-row items-start gap-4">
                <img src={t.logo} alt={t.name} className="h-12 w-12 rounded-2xl bg-slate-100 border" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-xl font-semibold">{t.name}</div>
                    <div className="flex gap-2 flex-wrap">
                      {t.categories.map((c) => (
                        <span key={c} className="rounded-xl border px-2 py-1 text-xs">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-1 text-slate-600">{t.short_desc}</div>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs">{t.pricing}</span>
                    {t.tags.slice(0,3).map(tag => (
                      <span key={tag} className="rounded-xl border px-2 py-1 text-xs">#{tag}</span>
                    ))}
                    <span className="text-xs text-slate-500 ml-auto">Updated {timeAgo(t.updated_at)}</span>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex items-center justify-between text-sm text-slate-700">
                <div className="flex items-center gap-3">
                  <span>Score {t.score}</span>
                  {typeof t.stars_delta === 'number' && (<span>★ +{t.stars_delta}/wk</span>)}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setSelected(t)} className="rounded-2xl border px-3 py-2 bg-white hover:bg-slate-50">Details</button>
                  <a href={t.homepage} target="_blank" rel="noreferrer">
                    <button className="rounded-2xl px-3 py-2 bg-slate-900 text-white hover:opacity-90">Visit</button>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: trending */}
        <aside className="lg:col-span-4">
          <div className="rounded-3xl border sticky top-24 bg-white">
            <div className="p-6">
              <div className="font-semibold text-lg">Trending</div>
              <div className="text-slate-600 text-sm mb-3">Top tools by engagement and freshness.</div>
              <div className="grid gap-3">
                {trending.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-6 text-right">{i+1}.</span>
                    <img src={t.logo} alt={t.name} className="h-8 w-8 rounded-xl border" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{t.name}</div>
                      <div className="text-xs text-slate-500 truncate">Score {t.score} · {t.pricing}</div>
                    </div>
                    <a href={t.homepage} target="_blank" rel="noreferrer" className="ml-auto">
                      <button className="rounded-xl border px-2 py-1 text-xs bg-white hover:bg-slate-50">Open</button>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t px-6 py-3 text-xs text-slate-500">
              Auto-refresh reads your API every few hours.
            </div>
          </div>
        </aside>
      </section>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={()=>setSelected(null)}>
          <div className="max-w-2xl w-full rounded-3xl bg-white p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-2">
              <img src={selected.logo} className="h-10 w-10 rounded-2xl border" />
              <div className="text-xl font-semibold">{selected.name}</div>
            </div>
            <div className="text-slate-600">{selected.short_desc}</div>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {selected.categories.map(c => <span key={c} className="rounded-xl border px-2 py-1 text-xs">{c}</span>)}
              <span className="rounded-xl bg-slate-100 px-2 py-1 text-xs">{selected.pricing}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
              <div className="rounded-2xl border p-3">
                <div className="text-xs text-slate-500">Trending score</div>
                <div className="text-xl font-semibold">{selected.score}</div>
              </div>
              <div className="rounded-2xl border p-3">
                <div className="text-xs text-slate-500">Stars delta</div>
                <div className="text-xl font-semibold">{selected.stars_delta ?? '—'}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">Last updated {timeAgo(selected.updated_at)}</span>
              <a href={selected.homepage} target="_blank" rel="noreferrer">
                <button className="rounded-2xl px-3 py-2 bg-slate-900 text-white hover:opacity-90">Visit website</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmit && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={()=>setShowSubmit(false)}>
          <div className="max-w-lg w-full rounded-3xl bg-white p-6" onClick={(e)=>e.stopPropagation()}>
            <div className="text-lg font-semibold mb-1">Submit your AI tool</div>
            <div className="text-slate-600 text-sm mb-4">Add details so we can review and publish.</div>
            <form className="grid gap-3">
              <input className="rounded-xl border px-3 py-2" placeholder="Tool name" />
              <input className="rounded-xl border px-3 py-2" type="url" placeholder="Homepage URL" />
              <input className="rounded-xl border px-3 py-2" placeholder="One-line description" />
              <div className="grid grid-cols-2 gap-3">
                <input className="rounded-xl border px-3 py-2" placeholder="Categories (comma separated)" />
                <input className="rounded-xl border px-3 py-2" placeholder="Tags (comma separated)" />
              </div>
              <select defaultValue="Freemium" className="rounded-xl border px-3 py-2">
                {['Free','Freemium','Paid','Contact'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <button type="button" onClick={()=>setShowSubmit(false)} className="rounded-2xl px-3 py-2 bg-slate-900 text-white hover:opacity-90">Send</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8 text-sm text-slate-500 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} AI Tools Hub. Built with Next.js + Tailwind. Starter UI.</div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border px-2 py-1 text-xs">LLM-powered extraction ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
