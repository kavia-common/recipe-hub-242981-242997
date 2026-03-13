import Link from 'next/link';
import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import {apiFetch} from '../lib/api';
import {getToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function MyRecipesPage() {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            setError('');
            try {
                const token = getToken();
                const data = await apiFetch('/recipes/mine/list', {token});
                setRecipes(data);
            } catch (e) {
                setError(e.message || 'Failed to load your recipes');
            }
        }
        load();
    }, []);

    return (
        <Layout
            searchValue={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-text">My Recipes</h1>
                    <p className="mt-1 text-sm text-muted">Create and edit your personal recipes.</p>
                </div>
                <Link
                    href="/recipe-editor"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95"
                >
                    New Recipe
                </Link>
            </div>

            {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recipes.map((r) => (
                    <RecipeCard key={r.id} recipe={r} />
                ))}
            </div>
        </Layout>
    );
}
