"use client";

import { KeyRound, Terminal } from "lucide-react"; // ✅ only what we use
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Hello World");

  async function runGET() {
    const res = await fetch(`${baseUrl}/api/ping`, {
      headers: { "x-api-key": key },
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  async function runPOST() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "POST",
      headers: { "x-api-key": key, "content-type": "application/json" },
      body: JSON.stringify({ postBody }),
    });
    setOut(JSON.stringify(await res.json(), null, 2));
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Top ToolBar */}
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            API Guide
          </h1>

          <Link href={"/keys"}>
            <Button
              variant={"outline"}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
              aria-label="Open Keys Dashboard"
            >
              <KeyRound className="w-4 h-4" />
              Keys Dashboard
            </Button>
          </Link>
        </div>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Terminal className="w-5 h-5 text-blue-600" />
              How Authentication Works
            </CardTitle>
            <CardDescription>
              Learn how to use your API key for secure requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Authenticate using the{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 font-mono text-sm">
                x-api-key
              </code>{" "}
              header. Create a key in{" "}
              <code className="px-1 py-0.5 rounded bg-slate-100 font-mono text-sm">
                /keys
              </code>{" "}
              and store it securely.
            </p>
            <Separator />
            <div>
              <h3 className="font-semibold">Base URL</h3>
              <pre className="overflow-x-auto bg-slate-900 text-slate-100 p-3 rounded-md text-sm shadow-inner">
                <code>{baseUrl + "/api"}</code>
              </pre>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold mb-2">GET /api/ping</h3>
                <pre className="overflow-x-auto text-sm bg-slate-900 text-slate-100 p-3 rounded-md shadow-inner">
                  <code>{`curl -H 'x-api-key: <YOUR_KEY>' ${baseUrl}/api/ping`}</code>
                </pre>
                <pre className="overflow-x-auto text-sm bg-slate-900 text-slate-100 p-3 rounded-md shadow-inner mt-2">
                  <code>{`const r = await fetch('${baseUrl}/api/ping', { headers: { 'x-api-key': process.env.MY_KEY! } });`}</code>
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">POST /api/echo</h3>
                <pre className="overflow-x-auto text-sm bg-slate-900 text-slate-100 p-3 rounded-md shadow-inner">
                  <code>{`curl -X POST \\
                   -H 'x-api-key: <YOUR_KEY>' \\
  -H 'content-type: application/json' \\
  -d '{"hello":"world"}' \\
  ${baseUrl}/api/echo`}</code>
                </pre>
                <pre className="overflow-x-auto text-sm bg-slate-900 text-slate-100 p-3 rounded-md shadow-inner mt-2">
                  <code>{`const r = await fetch('${baseUrl}/api/echo', {
  method: 'POST',
  headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' },
  body: JSON.stringify({ hello: 'world' })
});`}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Interactive Tester</CardTitle>
            <CardDescription>
              Try out live requests using your own API key
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Paste your API key (sk_...)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={runGET}>Test GET /api/ping</Button>
              <Button onClick={runPOST} variant="secondary">
                Test POST /api/echo
              </Button>
            </div>
            <Label className="text-sm font-medium">POST body (JSON)</Label>
            <Textarea
              rows={5}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
            />
            <Label className="text-sm font-medium">Response</Label>
            <Textarea rows={10} readOnly value={out} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
