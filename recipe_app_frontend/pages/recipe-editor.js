import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import {apiFetch} from '../lib/api';
import {getToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function RecipeEditorPage() {
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [categories, setCategories] = useState([]);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [prepMinutes, setPrepMinutes] = useState(10);
    const [cookMinutes, setCookMinutes] = useState(20);
    const [servings, setServings] = useState(2);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
    const [tagNames, setTagNames] = useState('');

    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            const cats = await apiFetch('/meta/categories');
            setCategories(cats);
        }
        load();
    }, []);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            const token = getToken();
            const tags = tagNames
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);

            await apiFetch('/recipes', {
                method: 'POST',
                token,
                body: {
                    title,
                    description,
                    ingredients,
                    instructions,
                    prep_minutes: Number(prepMinutes) || 0,
                    cook_minutes: Number(cookMinutes) || 0,
                    servings: Number(servings) || 0,
                    is_public: true,
                    category_ids: selectedCategoryIds,
                    tag_names: tags
                }
            });
            router.push('/my-recipes');
        } catch (e2) {
            setError(e2.message || 'Failed to save recipe');
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
            <div className="mx-auto max-w-3xl rounded-lg border bg-surface p-6">
                <h1 className="text-xl font-semibold text-text">New Recipe</h1>
                <p className="mt-1 text-sm text-muted">Add your recipe details.</p>

                {error ? (
                    <div className="mt-4 rounded-md border border-red-200 bg-white p-3 text-sm text-red-600">{error}</div>
                ) : null}

                <form className="mt-4 space-y-4" onSubmit={submit}>
                    <div>
                        <label className="text-sm text-muted">Title</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted">Description</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                            <label className="text-sm text-muted">Prep (min)</label>
                            <input
                                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                                value={prepMinutes}
                                onChange={(e) => setPrepMinutes(e.target.value)}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted">Cook (min)</label>
                            <input
                                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                                value={cookMinutes}
                                onChange={(e) => setCookMinutes(e.target.value)}
                                type="number"
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-muted">Servings</label>
                            <input
                                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                                value={servings}
                                onChange={(e) => setServings(e.target.value)}
                                type="number"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-muted">Categories</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map((c) => {
                                const selected = selectedCategoryIds.includes(c.id);
                                return (
                                    <button
                                        key={c.id}
                                        type="button"
                                        className={`rounded-md border px-3 py-2 text-sm ${
                                            selected ? 'border-primary bg-primary/10 text-text' : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setSelectedCategoryIds((prev) => {
                                                if (prev.includes(c.id)) {
                                                    return prev.filter((x) => x !== c.id);
                                                }
                                                return prev.concat([c.id]);
                                            });
                                        }}
                                    >
                                        {c.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-muted">Tags (comma-separated)</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={tagNames}
                            onChange={(e) => setTagNames(e.target.value)}
                            placeholder="quick, easy, vegan"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted">Ingredients</label>
                        <textarea
                            className="mt-1 h-40 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={ingredients}
                            onChange={(e) => setIngredients(e.target.value)}
                            placeholder={"- 2 eggs\n- 1 cup flour\n- 1 tsp salt"}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm text-muted">Instructions</label>
                        <textarea
                            className="mt-1 h-48 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder={"1) Preheat oven...\n2) Mix ingredients...\n3) Bake..."}
                            required
                        />
                    </div>

                    <button
                        className="w-full rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                        disabled={busy}
                        type="submit"
                    >
                        Save Recipe
                    </button>
                </form>
            </div>
        </Layout>
    );
}
