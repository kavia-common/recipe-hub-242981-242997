import Link from 'next/link';
import {useRouter} from 'next/router';
import {useState} from 'react';

import Layout from '../components/Layout';
import {apiFetch} from '../lib/api';
import {setToken} from '../lib/auth';

/**
 * @return {JSX.Element}
 */
export default function LoginPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function submit(e) {
        e.preventDefault();
        setBusy(true);
        setError('');
        try {
            const data = await apiFetch('/auth/login', {method: 'POST', body: {email, password}});
            setToken(data.access_token);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Login failed');
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
                <h1 className="text-xl font-semibold text-text">Login</h1>
                <p className="mt-1 text-sm text-muted">Welcome back.</p>

                {error ? (
                    <div className="mt-4 rounded-md border border-red-200 bg-white p-3 text-sm text-red-600">{error}</div>
                ) : null}

                <form className="mt-4 space-y-3" onSubmit={submit}>
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
                        />
                    </div>
                    <button
                        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
                        disabled={busy}
                        type="submit"
                    >
                        Login
                    </button>
                </form>

                <div className="mt-4 text-sm text-muted">
                    No account?{' '}
                    <Link href="/register" className="text-primary hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
