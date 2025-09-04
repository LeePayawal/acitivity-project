"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import CopyButton from "~/components/copy-button";

import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "~/components/ui/card";

import { 
  Table, TableBody, TableCell, TableHeader, TableHead, TableRow 
} from "~/components/ui/table";

import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

import { BookOpenText, Plus, Key, Shield, AlertCircle, Sparkles } from "lucide-react";


type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

type KeysApiResponse = {
  items?: KeyItem[];
  key?: string;
  id?: string;
  error?: string;
};


export default function KeysPage() {
  const [name, setName] = useState("My API Key");
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  // Load keys
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      const data: KeysApiResponse = await res.json();
      setItems(data.items ?? []);
    } catch (error) {
      console.error("Failed to load keys", error);
    }
  }, []);


  const createKey = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data: KeysApiResponse = await res.json();

      if (res.ok && data.key && data.id) {
        setJustCreated({ key: data.key, id: data.id });
        await load();
      } else {
        alert(data.error ?? "Failed to create key");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [name, load]);

  // Revoke key
  const revokeKey = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
      const data: KeysApiResponse = await res.json();
      if (!res.ok) alert(data.error ?? "Failed to revoke");
      await load();
    } catch (error) {
      console.error(error);
    }
  }, [load]);

  // Initial load
  useEffect(() => {
    void load();
  }, [load]);


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">

      
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Key className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Authentication Required</h2>
              <p className="text-slate-600 text-lg">Please sign in above to continue and manage your API keys</p>
            </div>
          </div>
        </div>
      </SignedOut>

      
      <SignedIn>
        <div className="mx-auto max-w-6xl space-y-8 p-6">

          
          <div className="flex items-center justify-between pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    API KEYS
                  </h1>
                  <p className="text-slate-600">Secure access tokens for your applications</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={"/docs"}>
                <Button 
                  variant={"outline"} 
                  className="flex items-center gap-2 bg-blue-50 border-blue-200 text-black transition-all duration-200 shadow-sm"
                  aria-label="Open API GUIDE"
                >
                  <BookOpenText className="w-4 h-4" />
                  View API Documentation
                </Button>
              </Link>
            </div>
          </div>

          
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Generate API Key
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Create a new secure API key for your application
                </CardDescription>
              </div>
              <Button 
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200" 
                aria-label="Create API key"
                onClick={createKey}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4"/>
                    Create
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"> 
                <label className="text-sm font-medium text-slate-700">Key Name</label>
                <input 
                  placeholder="Key Name (e.g. Production)" 
                  aria-label="API Key Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-md p-2 w-full"
                />
              </div>
              {justCreated && (            
                <div className="rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4 shadow-sm">
                  <div className="text-sm font-medium text-green-900 flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          Here is your API Key (visible once):
                  </div>
                  <div className="mt-2 flex items-center gap-2 p-3 bg-white rounded-md border border-green-200">
                    <code className="text-sm break-all font-mono text-slate-800 flex-1">{justCreated.key}</code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="text-green-700 mt-3 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Save this key securely. You won't be able to see it again.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keys Table Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Key className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Your Keys</CardTitle>
                  <CardDescription>
                    Manage and monitor your active API keys
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Name</TableHead>
                      <TableHead className="font-semibold text-slate-700">Key</TableHead>
                      <TableHead className="font-semibold text-slate-700">Created</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors duration-200 border-slate-100">
                        <TableCell className="font-medium text-slate-900">{row.name}</TableCell>
                        <TableCell className="font-mono text-sm bg-slate-50 text-slate-700 rounded px-2 py-1 inline-block">
                          {row.masked}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(row.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.revoked ? (
                            <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                              Revoked
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={row.revoked}
                            onClick={() => revokeKey(row.id)}
                            className="hover:shadow-md transition-all duration-200"
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Key className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                              <p className="text-slate-900 font-medium">No API keys yet</p>
                              <p className="text-slate-500 text-sm">Create your first API key to get started</p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent"/>
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-6 shadow-sm">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Usage Tip</h3>
                  <p className="text-blue-800">
                    Call secured endpoints with the <code className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded text-sm font-mono">x-api-key</code> header. See{" "}
                    <Link className="underline hover:text-blue-900 font-medium transition-colors" href={"/docs"}>
                      Docs
                    </Link>{" "}
                    for implementation examples and best practices.
                  </p>
                </div>
              </div>
            </div>
        </div>
       
      </SignedIn>

    </main>
  );
}
