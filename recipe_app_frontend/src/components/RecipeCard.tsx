import Link from "next/link";
import type { RecipeOut } from "@/lib/api";

type Props = {
  recipe: RecipeOut;
};

// PUBLIC_INTERFACE
export default function RecipeCard({ recipe }: Props) {
  /** Retro-styled recipe preview card linking to details page. */
  const tags = recipe.tags?.slice(0, 3) ?? [];
  return (
    <article className="card">
      <header className="card-header">
        <h2 className="card-title">
          <Link className="card-link" href={`/recipes/${recipe.id}`}>
            {recipe.title}
          </Link>
        </h2>
        <div className="card-meta">
          <span className="pill">♥ {recipe.favorites_count}</span>
          {recipe.category ? <span className="pill">{recipe.category}</span> : null}
        </div>
      </header>

      {recipe.description ? <p className="card-desc">{recipe.description}</p> : null}

      {tags.length ? (
        <ul className="tag-row" aria-label="Tags">
          {tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="card-footer">
        <span className="muted">
          By <strong>{recipe.author?.username ?? "Unknown"}</strong>
        </span>
        <Link className="btn btn-sm" href={`/recipes/${recipe.id}`}>
          View →
        </Link>
      </div>
    </article>
  );
}
