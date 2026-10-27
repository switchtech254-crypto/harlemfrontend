
"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

type Category = {
  id: string;
  name: string;
  blurb: string;
  image_url: string;
  sort_order: number;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    const id = slugify(trimmedName);

    if (!id) {
      toast.error("Enter a category name.");
      return;
    }

    if (categories.some((category) => category.id === id)) {
      toast.error("That category already exists.");
      return;
    }

    setCategories((current) => [
      ...current,
      {
        id,
        name: trimmedName,
        blurb: "",
        image_url: "",
        sort_order: current.length + 1,
      },
    ]);

    setName("");
    toast.success("Category added locally. Connect the backend to save it permanently.");
  }

  function updateCategory(id: string, updates: Partial<Category>) {
    setCategories((current) =>
      current.map((category) =>
        category.id === id ? { ...category, ...updates } : category,
      ),
    );
  }

  function removeCategory(category: Category) {
    if (!window.confirm(`Delete ${category.name}?`)) return;

    setCategories((current) =>
      current
        .filter((item) => item.id !== category.id)
        .map((item, index) => ({ ...item, sort_order: index + 1 })),
    );

    toast.success("Category removed from this page.");
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold uppercase">
        Categories
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Manage store categories, descriptions, images, and display order.
      </p>

      <form
        onSubmit={addCategory}
        className="mt-5 flex max-w-md gap-2"
      >
        <Input
          className="bg-card"
          placeholder="New category name"
          maxLength={60}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit">
          <Plus className="mr-1 h-4 w-4" />
          Add
        </Button>
      </form>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onChange={(updates) => updateCategory(category.id, updates)}
            onDelete={() => removeCategory(category)}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="mt-6 border bg-card p-6 text-sm text-muted-foreground">
          No categories have been added in this session. Use the field above
          to add one. Categories will need a backend connection to persist
          across page refreshes.
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  category,
  onChange,
  onDelete,
}: {
  category: Category;
  onChange: (updates: Partial<Category>) => void;
  onDelete: () => void;
}) {
  const [busy, setBusy] = useState(false);

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    onChange({ image_url: imageUrl });
    toast.info("Image preview updated locally. Uploading requires a backend.");
  }

  function save() {
    setBusy(true);

    // UI-only for now: no database request is made.
    window.setTimeout(() => {
      setBusy(false);
      toast.info("Changes are only held in this session. Backend saving is not connected.");
    }, 0);
  }

  return (
    <div className="flex gap-4 border bg-card p-4">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-secondary text-center text-xs text-muted-foreground">
        {category.image_url ? (
          // A local object URL is used for selected images until uploads are implemented.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image_url}
            alt={`${category.name} preview`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-2">No image</span>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        <div className="grid grid-cols-[1fr_70px] gap-2">
          <div>
            <Label className="text-xs">Name</Label>
            <Input
              value={category.name}
              maxLength={60}
              onChange={(event) =>
                onChange({ name: event.target.value })
              }
            />
          </div>

          <div>
            <Label className="text-xs">Order</Label>
            <Input
              type="number"
              min={1}
              value={category.sort_order}
              onChange={(event) =>
                onChange({ sort_order: Number(event.target.value) })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Short description</Label>
          <Input
            value={category.blurb}
            maxLength={160}
            onChange={(event) =>
              onChange({ blurb: event.target.value })
            }
          />
        </div>

        <Input
          type="file"
          accept="image/*"
          aria-label={`Photo for ${category.name}`}
          onChange={handleImage}
        />

        <div className="flex justify-between">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onDelete}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={busy}
            onClick={save}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
