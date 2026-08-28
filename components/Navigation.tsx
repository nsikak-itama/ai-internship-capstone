import Link from "next/link";

export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <Link href="/">Home</Link>
      <Link href="/settings">Settings</Link>
      <Link href="/health">Health</Link>
    </nav>
  );
}