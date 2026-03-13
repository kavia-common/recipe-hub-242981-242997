import {useEffect, useState} from 'react';

import Layout from '../components/Layout';
import {apiFetch} from '../lib/api';
import {getToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function ShoppingListPage() {
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [error, setError] = useState('');

    async function load() {
        setError('');
        try {
            const token = getToken();
            const data = await apiFetch('/shopping-list', {token});
            setItems(data);
        } catch (e) {
            setError(e.message || 'Failed to load shopping list');
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function addItem(e) {
        e.preventDefault();
        const text = newItem.trim();
        if (!text) return;
        try {
            const token = getToken();
            await apiFetch('/shopping-list/add', {method: 'POST', token, body: {items: [text]}});
            setNewItem('');
            load();
        } catch (e) {
            setError(e.message || 'Failed to add item');
        }
    }

    async function toggle(item, isChecked) {
        try {
            const token = getToken();
            await apiFetch(`/shopping-list/${item.id}`, {method: 'PATCH', token, body: {is_checked: isChecked}});
            load();
        } catch (e) {
            setError(e.message || 'Failed to update item');
        }
    }

    async function remove(item) {
        try {
            const token = getToken();
            await apiFetch(`/shopping-list/${item.id}`, {method: 'DELETE', token});
            load();
        } catch (e) {
            setError(e.message || 'Failed to delete item');
        }
    }

    return (
        <Layout
            searchValue={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
        >
            <h1 className="text-xl font-semibold text-text">Shopping List</h1>
            <p className="mt-1 text-sm text-muted">Add items manually or from recipes.</p>

            {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-white p-6 text-sm text-red-600">{error}</div>
            ) : null}

            <form className="mt-4 flex gap-2" onSubmit={addItem}>
                <input
                    className="flex-1 rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add an item..."
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95" type="submit">
                    Add
                </button>
            </form>

            <div className="mt-4 rounded-lg border bg-surface">
                {items.length === 0 ? (
                    <div className="p-6 text-sm text-muted">No items yet.</div>
                ) : (
                    <ul className="divide-y">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between gap-3 p-4">
                                <label className="flex flex-1 items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={item.is_checked}
                                        onChange={(e) => toggle(item, e.target.checked)}
                                    />
                                    <span className={`text-sm ${item.is_checked ? 'text-muted line-through' : 'text-text'}`}>
                                        {item.text}
                                    </span>
                                </label>
                                <button className="text-sm text-red-600 hover:underline" onClick={() => remove(item)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
