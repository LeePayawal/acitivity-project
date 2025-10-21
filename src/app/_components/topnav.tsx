import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-800/50 bg-gradient-to-r from-black via-gray-900 to-slate-800 p-4 text-lg font-medium shadow-lg">
      {/* Logo */}
      <div className="bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent font-extrabold tracking-wide text-xl">
        ℝ𝔼𝔸𝕃𝕃
      </div>

      {/* Auth Section */}
      <div>
        {/* Show only when signed out */}
        <SignedOut>
          <SignInButton>
            <button className="px-4 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-semibold shadow-lg hover:scale-105 transition border border-gray-600">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        {/* Show only when signed in */}
        <SignedIn>
          <div className="flex items-center space-x-6 text-gray-300">
            <Link href="/home" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/keys" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Docs
            </Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}