import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import {apiFetch} from '../lib/api';
import {getToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function AdminPage() {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState('');

    async function load() {
        setError('');
        try {
            const token = getToken();
            const data = await apiFetch('/admin/flagged', {token});
            setRecipes(data);
        } catch (e) {
            setError(e.message || 'Failed to load admin data');
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function unflag(id) {
        try {
            const token = getToken();
            await apiFetch(`/admin/unflag/${id}`, {method: 'POST', token});
            load();
        } catch (e) {
            setError(e.message || 'Failed to unflag');
        }
    }

    return (
        <Layout
            searchValue={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
        >
            <h1 className="text-xl font-semibold text-text">Admin / Moderation</h1>
            <p className="mt-1 text-sm text-muted">Review flagged recipes.</p>

            {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : null}

            <div className="mt-4 space-y-3">
                {recipes.map((r) => (
                    <div key={r.id} className="rounded-lg border bg-surface p-4">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="text-sm font-semibold text-text">{r.title}</div>
                                <div className="mt-1 text-sm text-muted">By {r.author.display_name}</div>
                            </div>
                            <button
                                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                                onClick={() => unflag(r.id)}
                            >
                                Unflag
                            </button>
                        </div>
                    </div>
                ))}
                {recipes.length === 0 ? (
                    <div className="rounded-lg border bg-surface p-6 text-sm text-muted">No flagged recipes.</div>
                ) : null}
            </div>
        </Layout>
    );
}
