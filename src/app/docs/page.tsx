"use client";

import { BookOpenText, KeyRound, } from "lucide-react";
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



export default function DocsPage(){
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
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="mx-auto max-w-8x1  space-y-6 p-6">
            {/* Top ToolBar */}
            <div className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/20">
            <h1 className="text-xl font-semibold text-gray-800">API Guide</h1>
        
             <Link href={"/keys"}>
              <Button 
              variant={"outline"} 
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 border-gray-200 hover:bg-gray-50"
              aria-label="Open Keys Dashboard">
               <KeyRound/>
                 Keys Dashboard
               </Button>
             </Link>
              </div>
              
            <Card>
            <CardHeader>
                <CardTitle>
                  How Aunthentication Works
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>  
           Authenticate using the <code>x-api-key</code>header. Create a key 
           in <code>/keys</code> and store it securely.
            </p>
            <Separator />
            <div>
              <h3 className="font-semibold">Base URL</h3>
              <pre className="overflow-x-auto">
                <code>{baseUrl + "/api"}</code>
              </pre>
            </div>
            <div className="flex flex-col gap-4">
            <div>
               <h3 className="font-semibold">GET /api/ping</h3>
               <pre className="overflow-x-auto text-sm">
                <code>{`curl -H 'x-api-key: </YOUR_KEY>' ${baseUrl}/api/ping`}</code>
               </pre>
           <pre className="overflow-x-auto text-sm">
            <code>{`const r =  await fetch ('${baseUrl}/api/ping', { headers: { 'x-api-key': process.env.MY_KEY! }});`}</code>
               </pre>
                </div>
                <Separator />
                <h3 className="font-semibold"> POST/api/echo</h3>
                <pre className="overflow-x-auto text-sm">
                  <code>{`curl -X POST \\
                  -H 'x-api-key: <YOUR_KEY>' \\
                  -H 'content-type: application/json' \\
                  -d '{"hello":"world"}' \\
                  ${baseUrl}/api/echo`}</code>
                  </pre>
                  <pre className="overflow-x-auto text-sm">
                 <code> {`const r =  wait fetch('${baseUrl}/api/echo', {
                 method: 'POST',
                 headers: { 'x-api-key': process.env.MY_KEY!,'content-type': 'application/json' },
                 body: JSON.stringify({hello: 'world' })
                  });`}</code>
                    
                  </pre>
                 
                 </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
           <CardTitle> Interactive Tester</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="Paster your API key (sk_...)" 
              value={key}
               onChange={(e) => setKey(e.target.value)}
               />
              <div className="flex flex-wrap gap-2">
                <Button onClick={runGET}>Test GET /api/ping</Button>
                <Button onClick={runPOST} variant="secondary">TEST POST /api/echo</Button>
              </div>
              <Label className="test-sm font-medium">POST body (JSON)</Label>
              <Textarea 
               rows={5}
               value={postBody}
               onChange={(e) => setPostBody(e.target.value)} />
              <Label className="test-sm font-medium">Response</Label>
              <Textarea rows={10} readOnly value={out} />
            </CardContent>
          </Card>

            </div>
        </main>
    );
}
