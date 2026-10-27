
"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Switch } from "@/app/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

type ProductRow = {
  id: string;
  name: string;
  price: number;
  category_id: string;
  image_url: string;
  description: string;
  sizes: string[];
  active: boolean;
  sort_order: number;
};

const emptyProduct: ProductRow = {
  id: "",
  name: "",
  price: 0,
  category_id: "",
  image_url: "",
  description: "",
  sizes: [],
  active: true,
  sort_order: 0,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [editing, setEditing] = useState<{
    row: ProductRow;
    isNew: boolean;
  } | null>(null);
  const [filter, setFilter] = useState("");

  const list = products
    .filter(
      (product) =>
        !filter ||
        `${product.name} ${product.category_id}`
          .toLowerCase()
          .includes(filter.toLowerCase()),
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  function openNewProduct() {
    setEditing({
      row: {
        ...emptyProduct,
        sort_order: products.length + 1,
      },
      isNew: true,
    });
  }

  function saveProduct(row: ProductRow, isNew: boolean) {
    if (isNew) {
      if (products.some((product) => product.id === row.id)) {
        toast.error("A product with this name already exists.");
        return false;
      }

      setProducts((current) => [...current, row]);
      toast.info("Product added locally. Backend saving is not connected.");
    } else {
      setProducts((current) =>
        current.map((product) => (product.id === row.id ? row : product)),
      );
      toast.info("Product updated locally. Backend saving is not connected.");
    }

    setEditing(null);
    return true;
  }

  function removeProduct(product: ProductRow) {
    if (!window.confirm(`Delete ${product.name}?`)) return;

    setProducts((current) =>
      current
        .filter((item) => item.id !== product.id)
        .map((item, index) => ({ ...item, sort_order: index + 1 })),
    );

    toast.info("Product removed from this session.");
  }

  function toggleVisibility(product: ProductRow, active: boolean) {
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? { ...item, active } : item,
      ),
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold uppercase">
          Products &amp; prices
        </h1>

        <Button type="button" onClick={openNewProduct}>
          <Plus className="mr-1 h-4 w-4" />
          Add product
        </Button>
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        Manage product details, prices, images, and shop visibility.
      </p>

      <Input
        className="mt-5 max-w-sm bg-card"
        placeholder="Search products…"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />

      <div className="mt-4 overflow-x-auto border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Visible</th>
              <th className="p-3" />
            </tr>
          </thead>

          <tbody className="divide-y">
            {list.map((product) => (
              <tr key={product.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-secondary text-xs text-muted-foreground">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "No image"
                      )}
                    </div>

                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sizes.length
                          ? `Sizes ${product.sizes.join(", ")}`
                          : "One size"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3">{product.category_id || "—"}</td>

                <td className="p-3 font-semibold">
                  {formatPrice(product.price)}
                </td>

                <td className="p-3">
                  <Switch
                    checked={product.active}
                    onCheckedChange={(checked) =>
                      toggleVisibility(product, checked)
                    }
                    aria-label={`Show ${product.name} in shop`}
                  />
                </td>

                <td className="whitespace-nowrap p-3 text-right">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${product.name}`}
                    onClick={() =>
                      setEditing({ row: product, isNew: false })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Delete ${product.name}`}
                    onClick={() => removeProduct(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-muted-foreground"
                >
                  {filter
                    ? "No products match your search."
                    : "No products added yet. Select Add product to create one."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductForm
          key={editing.row.id || "new"}
          initial={editing.row}
          isNew={editing.isNew}
          onClose={() => setEditing(null)}
          onSave={saveProduct}
        />
      )}
    </div>
  );
}

function ProductForm({
  initial,
  isNew,
  onClose,
  onSave,
}: {
  initial: ProductRow;
  isNew: boolean;
  onClose: () => void;
  onSave: (row: ProductRow, isNew: boolean) => boolean;
}) {
  const [row, setRow] = useState(initial);
  const [sizes, setSizes] = useState(initial.sizes.join(", "));
  const [categoryName, setCategoryName] = useState(
    initial.category_id.replace(/-/g, " "),
  );
  const [busy, setBusy] = useState(false);

  function setField<K extends keyof ProductRow>(
    key: K,
    value: ProductRow[K],
  ) {
    setRow((current) => ({ ...current, [key]: value }));
  }

  function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    setField("image_url", URL.createObjectURL(file));
    toast.info("Image preview selected. Permanent uploads need the backend.");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!row.name.trim() || !categoryName.trim()) {
      toast.error("Product name and category are required.");
      return;
    }

    if (!Number.isFinite(row.price) || row.price < 0) {
      toast.error("Enter a valid price.");
      return;
    }

    const id = isNew ? slugify(row.name) : row.id;

    if (!id) {
      toast.error("Enter a product name that can be used as an ID.");
      return;
    }

    const payload: ProductRow = {
      ...row,
      id,
      name: row.name.trim(),
      category_id: slugify(categoryName),
      sizes: sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
    };

    setBusy(true);

    try {
      onSave(payload, isNew);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Add product" : `Edit ${initial.name}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              required
              maxLength={120}
              value={row.name}
              onChange={(event) => setField("name", event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="p-price">Price (KSh)</Label>
              <Input
                id="p-price"
                type="number"
                min={0}
                step={1}
                required
                value={row.price}
                onChange={(event) =>
                  setField("price", Number(event.target.value))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="p-category">Category</Label>
              <Input
                id="p-category"
                required
                maxLength={60}
                placeholder="e.g. Jerseys"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-sizes">
              Sizes (comma separated, leave empty for one size)
            </Label>
            <Input
              id="p-sizes"
              value={sizes}
              onChange={(event) => setSizes(event.target.value)}
              placeholder="S, M, L, XL"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              maxLength={1000}
              value={row.description}
              onChange={(event) =>
                setField("description", event.target.value)
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-img">Photo</Label>

            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-secondary text-xs text-muted-foreground">
                {row.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={row.image_url}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "No image"
                )}
              </div>

              <Input
                id="p-img"
                type="file"
                accept="image/*"
                onChange={handleImage}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="p-active"
              checked={row.active}
              onCheckedChange={(checked) => setField("active", checked)}
            />
            <Label htmlFor="p-active">Show in shop</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
