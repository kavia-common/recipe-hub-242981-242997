import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState} from 'react';

import Layout from '../components/Layout';
import {apiFetch} from '../lib/api';

/**
 * @return {JSX.Element}
 */
export default function RegisterPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: {email, password, display_name: displayName}
            });
            router.push('/login');
        } catch (err) {
            setError(err.message || 'Registration failed');
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
            <div className="mx-auto max-w-md rounded-lg border bg-surface p-6">
                <h1 className="text-xl font-semibold text-text">Create account</h1>
                <p className="mt-1 text-sm text-muted">Save favorites and build shopping lists.</p>

                {error ? (
                    <div className="mt-4 rounded-md border border-red-200 bg-white p-3 text-sm text-red-600">{error}</div>
                ) : null}

                <form className="mt-4 space-y-3" onSubmit={submit}>
                    <div>
                        <label className="text-sm text-muted">Display name</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted">Email</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm text-muted">Password</label>
                        <input
                            className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                        disabled={busy}
                        type="submit"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-4 text-sm text-muted">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
