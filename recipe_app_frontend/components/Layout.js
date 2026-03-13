import Link from 'next/link';
import {useEffect, useState} from 'react';

import {apiFetch} from '../lib/api';
import {clearToken, getToken} from '../lib/auth';

/**
 * @param {{
 *   children: any,
 *   searchValue: string,
 *   onSearchChange: function(string): void,
 *   categoryId: (number|null),
 *   onCategoryChange: function(number|null): void
 * }} props
 * @return {JSX.Element}
 */
export default function Layout(props) {
    const [categories, setCategories] = useState([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function load() {
            const cats = await apiFetch('/meta/categories');
            setCategories(cats);
        }
        load();
    }, []);

    useEffect(() => {
        async function loadMe() {
            const token = getToken();
            if (!token) {
                setUser(null);
                return;
            }
            try {
                const me = await apiFetch('/auth/me', {token});
                setUser(me);
            } catch (e) {
                clearToken();
                setUser(null);
            }
        }
        loadMe();
    }, []);

    function logout() {
        clearToken();
        setUser(null);
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-20 border-b bg-surface/90 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <Link href="/" className="text-lg font-semibold text-text">
                        Recipe Hub
                    </Link>

                    <div className="flex-1">
                        <input
                            aria-label="Search recipes"
                            className="w-full rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                            placeholder="Search recipes..."
                            value={props.searchValue}
                            onChange={(e) => props.onSearchChange(e.target.value)}
                        />
                    </div>

                    <nav className="hidden items-center gap-3 md:flex">
                        <Link href="/favorites" className="text-sm text-muted hover:text-text">
                            Favorites
                        </Link>
                        <Link href="/shopping-list" className="text-sm text-muted hover:text-text">
                            Shopping List
                        </Link>
                        {user ? (
                            <>
                                <Link href="/my-recipes" className="text-sm text-muted hover:text-text">
                                    My Recipes
                                </Link>
                                {user.is_admin ? (
                                    <Link href="/admin" className="text-sm text-muted hover:text-text">
                                        Admin
                                    </Link>
                                ) : null}
                                <button
                                    className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    <button
                        className="rounded-md border px-3 py-2 text-sm md:hidden"
                        onClick={() => setMobileFiltersOpen((v) => !v)}
                        aria-label="Toggle filters"
                    >
                        Filters
                    </button>
                </div>
            </header>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
                <aside className={`md:block ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
                    <div className="rounded-lg border bg-surface p-4">
                        <div className="mb-3 text-sm font-semibold text-text">Categories</div>
                        <button
                            className={`mb-2 w-full rounded-md px-3 py-2 text-left text-sm ${
                                props.categoryId === null ? 'bg-primary/10 text-text' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => props.onCategoryChange(null)}
                        >
                            All
                        </button>
                        <div className="space-y-1">
                            {categories.map((c) => (
                                <button
                                    key={c.id}
                                    className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                                        props.categoryId === c.id ? 'bg-primary/10 text-text' : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => props.onCategoryChange(c.id)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>{props.children}</main>
            </div>
        </div>
    );
}
