import { SlidersHorizontal } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type CategoriesProps = {
  categories: Category[];
  selectedCategory: string;
  onChange: (category: string) => void;
};

const Categories = ({
  categories,
  selectedCategory,
  onChange,
}: CategoriesProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4" />
        <h3 className="font-semibold">Categories</h3>
      </div>

      <div className="space-y-2">
        {/* All category */}
        <button
          onClick={() => onChange("all")}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
            selectedCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          All
        </button>

        {/* Dynamic categories */}
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onChange(category.name)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
              selectedCategory === category.name
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
