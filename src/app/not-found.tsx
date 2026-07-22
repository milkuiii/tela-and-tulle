import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto my-20 bg-[#1C191E] border border-[#2E2A32] rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl">
      <h2 className="font-sans text-3xl font-bold text-rose-100">
        404 - Page Not Found
      </h2>
      <p className="text-xs text-neutral-400">
        The requested page does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-rose-900 hover:bg-rose-800 text-rose-100 px-4 py-2 rounded-xl text-xs font-semibold transition"
      >
        Return to Home Catalog
      </Link>
    </div>
  );
}
