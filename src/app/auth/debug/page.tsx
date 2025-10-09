// src/app/auth/debug/page.tsx

const AuthDebugPage = () => {
  const isServer = typeof window === 'undefined';

  if (!isServer) {
    return <p>This page must be rendered on the server.</p>;
  }

  const checkEnvVar = (name: string) => {
    const value = process.env[name];
    if (value && value.length > 0) {
      return <span style={{ color: 'lime' }}>SET</span>;
    }
    return <span style={{ color: 'red' }}>MISSING</span>;
  };

  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const requiredNextAuthUrl = 'https://faithbliss.vercel.app';
  const isUrlCorrect = nextAuthUrl === requiredNextAuthUrl;

  return (
    <div style={{ fontFamily: 'monospace', color: 'white', backgroundColor: 'black', padding: '2rem' }}>
      <h1>Authentication Environment Debug</h1>
      <p>This page shows the status of critical server-side environment variables on Vercel.</p>
      <hr />
      <ul>
        <li>
          <code>NEXTAUTH_URL</code>: {checkEnvVar('NEXTAUTH_URL')}
          {nextAuthUrl && (
            <>
              <br />
              -&gt; Value: <code>{nextAuthUrl}</code>
              <br />
              -&gt; Correct: {isUrlCorrect ? <span style={{ color: 'lime' }}>YES</span> : <span style={{ color: 'red' }}>NO - Should be <code>{requiredNextAuthUrl}</code></span>}
            </>
          )}
        </li>
        <li><code>NEXTAUTH_SECRET</code>: {checkEnvVar('NEXTAUTH_SECRET')}</li>
        <li><code>GOOGLE_CLIENT_ID</code>: {checkEnvVar('GOOGLE_CLIENT_ID')}</li>
        <li><code>GOOGLE_CLIENT_SECRET</code>: {checkEnvVar('GOOGLE_CLIENT_SECRET')}</li>
        <li><code>NEXT_PUBLIC_BACKEND_URL</code>: {checkEnvVar('NEXT_PUBLIC_BACKEND_URL')}</li>
      </ul>
      <hr />
      <h2>Next Steps:</h2>
      <ol>
        <li>If any variable is <span style={{ color: 'red' }}>MISSING</span>, you must add it in your Vercel Project Settings.</li>
        <li>If <code>NEXTAUTH_URL</code> is incorrect, you must fix it in Vercel.</li>
        <li>If all variables are <span style={{ color: 'lime' }}>SET</span> and correct, the only remaining possibility is the <strong>Authorized redirect URI</strong> in your Google Cloud Console.</li>
      </ol>
      <p>
        Please double-check that this exact value is present in your Google credentials:
        <br />
        <code style={{ backgroundColor: '#333', padding: '0.5rem', display: 'block', marginTop: '0.5rem' }}>
          https://faithbliss.vercel.app/api/auth/callback/google
        </code>
      </p>
    </div>
  );
};

export default AuthDebugPage;
