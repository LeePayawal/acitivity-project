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
    : "http://localhost:3000";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("Samsung");
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

  // ✅ Corrected and properly placed runOPTIONS function
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
      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between bg-gray-900/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-800">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
            API Guide
          </h1>
          <Link href={"/keys"}>
            <Button
              variant={"outline"}
              className="flex items-center gap-2 text-gray-200 hover:text-white border-gray-700 hover:bg-gray-800"
            >
              <KeyRound className="w-4 h-4" />
              Keys Dashboard
            </Button>
          </Link>
        </div>

        {/* Interactive Tester */}
        <Card className="border border-gray-800 shadow-lg bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white">Interactive Tester</CardTitle>
            <CardDescription className="text-gray-400">Try live requests using your API key</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Paste your API key (sk_...)"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="bg-gray-950 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-500"
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={runGET} disabled={loadingGET} className="bg-gray-700 hover:bg-gray-600 border border-gray-600">
                {loadingGET ? "Testing..." : "Test GET /api/echo"}
              </Button>

              <Button onClick={runPOST} variant="secondary" disabled={loadingPOST} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200">
                {loadingPOST ? "Testing..." : "Test POST /api/echo"}
              </Button>

              <Button onClick={runOPTIONS} variant="secondary" disabled={loadingOPTIONS} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200">
                {loadingOPTIONS ? "Testing..." : "Test OPTIONS /api/echo"}
              </Button>
            </div>

            <Label className="text-sm font-medium text-gray-300">POST body (JSON)</Label>
            <Textarea
              rows={5}
              value={postBody}
              onChange={(e) => setPostBody(e.target.value)}
              className="bg-gray-950 border-gray-700 text-gray-200 placeholder:text-gray-500 focus:border-gray-500"
            />

            <Label className="text-sm font-medium text-gray-300">Response</Label>
            <Textarea rows={10} readOnly value={out} className="bg-gray-950 border-gray-700 text-gray-300 font-mono" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}