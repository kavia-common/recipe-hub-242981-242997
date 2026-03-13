import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import RecipeCard from '../components/RecipeCard';
import {apiFetch} from '../lib/api';
import {getToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function FavoritesPage() {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [items, setItems] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            setError('');
            try {
                const token = getToken();
                const data = await apiFetch('/favorites', {token});
                setItems(data);
            } catch (e) {
                setError(e.message || 'Failed to load favorites');
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
            <h1 className="text-xl font-semibold text-text">Favorites</h1>
            <p className="mt-1 text-sm text-muted">Your saved recipes.</p>

            {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((f) => (
                    <RecipeCard key={f.id} recipe={f.recipe} />
                ))}
            </div>
        </Layout>
    );
}
