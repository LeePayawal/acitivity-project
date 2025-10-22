import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function TopNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                <svg 
                  className="h-6 w-6 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 10V3L4 14h7v7l9-11h-7z" 
                  />
                </svg>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              REALL
            </span>
          </Link>

          {/* Auth Section */}
          <div>
            <SignedOut>
              <SignInButton>
                <button className="group relative overflow-hidden rounded-full px-6 py-2.5 font-semibold text-white transition-all hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <span className="relative flex items-center gap-2">
                    Sign In
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-6">
                  <Link 
                    href="/home" 
                    className="relative text-sm font-medium text-gray-300 transition-colors hover:text-white group"
                  >
                    Home
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/keys" 
                    className="relative text-sm font-medium text-gray-300 transition-colors hover:text-white group"
                  >
                    Dashboard
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/pricing" 
                    className="relative text-sm font-medium text-gray-300 transition-colors hover:text-white group"
                  >
                    Pricing
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full"></span>
                  </Link>
                  <Link 
                    href="/docs" 
                    className="relative text-sm font-medium text-gray-300 transition-colors hover:text-white group"
                  >
                    Docs
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all group-hover:w-full"></span>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 ring-2 ring-purple-600/50 hover:ring-purple-600"
                      }
                    }}
                  />
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}