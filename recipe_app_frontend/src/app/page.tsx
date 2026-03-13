"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import RecipeCard from "@/components/RecipeCard";
import { listRecipes, type RecipeOut } from "@/lib/api";

type LoadState =
  | { kind: "idle" | "loading" }
  | { kind: "loaded"; recipes: RecipeOut[] }
  | { kind: "error"; message: string };

export default function Home() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [state, setState] = useState<LoadState>({ kind: "idle" });

  const params = useMemo(
    () => ({
      q: q.trim() || undefined,
      category: category.trim() || undefined,
      tag: tag.trim() || undefined,
      limit: 24,
      offset: 0,
    }),
    [q, category, tag]
  );

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setState({ kind: "loading" });
      try {
        const recipes = await listRecipes(params);
        if (cancelled) return;
        setState({ kind: "loaded", recipes });
      } catch (e) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <AppShell title="Browse recipes">
      <section className="panel">
        <form
          className="search-form"
          onSubmit={(ev) => {
            ev.preventDefault();
            // state is already reactive via inputs; prevent full page reload.
          }}
        >
          <div className="field">
            <label className="label" htmlFor="q">
              Search
            </label>
            <input
              id="q"
              className="input"
              placeholder="title or description…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="category">
              Category
            </label>
            <input
              id="category"
              className="input"
              placeholder="e.g. Dinner"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="field">
            <label className="label" htmlFor="tag">
              Tag
            </label>
            <input
              id="tag"
              className="input"
              placeholder="e.g. spicy"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setQ("");
                setCategory("");
                setTag("");
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      {state.kind === "loading" ? (
        <section className="status card" aria-live="polite">
          <p className="mono">Loading recipes…</p>
        </section>
      ) : null}

      {state.kind === "error" ? (
        <section className="status card" role="alert">
          <h2 className="card-title">Couldn’t load recipes</h2>
          <p className="muted">{state.message}</p>
          <p className="muted">
            Check <code className="inline-code">NEXT_PUBLIC_API_BASE_URL</code> and backend CORS.
          </p>
        </section>
      ) : null}

      {state.kind === "loaded" ? (
        state.recipes.length ? (
          <section className="grid" aria-label="Recipe results">
            {state.recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </section>
        ) : (
          <section className="status card" aria-live="polite">
            <h2 className="card-title">No matches</h2>
            <p className="muted">Try a different search, category, or tag.</p>
          </section>
        )
      ) : null}
    </AppShell>
  );
}
