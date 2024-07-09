import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-foreground">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-lg mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-[hsl(var(--primary))]/80 transition duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
