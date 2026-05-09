"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, ChevronRight, ChevronLeft, Loader2, Sparkles, LayoutGrid, DollarSign } from "lucide-react";

const TOOLS = ["Cursor", "ChatGPT", "Claude", "GitHub Copilot", "Gemini", "OpenAI API", "Anthropic API", "Windsurf"];
const PLANS = {
  Cursor: ["Pro", "Business"],
  ChatGPT: ["Plus", "Team", "Enterprise"],
  Claude: ["Pro", "Team"],
  "GitHub Copilot": ["Individual", "Business", "Enterprise"],
  Gemini: ["Advanced", "Business", "Enterprise"],
  "OpenAI API": ["Pay as you go"],
  "Anthropic API": ["Pay as you go"],
  Windsurf: ["Pro"],
};
const USE_CASES = ["Coding", "Writing", "Research", "Data Analysis", "Mixed"];

const defaultTool = () => ({
  id: Date.now(),
  name: "ChatGPT",
  plan: "Team",
  monthlySpend: "",
  seats: "1",
  teamSize: "",
  useCase: "Coding",
});

export default function AuditPage() {
  const router = useRouter();
  const [tools, setTools] = useState([defaultTool()]);
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("credex-audit-tools");
    if (saved) {
      try { setTools(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("credex-audit-tools", JSON.stringify(tools));
  }, [tools]);

  const updateTool = (id, field, value) => {
    setTools(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, [field]: value, ...(field === "name" ? { plan: PLANS[value][0] } : {}) }
          : t
      )
    );
  };

  const addTool = () => setTools(prev => [...prev, defaultTool()]);
  const removeTool = (id) => setTools(prev => prev.filter(t => t.id !== id));

  const validate = () => {
    for (const tool of tools) {
      if (!tool.monthlySpend || isNaN(Number(tool.monthlySpend)) || Number(tool.monthlySpend) < 0) return "Valid monthly spend required.";
      if (!tool.seats || Number(tool.seats) < 1) return "Min 1 seat required.";
      if (!tool.teamSize || Number(tool.teamSize) < 1) return "Team size required.";
    }
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: tools.map(t => ({ ...t, monthlySpend: Number(t.monthlySpend), seats: Number(t.seats), teamSize: Number(t.teamSize) })) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      localStorage.removeItem("credex-audit-tools");
      router.push(`/results/${data.id}`);
    } catch (err) {
      setError(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  const totalSpend = tools.reduce((sum, t) => sum + (Number(t.monthlySpend) || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-background pb-32">
      {/* Sticky Compact Header for Mobile */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight uppercase opacity-60">AI Audit</h2>
            <div className="flex gap-1">
                <div className={`h-1.5 w-8 rounded-full ${step === 0 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-1.5 w-8 rounded-full ${step === 1 ? "bg-primary" : "bg-muted"}`} />
            </div>
        </div>
      </header>

      <div className="container mx-auto px-5 max-w-xl mt-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-left">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Build your stack</h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed italic">Add your tools to see potential savings.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              {tools.map((tool, idx) => (
                <div key={tool.id} className="relative p-5 rounded-[22px] border bg-card shadow-sm border-border/60">
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex items-center gap-2 text-[13px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">
                       <LayoutGrid className="w-3 h-3" /> Tool {idx + 1}
                    </span>
                    {tools.length > 1 && (
                      <button onClick={() => removeTool(tool.id)} className="text-muted-foreground hover:text-destructive p-2 bg-muted/30 rounded-full transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-y-5">
                    {/* Compact Form Rows */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Tool Name</label>
                            <select value={tool.name} onChange={e => updateTool(tool.id, "name", e.target.value)} className="w-full h-11 px-3 rounded-xl border bg-black text-[14px] focus:ring-1 focus:ring-primary outline-none appearance-none">
                                {TOOLS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Plan</label>
                            <select value={tool.plan} onChange={e => updateTool(tool.id, "plan", e.target.value)} className="w-full h-11 px-3 rounded-xl border bg-black text-[14px] focus:ring-1 focus:ring-primary outline-none">
                                {(PLANS[tool.name] || []).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Monthly Spend</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-4 h-4 opacity-40" />
                                <input type="number" placeholder="0.00" value={tool.monthlySpend} onChange={e => updateTool(tool.id, "monthlySpend", e.target.value)} className="w-full h-11 pl-8 pr-3 rounded-xl border bg-secondary/30 text-[14px] outline-none" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Total Seats</label>
                            <input type="number" placeholder="1" value={tool.seats} onChange={e => updateTool(tool.id, "seats", e.target.value)} className="w-full h-11 px-3 rounded-xl border bg-secondary/30 text-[14px] outline-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Team Size</label>
                            <input type="number" placeholder="8" value={tool.teamSize} onChange={e => updateTool(tool.id, "teamSize", e.target.value)} className="w-full h-11 px-3 rounded-xl border bg-secondary/30 text-[14px] outline-none" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase opacity-50 ml-1">Use Case</label>
                            <select value={tool.useCase} onChange={e => updateTool(tool.id, "useCase", e.target.value)} className="w-full h-11 px-3 rounded-xl border bg-black text-[14px] outline-none">
                                {USE_CASES.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addTool} className="w-full py-4 rounded-[20px] border-2 border-dashed border-muted-foreground/20 text-[14px] font-semibold text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Tool
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="p-6 rounded-[28px] border bg-card shadow-sm">
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">Review Summary</h2>
                <div className="space-y-3">
                  {tools.map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between py-3 border-b border-border/40 last:border-0">
                      <div>
                        <p className="text-[14px] font-bold">{tool.name}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{tool.plan} · {tool.seats} Seats</p>
                      </div>
                      <p className="font-bold text-[15px]">${Number(tool.monthlySpend).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-2xl bg-primary/5 flex justify-between items-center border border-primary/10">
                  <span className="text-[13px] font-bold uppercase opacity-60">Total Monthly</span>
                  <span className="text-xl font-black text-primary">${totalSpend.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar - Mobile Bottom Floating Style */}
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-xl border-t z-50">
          <div className="container max-w-xl mx-auto flex flex-col gap-3">
            {error && <p className="text-[12px] text-destructive bg-destructive/5 py-2 px-3 rounded-lg text-center font-medium">{error}</p>}
            
            <div className="flex gap-3">
               {step === 1 && (
                 <button onClick={() => setStep(0)} className="h-14 px-6 rounded-2xl border font-bold hover:bg-muted transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                 </button>
               )}
               <button
                  onClick={step === 0 ? () => { const err = validate(); if (err) { setError(err); return; } setError(""); setStep(1); } : handleSubmit}
                  disabled={loading}
                  className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (step === 0 ? "Continue" : "Analyze Stack")}
                  {step === 0 && !loading && <ChevronRight className="w-5 h-5" />}
                  {step === 1 && !loading && <Sparkles className="w-5 h-5" />}
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}