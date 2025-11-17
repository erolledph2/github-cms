import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>GitHub CMS</h1>
      <p>Welcome to your GitHub-based Content Management System</p>
      <Link href="/login">Login</Link>
    </div>
  );
}
