"use client";

import { useState } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";

export default function AlertsPage() {
  const [keyword, setKeyword] = useState("");
  const [alerts, setAlerts] = useState([
    { id: 1, term: "Remote Python", active: true },
    { id: 2, term: "Video Editing", active: true },
  ]);

  const addAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setAlerts([{ id: Date.now(), term: keyword, active: true }, ...alerts]);
    setKeyword("");
  };

  const removeAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 w-full">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600 stroke-[2]" /> Opportunity Alerts
        </h1>
        <p className="text-sm text-slate-500 mt-1">Get notified when new jobs match your exact keywords.</p>
      </div>

      <form onSubmit={addAlert} className="flex gap-2 mb-8">
        <input 
          type="text" 
          placeholder="E.g. 'Graphic Design', 'Data Entry'..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition"
        />
        <button type="submit" className="px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No active alerts. Add a keyword above.</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${alert.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className={`text-sm font-medium ${alert.active ? "text-slate-900" : "text-slate-500"}`}>{alert.term}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleAlert(alert.id)} 
                  className={`text-xs font-medium ${alert.active ? "text-slate-500 hover:text-slate-700" : "text-emerald-600 hover:text-emerald-700"}`}
                >
                  {alert.active ? "Pause" : "Resume"}
                </button>
                <button onClick={() => removeAlert(alert.id)} className="text-slate-400 hover:text-red-500 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
