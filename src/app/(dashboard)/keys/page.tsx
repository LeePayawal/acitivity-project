import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpenText, Plus } from "lucide-react"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

export default function KeysPage() {
  const sampleApiKey = "puiqeijdiasjiduwuuwopaisksjdwossssqwwsadboiako";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center justify-start p-4 sm:p-6">
      
      {/* SignedOut */}
      <SignedOut>
        <div className="relative bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-6 sm:p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c0-1.657 1.343-3 3-3h1a3 3 0 110 6h-1a3 3 0 01-3-3zM9 17H7a5 5 0 01-5-5V9a5 5 0 015-5h2m4 0h2a5 5 0 015 5v3a5 5 0 01-5 5h-2m-4 0v2a2 2 0 002 2h2a2 2 0 002-2v-2m-4 0h4"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re Signed Out</h1>
          <p className="text-gray-600 mb-6">
            Please <span className="font-semibold text-indigo-600">sign in</span> above to continue.
          </p>
        </div>
      </SignedOut>

      {/* SignedIn */}
      <SignedIn>
        <div className="w-full max-w-4xl space-y-6 p-2 sm:p-6">

          {/* Top Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white/70 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-sm border border-white/20 gap-2 sm:gap-0">
            <h1 className="text-xl font-semibold text-gray-800">API KEYS</h1>
            <div className="flex flex-wrap gap-2">
              <Link href={"/docs"}>
                <Button
                  variant={"outline"}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
                  aria-label="Open API GUIDE"
                >
                  <BookOpenText />
                  View API Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Generate API Key Card */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg p-4 sm:p-6">
              <CardTitle className="text-gray-800">Generate API key</CardTitle>
              <Button
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                aria-label="Create API key"
              >
                <Plus />
                Create
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6">
              <Input
                placeholder="Key Name (e.g. Production)"
                aria-label="API Key Name"
                className="w-full border-gray-200 focus:border-blue-500 focus:ring-blue-200"
              />

              {/* API Key Display */}
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm overflow-x-auto">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Here is your API Key (visible once):
                </p>
                <div className="flex items-center gap-2 bg-white rounded-md p-3 border min-w-[300px]">
                  <code className="text-sm break-all font-mono text-gray-700 flex-1">
                    {sampleApiKey}
                  </code>
                  <CopyButton value={sampleApiKey} />
                </div>
                <p className="text-blue-700 mt-2 text-xs">
                  Save this key securely. You won&apos;t be able to see it again.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Keys Table */}
          <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-lg overflow-x-auto">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg p-4 sm:p-6">
              <CardTitle className="text-gray-800">Your Keys</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-gray-50/50 border-gray-200">
                    <TableHead className="text-gray-700 font-medium">Name</TableHead>
                    <TableHead className="text-gray-700 font-medium">Key</TableHead>
                    <TableHead className="text-gray-700 font-medium">Created</TableHead>
                    <TableHead className="text-gray-700 font-medium">Status</TableHead>
                    <TableHead className="text-right text-gray-700 font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-blue-50/30 transition-colors border-gray-100">
                    <TableCell className="text-gray-800 font-medium">Name of Key</TableCell>
                    <TableCell className="font-mono text-gray-600 bg-gray-50 rounded px-2 py-1 text-sm">{sampleApiKey}</TableCell>
                    <TableCell className="text-gray-600">8/21/2025</TableCell>
                    <TableCell>
                      <Badge
                        variant={"secondary"}
                        className="bg-red-100 text-red-800 border-red-200"
                      >
                        Revoked
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        className="bg-red-500 hover:bg-red-600 shadow-sm"
                      >
                        Revoke
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* Tips */}
          <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-lg p-4 shadow-sm text-sm sm:text-base">
            <p className="text-amber-800">
              TIP: Call secured endpoints with the{" "}
              <code className="bg-amber-100 px-2 py-1 rounded text-amber-900 font-mono">
                x-api-key
              </code>{" "}
              header, See{" "}
              <Link
                className="underline text-amber-700 hover:text-amber-900 font-medium"
                href={"/docs"}
              >
                Docs
              </Link>
            </p>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
