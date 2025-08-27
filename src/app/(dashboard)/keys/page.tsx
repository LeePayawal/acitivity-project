"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpenText, Plus } from "lucide-react"; 
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { useEffect, useState } from "react";

type KeyItem ={
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

export default function KeysPage(){

const [name, setName] = useState("My API Key");
const [justCreated, setJustCreated] = useState<{
  key: string;
  id:string;
} | null>(null);
const[loading, setLoading] = useState(false);
const [items, setItems] = useState<KeyItem[]>([]);

async function createKey() {
  setLoading(true);
try {
const res = await fetch("/api/keys", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name }),
});

  const data = await res.json();
  if(res.ok) {
    setJustCreated({ key: data.key, id: data.id });
    await load();
  } else {
    alert(data.error ?? "Failed to create key");
  }
} finally {
  setLoading(false);
}
}

  async function load(){
  const res = await fetch ("/api/keys", { cache: "no-store" });
  const data = await res.json();
  setItems(data.items ?? []);
  }
   
  async function revokeKey(id: string){
    const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE"});
    const data = await res.json();
    if (!res.ok) alert(data.error ?? "Failed to revoke");
    await load();
  }

  useEffect(() => {
    load();
  }, [createKey, revokeKey]);

    return(
         <main className="">
              <SignedOut>
                <div>
                  <div className="h-full w-full text-center text-2x1">Please Sign In Above To Continue! </div>
                </div>
              </SignedOut>

              <SignedIn>
                
        <div className="mx-auto, max-w-4x1 space-y-6 p-6">
            {/* Top ToolBar */}
            <div className="flex items-center justify-between">
            <h1 className="text-x1 font-semibold">API KEYS</h1>
            <div className="flex gap-2">
             <Link href={"/docs"}>
              <Button variant={"outline"} className="flex items-center gap-2"aria-label="Open API
              GUIDE">
               <BookOpenText />
                 View API Documentation
               </Button>
             </Link>
              </div>
            </div>
            <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0">
    <CardTitle>Generate API key</CardTitle>
    <Button 
    className="flex items-center gap-2" 
    aria-label="Create API key"
    onClick={createKey}
    disabled={loading}
    >
        <Plus className="h-4 w-4"/>
        Create
    </Button>
     </CardHeader>
     <CardContent className="space-y-3">
     <div> 
        <Input 
        placeholder="Key Name (e.g. Production)" 
        aria-label="API Key Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        />
        </div>
        {justCreated && (            
     <div className="rounded-md border p-3">
        <p className="tetxt-sm font-medium">
            Here is your API Key (visible once):{""}
        </p>
        <div className="mt-2 flec items-center gap-2">
            <code className="text-sm break-all">{justCreated.key}</code>
            <CopyButton value={justCreated.key} />

        </div>
        <p className="text-muted-foreground mt-2 text-xs">
           Save this key securely. You won't be able ro see it again.</p>
     </div>
        )}

    </CardContent>
        </Card>
    <Card>
     <CardHeader>
       <CardTitle>Your Keys</CardTitle>
         </CardHeader>
        <CardContent>
<Table>
  <TableHeader>
    
 <TableRow>
      <TableHead >Name</TableHead>
      <TableHead>Key</TableHead>
      <TableHead>Created</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
    
  </TableHeader>
  <TableBody>
    {items.map((row) => (
    <TableRow key={row.id}>
    <TableCell>{row.name}</TableCell>
      <TableCell className="font-mono">{row.masked}</TableCell>
      <TableCell>
        {new Date(row.createdAt).toLocaleString()}
        </TableCell>
      <TableCell>
        {row.revoked ? (
          <Badge variant="secondary">Revoked</Badge>
        ) : (
          <Badge>Active</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant ="destructive"
          size = "sm"
          disabled={row.revoked}
          onClick={() => revokeKey(row.id)}
       >

         Revoke
        </Button>
      </TableCell>
    </TableRow>
    ))}

    {items.length === 0 && (
      <TableRow>
      <TableCell
        colSpan={5}
        className="text-muted-foreground text-center text-sm"
        >
        No keys yet
        </TableCell>
        </TableRow>
    )}
       </TableBody>
       </Table>
       </CardContent>
       </Card>
       <Separator/>
       <p>TIP: Call secured ebdpoints with the <code>x-apo-key</code> header, See {""}
       <Link className={"underline"} href={"/docs"}>
       Docs
       </Link> 
       </p>
          </div>

    </SignedIn>
     </main>
    );
}
function load() {
  throw new Error("Function not implemented.");
}

