import Link from 'next/link';

/**
 * @param {{recipe: any}} props
 * @return {JSX.Element}
 */
export default function RecipeCard(props) {
    const r = props.recipe;
    return (
        <Link
            href={`/recipes/${r.id}`}
            className="group block overflow-hidden rounded-lg border bg-surface hover:border-primary/40"
        >
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-gray-50">
                {r.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={r.image_url}
                        alt={r.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
                        No image
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-semibold text-text group-hover:text-primary">
                        {r.title}
                    </h3>
                    <span className="rounded-full bg-accent/10 px-2 py-1 text-xs text-text">
                        {r.prep_minutes + r.cook_minutes}m
                    </span>
                </div>
                <p className="line-clamp-2 text-sm text-muted">{r.description || '—'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                    {(r.categories || []).slice(0, 2).map((c) => (
                        <span key={c.id} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-muted">
                            {c.name}
                        </span>
                    ))}
                    {(r.tags || []).slice(0, 2).map((t) => (
                        <span key={t.id} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-text">
                            {t.name}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
