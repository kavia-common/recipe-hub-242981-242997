import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import {apiFetch} from '../lib/api';

/**
 * @return {JSX.Element}
 */
export default function HomePage() {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError('');
            try {
                const params = new URLSearchParams();
                if (search.trim()) params.set('q', search.trim());
                if (categoryId !== null) params.set('category_id', String(categoryId));
                const data = await apiFetch(`/recipes?${params.toString()}`);
                setRecipes(data);
            } catch (e) {
                setError(e.message || 'Failed to load recipes');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [search, categoryId]);

    return (
        <Layout
            searchValue={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
        >
            <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-text">Browse Recipes</h1>
                    <p className="text-sm text-muted">Search, filter, and discover new favorites.</p>
                </div>
            </div>

            {loading ? (
                <div className="rounded-lg border bg-surface p-6 text-sm text-muted">Loading…</div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : recipes.length === 0 ? (
                <div className="rounded-lg border bg-surface p-6 text-sm text-muted">No recipes found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                    ))}
                </div>
            )}
        </Layout>
    );
}
