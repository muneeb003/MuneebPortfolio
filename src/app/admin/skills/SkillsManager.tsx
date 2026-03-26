"use client";

import { useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { SkillCategory, Skill } from "@/types";

interface Props {
  initialCategories: (SkillCategory & { skills: Skill[] })[];
}

export function SkillsManager({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [newCatName, setNewCatName] = useState("");
  const [addingSkillCat, setAddingSkillCat] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", icon_slug: "", proficiency: 3, color: "" });

  const sensors = useSensors(useSensor(PointerSensor));

  async function addCategory() {
    if (!newCatName.trim()) return;
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "category", name: newCatName.trim(), order: categories.length }),
    });
    const cat = await res.json();
    setCategories((prev) => [...prev, { ...cat, skills: [] }]);
    setNewCatName("");
  }

  async function deleteCategory(id: string) {
    await fetch(`/api/skills/${id}?type=category`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function addSkill(categoryId: string) {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSkill, category_id: categoryId, order: 0 }),
    });
    const skill = await res.json();
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, skills: [...c.skills, skill] } : c
      )
    );
    setNewSkill({ name: "", icon_slug: "", proficiency: 3, color: "" });
    setAddingSkillCat(null);
  }

  async function deleteSkill(categoryId: string, skillId: string) {
    await fetch(`/api/skills/${skillId}`, { method: "DELETE" });
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, skills: c.skills.filter((s) => s.id !== skillId) } : c
      )
    );
  }

  async function handleDragEnd(event: DragEndEvent, categoryId: string) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const cat = categories.find((c) => c.id === categoryId)!;
    const oldIndex = cat.skills.findIndex((s) => s.id === active.id);
    const newIndex = cat.skills.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(cat.skills, oldIndex, newIndex);

    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, skills: reordered } : c))
    );

    await fetch("/api/skills/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map((s, i) => ({ id: s.id, order: i })) }),
    });
  }

  return (
    <div className="space-y-6">
      {categories.map((cat) => (
        <div key={cat.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-100">{cat.name}</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setAddingSkillCat(cat.id)}>Add skill</Button>
              <Button size="sm" variant="danger" onClick={() => deleteCategory(cat.id)}>Delete category</Button>
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, cat.id)}>
            <SortableContext items={cat.skills.map((s) => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {cat.skills.map((skill) => (
                  <SortableSkillRow
                    key={skill.id}
                    skill={skill}
                    onDelete={() => deleteSkill(cat.id, skill.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {addingSkillCat === cat.id && (
            <div className="mt-3 border-t border-zinc-700 pt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Skill name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  placeholder="Icon slug (devicons)"
                  value={newSkill.icon_slug}
                  onChange={(e) => setNewSkill((p) => ({ ...p, icon_slug: e.target.value }))}
                />
                <Input
                  placeholder="Color hex"
                  value={newSkill.color}
                  onChange={(e) => setNewSkill((p) => ({ ...p, color: e.target.value }))}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Proficiency:</span>
                  {[1,2,3,4,5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`w-6 h-6 rounded text-xs font-bold ${newSkill.proficiency >= n ? "bg-indigo-600 text-white" : "bg-zinc-700 text-zinc-400"}`}
                      onClick={() => setNewSkill((p) => ({ ...p, proficiency: n }))}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => addSkill(cat.id)}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingSkillCat(null)}>Cancel</Button>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCategory()}
        />
        <Button onClick={addCategory}>Add category</Button>
      </div>
    </div>
  );
}

function SortableSkillRow({ skill, onDelete }: { skill: Skill; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
    >
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-zinc-400">
        ⣿
      </button>
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: skill.color || "#6366f1" }}
      />
      <span className="flex-1 text-sm text-zinc-200">{skill.name}</span>
      <span className="text-xs text-zinc-500">{skill.icon_slug}</span>
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((n) => (
          <span
            key={n}
            className={`w-2 h-2 rounded-sm ${n <= skill.proficiency ? "bg-indigo-500" : "bg-zinc-700"}`}
          />
        ))}
      </div>
      <Button size="sm" variant="danger" onClick={onDelete}>×</Button>
    </div>
  );
}
