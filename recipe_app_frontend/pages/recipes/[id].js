import Link from 'next/link';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import {apiFetch} from '../../lib/api';
import {getToken} from '../../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function RecipeDetailPage() {
    const router = useRouter();
    const {id} = router.query;

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const data = await apiFetch(`/recipes/${id}`);
                setRecipe(data);
            } catch (e) {
                setError(e.message || 'Failed to load recipe');
            }
        }
        load();
    }, [id]);

    async function favorite() {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await apiFetch(`/favorites/${id}`, {method: 'POST', token});
        } catch (e) {
            setError(e.message || 'Failed to favorite');
        } finally {
            setBusy(false);
        }
    }

    async function addToShoppingList() {
        const token = getToken();
        if (!token) {
            router.push('/login');
            return;
        }
        setBusy(true);
        setError('');
        try {
            await apiFetch(`/shopping-list/from-recipe/${id}`, {method: 'POST', token});
            router.push('/shopping-list');
        } catch (e) {
            setError(e.message || 'Failed to add to shopping list');
        } finally {
            setBusy(false);
        }
    }

    return (
        <Layout
            searchValue={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
        >
            <div className="mb-4">
                <Link href="/" className="text-sm text-primary hover:underline">
                    ← Back
                </Link>
            </div>

            {error ? (
                <div className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : !recipe ? (
                <div className="rounded-lg border bg-surface p-6 text-sm text-muted">Loading…</div>
            ) : (
                <div className="overflow-hidden rounded-lg border bg-surface">
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-gray-50">
                        {recipe.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={recipe.image_url}
                                alt={recipe.title}
                                className="h-full w-full object-cover"
                            />
                        ) : null}
                    </div>

                    <div className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-text">{recipe.title}</h1>
                                <p className="mt-1 text-sm text-muted">{recipe.description || '—'}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {(recipe.categories || []).map((c) => (
                                        <span key={c.id} className="rounded-md bg-gray-100 px-2 py-1 text-xs text-muted">
                                            {c.name}
                                        </span>
                                    ))}
                                    {(recipe.tags || []).map((t) => (
                                        <span key={t.id} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-text">
                                            {t.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-3 text-sm text-muted">
                                    By <span className="text-text">{recipe.author.display_name}</span> •{' '}
                                    {recipe.prep_minutes + recipe.cook_minutes}m • Serves {recipe.servings || '—'}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
                                    onClick={favorite}
                                    disabled={busy}
                                >
                                    Favorite
                                </button>
                                <button
                                    className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                                    onClick={addToShoppingList}
                                    disabled={busy}
                                >
                                    Add to shopping list
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                            <section className="rounded-lg border bg-white p-4">
                                <h2 className="text-sm font-semibold text-text">Ingredients</h2>
                                <pre className="mt-3 whitespace-pre-wrap text-sm text-muted">
                                    {recipe.ingredients}
                                </pre>
                            </section>

                            <section className="rounded-lg border bg-white p-4">
                                <h2 className="text-sm font-semibold text-text">Instructions</h2>
                                <pre className="mt-3 whitespace-pre-wrap text-sm text-muted">
                                    {recipe.instructions}
                                </pre>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
