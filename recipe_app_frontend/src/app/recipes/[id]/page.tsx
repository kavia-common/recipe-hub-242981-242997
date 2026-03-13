"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { getRecipe, type RecipeOut } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "loaded"; recipe: RecipeOut }
  | { kind: "error"; message: string };

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function RecipeDetailPage({ params }: Props) {
  const [id, setId] = useState<number | null>(null);
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await params;
      const n = Number(p.id);
      if (!Number.isFinite(n) || n <= 0) {
        setId(null);
        setState({ kind: "error", message: "Invalid recipe id." });
        return;
      }
      setId(n);

      setState({ kind: "loading" });
      try {
        const recipe = await getRecipe(n);
        if (cancelled) return;
        setState({ kind: "loaded", recipe });
      } catch (e) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: e instanceof Error ? e.message : "Unknown error",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params]);

  const title = useMemo(() => {
    if (state.kind === "loaded") return state.recipe.title;
    if (state.kind === "error") return "Recipe";
    return "Loading…";
  }, [state]);

  return (
    <AppShell title={title}>
      <div className="detail-top">
        <Link className="btn btn-sm" href="/">
          ← Back
        </Link>

        {state.kind === "loaded" ? (
          <div className="detail-meta">
            <span className="pill">♥ {state.recipe.favorites_count}</span>
            {state.recipe.category ? <span className="pill">{state.recipe.category}</span> : null}
            <span className="pill">By {state.recipe.author?.username ?? "Unknown"}</span>
          </div>
        ) : null}
      </div>

      {state.kind === "loading" ? (
        <section className="card">
          <p className="mono">Loading recipe…</p>
        </section>
      ) : null}

      {state.kind === "error" ? (
        <section className="card" role="alert">
          <h2 className="card-title">Couldn’t load recipe</h2>
          <p className="muted">{state.message}</p>
          {id ? (
            <p className="muted">
              Tried: <code className="inline-code">/recipes/{id}</code>
            </p>
          ) : null}
        </section>
      ) : null}

      {state.kind === "loaded" ? (
        <div className="detail-grid">
          {state.recipe.description ? (
            <section className="card">
              <h2 className="card-title">Description</h2>
              <p className="card-desc">{state.recipe.description}</p>
            </section>
          ) : null}

          <section className="card">
            <h2 className="card-title">Ingredients</h2>
            <ul className="list">
              {splitLines(state.recipe.ingredients).map((line, idx) => (
                <li key={`${idx}-${line}`}>{line}</li>
              ))}
            </ul>
          </section>

          <section className="card">
            <h2 className="card-title">Instructions</h2>
            <ol className="list ordered">
              {splitLines(state.recipe.instructions).map((line, idx) => (
                <li key={`${idx}-${line}`}>{line}</li>
              ))}
            </ol>
          </section>

          {state.recipe.tags?.length ? (
            <section className="card">
              <h2 className="card-title">Tags</h2>
              <ul className="tag-row" aria-label="Tags">
                {state.recipe.tags.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </AppShell>
  );
}
