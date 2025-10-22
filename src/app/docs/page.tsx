"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";


export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Nike");
  const [loadingGET, setLoadingGET] = useState(false);
  const [loadingPOST, setLoadingPOST] = useState(false);
  const [loadingOPTIONS, setLoadingOPTIONS] = useState(false);

  async function runGET() {
    if (!key) return alert("Please enter your API key");
    setLoadingGET(true);
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        headers: { "x-api-key": key },
      });
      const data = await res.json();
      setOut(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setOut(err.message);
    } finally {
      setLoadingGET(false);
    }
  }

  async function runPOST() {
    if (!key) return alert("Please enter your API key");
    setLoadingPOST(true);
    try {
      let body: any;
      try {
        body = JSON.parse(postBody);
      } catch {
        body = { postBody };
      }

      const res = await fetch(`${baseUrl}/api/echo`, {
        method: "POST",
        headers: {
          "x-api-key": key,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      setOut(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setOut(err.message);
    } finally {
      setLoadingPOST(false);
    }
  }

  async function runOPTIONS() {
    if (!key) return alert("Please enter your API key");
    setLoadingOPTIONS(true);
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:3000",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "x-api-key, content-type",
        },
      });

      const headersList = Array.from(res.headers.entries())
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      setOut(`Status: ${res.status}\n${headersList}`);
    } catch (err: any) {
      setOut(err.message);
    } finally {
      setLoadingOPTIONS(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      <div className="mx-auto max-w-7xl space-y-4 p-4">
        {/* Compact Toolbar */}
        <div className="flex items-center justify-between bg-gray-900/70 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r bg-gray-200 to-white bg-clip-text text-transparent">
            API Documentation
          </h1>
<Link href={"/keys"}>
  <Button
    variant={"outline"}
    size="sm"
    className="flex items-center gap-1.5 text-black hover:text-gray-800 border-gray-700 hover:bg-gray-200 text-xs"
  >
    <KeyRound className="w-3 h-3" />
    Keys
  </Button>
</Link>

        </div>

        {/* Authentication & Endpoints - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Auth Card */}
          <Card className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:border-white/30 transition-all">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm">Authentication</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2 text-xs">
              <p className="text-gray-300">
                Use <code className="px-1.5 py-0.5 bg-black/30 rounded text-cyan-200 font-mono">x-api-key</code> header. Get keys from <code className="px-1.5 py-0.5 bg-black/30 rounded text-cyan-200 font-mono">/keys</code>
              </p>
              <Separator className="bg-white/20" />
              <div>
                <div className="font-semibold text-gray-200 mb-1">Base URL</div>
                <pre className="bg-black/30 p-2 rounded text-[10px]">
                  <code className="text-cyan-200">{baseUrl + "/api"}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* GET Endpoint */}
          <Card className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:border-white/30 transition-all">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm">GET /api/echo</CardTitle>
              <CardDescription className="text-[10px] text-gray-400">Test key & check limits</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <pre className="bg-black/30 p-2 rounded text-[10px] overflow-x-auto">
                <code className="text-cyan-200">{`curl -H 'x-api-key: <KEY>' ${baseUrl}/api/echo`}</code>
              </pre>
              <div className="text-[10px]">
                <div className="font-semibold text-gray-300 mb-1">Response:</div>
                <pre className="bg-black/30 p-2 rounded overflow-x-auto">
                  <code className="text-green-300">{`{
  "ok": true,
  "tier": "silver",
  "rateLimit": {
    "limit": 1000,
    "remaining": 999
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* POST Endpoint */}
          <Card className="bg-white/10 backdrop-blur-md text-white border border-white/20 hover:border-white/30 transition-all">
            <CardHeader className="p-3 pb-2">
              <CardTitle className="text-sm">POST /api/echo</CardTitle>
              <CardDescription className="text-[10px] text-gray-400">Search shoes by brand</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 space-y-2">
              <pre className="bg-black/30 p-2 rounded text-[10px] overflow-x-auto">
                <code className="text-cyan-200">{`curl -X POST -H 'x-api-key: <KEY>' \\
-d '{"postBody":"Nike"}' \\
${baseUrl}/api/echo`}</code>
              </pre>
              <div className="text-[10px]">
                <div className="font-semibold text-gray-300 mb-1">Success (200):</div>
                <pre className="bg-black/30 p-2 rounded overflow-x-auto">
                  <code className="text-green-300">{`{
  "ok": true,
  "received": [...],
  "tier": "silver"
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rate Limiting - Compact */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-white">Rate Limits</h2>
          
          {/* Tier Grid - Compact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Card className="bg-gradient-to-br from-orange-900/30 to-orange-800/20 backdrop-blur-md text-white border border-orange-500/30 hover:border-orange-500/50 transition-all">
              <CardContent className="p-3">
                <div className="text-[10px] text-orange-300 font-semibold">BRONZE • Free</div>
                <div className="text-2xl font-bold text-orange-200 mt-1">100</div>
                <div className="text-[10px] text-orange-300/80">req/10s</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-700/30 to-gray-600/20 backdrop-blur-md text-white border border-gray-400/30 hover:border-gray-400/50 transition-all">
              <CardContent className="p-3">
                <div className="text-[10px] text-gray-300 font-semibold">SILVER • Starter</div>
                <div className="text-2xl font-bold text-gray-200 mt-1">1K</div>
                <div className="text-[10px] text-gray-300/80">req/10s</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-700/30 to-yellow-600/20 backdrop-blur-md text-white border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
              <CardContent className="p-3">
                <div className="text-[10px] text-yellow-300 font-semibold">GOLD • Pro</div>
                <div className="text-2xl font-bold text-yellow-200 mt-1">5K</div>
                <div className="text-[10px] text-yellow-300/80">req/10s</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-700/30 to-cyan-600/20 backdrop-blur-md text-white border border-cyan-500/30 hover:border-cyan-500/50 transition-all">
              <CardContent className="p-3">
                <div className="text-[10px] text-cyan-300 font-semibold">PLATINUM • Enterprise</div>
                <div className="text-2xl font-bold text-cyan-200 mt-1">∞</div>
                <div className="text-[10px] text-cyan-300/80">unlimited</div>
              </CardContent>
            </Card>
          </div>

          {/* Rate Limit Details - Compact 2-column */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card className="bg-white/10 backdrop-blur-md text-white border border-white/20">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-gray-200">Sliding Window</div>
                  <p className="text-gray-400 text-[11px]">Tracks requests over 10s, resets continuously based on your tier.</p>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <div className="font-semibold text-gray-200 mb-1">Response Headers</div>
                  <pre className="bg-black/30 p-2 rounded text-[10px]">
                    <code className="text-cyan-200">{`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Tier: silver`}</code>
                  </pre>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <div className="font-semibold text-gray-200 mb-1">Rate Limit Key</div>
                  <p className="text-gray-400 text-[11px]">
                    Auth: <code className="px-1 py-0.5 bg-black/30 rounded text-cyan-200">key:ID</code> • Unauth: <code className="px-1 py-0.5 bg-black/30 rounded text-cyan-200">ip:ADDRESS</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md text-white border border-white/20">
              <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm">Exceeded Limit</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2 text-xs">
                <div>
                  <div className="font-semibold text-gray-200 mb-1">429 Response</div>
                  <pre className="bg-black/30 p-2 rounded text-[10px]">
                    <code className="text-red-300">{`{
  "error": "Rate limit exceeded",
  "message": "You've exceeded your 
    bronze tier limit...",
  "tier": "bronze",
  "limit": 100
}`}</code>
                  </pre>
                </div>
                <Separator className="bg-white/20" />
                <div>
                  <div className="font-semibold text-gray-200 mb-1">Best Practices</div>
                  <ul className="space-y-1 text-[11px] text-gray-400">
                    <li className="flex gap-1.5"><span className="text-green-400">✓</span>Check X-RateLimit-Remaining</li>
                    <li className="flex gap-1.5"><span className="text-green-400">✓</span>Exponential backoff on 429</li>
                    <li className="flex gap-1.5"><span className="text-green-400">✓</span>Batch requests when possible</li>
                    <li className="flex gap-1.5"><span className="text-green-400">✓</span>Cache responses locally</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interactive Tester - Compact */}
        <Card className="border border-gray-800 bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm text-white">Interactive Tester</CardTitle>
            <CardDescription className="text-[10px] text-gray-400">Live API testing</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-3">
            <Input
              placeholder="API key (sk_...)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-950 border-gray-700 text-gray-200 text-sm h-8"
            />

            <div className="flex flex-wrap gap-1.5">
              <Button onClick={runGET} disabled={loadingGET} size="sm" className="bg-gray-700 hover:bg-gray-600 text-xs h-7">
                {loadingGET ? "Testing..." : "GET /api/echo"}
              </Button>
              <Button onClick={runPOST} disabled={loadingPOST} size="sm" className="bg-gray-800 hover:bg-gray-700 text-xs h-7">
                {loadingPOST ? "Testing..." : "POST /api/echo"}
              </Button>
              <Button onClick={runOPTIONS} disabled={loadingOPTIONS} size="sm" className="bg-gray-800 hover:bg-gray-700 text-xs h-7">
                {loadingOPTIONS ? "Testing..." : "OPTIONS"}
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-300">POST Body</Label>
              <Textarea
                rows={3}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="bg-gray-950 border-gray-700 text-gray-200 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-gray-300">Response</Label>
              <Textarea rows={8} readOnly value={out} className="bg-gray-950 border-gray-700 text-gray-300 font-mono text-[10px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}