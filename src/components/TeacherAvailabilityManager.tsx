import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock, Plus, Trash2, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Slot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
  isNew?: boolean;
}

const TeacherAvailabilityManager = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const DAYS = [
    { value: 0, label: t("day_sun") },
    { value: 1, label: t("day_mon") },
    { value: 2, label: t("day_tue") },
    { value: 3, label: t("day_wed") },
    { value: 4, label: t("day_thu") },
    { value: 5, label: t("day_fri") },
    { value: 6, label: t("day_sat") },
  ];

  const fetchSlots = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("teacher_availability")
      .select("*")
      .eq("teacher_id", user.id)
      .order("day_of_week")
      .order("start_time");
    setSlots((data as Slot[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const addSlot = (day: number) => {
    setSlots((prev) => [...prev, { day_of_week: day, start_time: "09:00", end_time: "17:00", is_active: true, isNew: true }]);
  };

  const removeSlot = async (index: number) => {
    const slot = slots[index];
    if (slot.id) {
      await supabase.from("teacher_availability").delete().eq("id", slot.id);
    }
    setSlots((prev) => prev.filter((_, i) => i !== index));
    toast.success(t("time_deleted"));
  };

  const updateSlot = (index: number, field: keyof Slot, value: string | boolean) => {
    setSlots((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const saveAll = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("teacher_availability").delete().eq("teacher_id", user.id);
      const activeSlots = slots.filter((s) => s.is_active);
      if (activeSlots.length > 0) {
        const { error } = await supabase.from("teacher_availability").insert(
          activeSlots.map((s) => ({
            teacher_id: user.id,
            day_of_week: s.day_of_week,
            start_time: s.start_time,
            end_time: s.end_time,
            is_active: true,
          }))
        );
        if (error) throw error;
      }
      toast.success(t("schedule_saved"));
      fetchSlots();
    } catch (e: any) {
      toast.error(t("save_error") + " " + e.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-extrabold text-lg flex items-center gap-2"><Clock size={20} className="text-primary" /> {t("manage_availability")}</h3>
      </div>
      
      {DAYS.map((day) => {
        const daySlots = slots.filter((s) => s.day_of_week === day.value);
        return (
          <div key={day.value} className="card-base p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm">{day.label}</span>
              <button onClick={() => addSlot(day.value)} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus size={14} /> {t("add_time")}
              </button>
            </div>
            {daySlots.length === 0 ? (
              <p className="text-muted-foreground text-xs">{t("no_times_set")}</p>
            ) : (
              <div className="space-y-2">
                {daySlots.map((slot) => {
                  const idx = slots.indexOf(slot);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-secondary rounded-xl">
                      <input type="checkbox" checked={slot.is_active} onChange={(e) => updateSlot(idx, "is_active", e.target.checked)} className="w-4 h-4 accent-primary" />
                      <input type="time" value={slot.start_time} onChange={(e) => updateSlot(idx, "start_time", e.target.value)} className="input-base !w-auto text-sm" />
                      <span className="text-muted-foreground text-sm">{t("to_word")}</span>
                      <input type="time" value={slot.end_time} onChange={(e) => updateSlot(idx, "end_time", e.target.value)} className="input-base !w-auto text-sm" />
                      <button onClick={() => removeSlot(idx)} className="text-destructive hover:bg-destructive/10 p-1.5 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={saveAll} disabled={saving}
        className="btn-primary w-full flex items-center justify-center gap-2">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {saving ? t("saving") : t("save_schedule")}
      </motion.button>
    </div>
  );
};

export default TeacherAvailabilityManager;
