import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Add product</h1>
      <p className="mt-2 text-stone-600">Create a new shop item.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
