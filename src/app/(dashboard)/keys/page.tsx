"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import CopyButton from "~/components/copy-button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "~/components/ui/table";

import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

import {
  BookOpenText,
  Plus,
  Key,
  AlertCircle,
  Sparkles,
  Upload,
  X,
  Image as ImageIcon,
  Shield,
  Lock,
  Code,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

import { useUploadThing } from "~/lib/uploadthing";

type ShoeItem = {
  id: string;
  type: string;
  brand: string;
  model: string;
  size: string;
  price: number;
  imageUrl?: string | null;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

type KeysApiResponse = {
  items?: ShoeItem[];
  key?: string;
  id?: string;
  error?: string;
};

export default function KeysPage() {
  const [type, setType] = useState<"Running" | "Dress shoes" | "Sneakers" | "Boots" | "">("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ShoeItem[]>([]);

  const { startUpload } = useUploadThing("shoeImageUploader");

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert("File size must be less than 4MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

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
      if (!type || !brand || !model || !price) {
        alert("Please fill type, brand, model, and price");
        setLoading(false);
        return;
      }

      let uploadedImageUrl = "";

      if (selectedFile) {
        setUploading(true);
        try {
          const uploadResult = await startUpload([selectedFile]);
          setUploading(false);

          if (uploadResult && uploadResult[0]) {
            uploadedImageUrl = uploadResult[0].url;
            console.log("Image uploaded successfully:", uploadedImageUrl);
          } else {
            throw new Error("Upload failed - no result returned");
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          alert(`Failed to upload image: ${uploadError instanceof Error ? uploadError.message : "Unknown error"}`);
          setLoading(false);
          setUploading(false);
          return;
        }
      }

      const body = {
        type,
        brand,
        model,
        size: "6 - 13",
        price: Number(price),
        ...(uploadedImageUrl && { imageUrl: uploadedImageUrl }),
      };

      console.log("Sending request with body:", body);

      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: KeysApiResponse = await res.json();

      if (res.ok && data.key && data.id) {
        setJustCreated({ key: data.key, id: data.id });
        setType("");
        setBrand("");
        setModel("");
        setPrice("");
        clearFile();
        await load();
      } else {
        console.error("API error:", data);
        alert(data.error ?? "Failed to create key");
      }
    } catch (error) {
      console.error("Create key error:", error);
      alert("Failed to create key (see console)");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }, [type, brand, model, price, selectedFile, startUpload, load]);

  const revokeKey = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
        const data: KeysApiResponse = await res.json();
        if (!res.ok) alert(data.error ?? "Failed to revoke");
        await load();
      } catch (error) {
        console.error(error);
      }
    },
    [load]
  );

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* SIGNED OUT VIEW */}
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
          <div className="max-w-5xl w-full space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300 border border-gray-600">
                    <div className="transform rotate-6 group-hover:rotate-0 transition-transform duration-300">
                      <Key className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                  API Key Management
                </h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                  Secure, scalable API keys for your sneaker data platform. 
                  Sign in to generate and manage your keys.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/sign-in">
                  <Button className="">
                    
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* What You Can Do Section */}
            <Card className="border border-gray-800 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-950 backdrop-blur-sm mt-8">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl text-white mb-2">
                  Complete API Key Management Platform
                </CardTitle>
                <CardDescription className="text-lg text-gray-400">
                  Everything you need to manage authentication for your sneaker data API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-6 rounded-xl bg-gray-950/50 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Create Shoe Entries</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Add shoes to your inventory with detailed information including brand, model, type, size range, pricing, and optional product images.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-6 rounded-xl bg-gray-950/50 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                        <Key className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Auto-Generated Keys</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Each shoe entry automatically receives a unique, cryptographically secure API key that's displayed once upon creation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-6 rounded-xl bg-gray-950/50 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                        <ImageIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Image Upload Support</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Upload product images (up to 4MB) for each shoe entry. Images are automatically optimized and securely stored.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-6 rounded-xl bg-gray-950/50 border border-gray-800">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                        <Shield className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Revoke Anytime</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          Instantly revoke any API key with a single click. Revoked keys immediately lose access to all endpoints.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4 pt-4">
                  <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                  
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">Unlimited</div>
                      <div className="text-gray-400 text-sm">API Keys per Account</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">Real-time</div>
                      <div className="text-gray-400 text-sm">Key Status Monitoring</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-white">Instant</div>
                      <div className="text-gray-400 text-sm">Activation & Revocation</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 pt-8">
              <Card className="border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 shadow-lg border border-gray-700">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-200">Secure by Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Enterprise-grade security with encrypted storage and secure key generation protocols
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 shadow-lg border border-gray-700">
                    <Zap className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-200">Instant Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Create API keys in seconds with one-click generation and immediate activation
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 shadow-lg border border-gray-700">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-200">Full Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Revoke, regenerate, and manage all your API keys from one centralized dashboard
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4 shadow-lg border border-gray-700">
                    <Code className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-200">Easy Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Simple header-based authentication works with any HTTP client or framework
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* How It Works */}
            <Card className="border border-gray-800 shadow-2xl bg-gradient-to-r from-gray-900 to-gray-950 backdrop-blur-sm mt-8">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl flex items-center justify-center gap-3 text-white">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                  How API Key Authentication Works
                </CardTitle>
                <CardDescription className="text-lg text-gray-400">
                  Simple, secure authentication flow for your applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <div className="space-y-4">
                    <div className="w-12 h-12 mx-auto bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-600">
                      1
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200">Sign In & Create</h3>
                    <p className="text-gray-400">Log into your dashboard and create shoe entries with their unique API keys</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 mx-auto bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-500">
                      2
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200">Add to Headers</h3>
                    <p className="text-gray-400">Include your API key in the <code className="bg-gray-950 px-2 py-0.5 rounded text-xs">x-api-key</code> header of requests</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-12 h-12 mx-auto bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-400">
                      3
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200">Access Data</h3>
                    <p className="text-gray-400">Make authenticated requests to retrieve shoe inventory and pricing data</p>
                  </div>
                </div>

                {/* Code Example */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <Code className="w-5 h-5 text-gray-400" />
                    Example Request
                  </h4>
                  <div className="bg-black rounded-lg p-4 border border-gray-800 overflow-x-auto">
                    <pre className="text-sm text-gray-300 font-mono">
{`fetch('https://yourapi.com/api/shoes', {
  headers: {
    'x-api-key': 'your_api_key_here'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
                    </pre>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Replace <code className="bg-gray-950 text-gray-300 px-2 py-0.5 rounded text-xs">your_api_key_here</code> with the actual API key generated from your dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Info Box */}
            <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 p-6 shadow-xl">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-1">Enterprise-Grade Security</h3>
                    <p className="text-gray-400">
                      All API keys are generated using cryptographically secure random algorithms and are hashed before storage. 
                      Keys are only displayed once during creation and cannot be retrieved afterward—only revoked or regenerated.
                    </p>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-1">Smart Key Management</h3>
                    <p className="text-gray-400">
                      Each API key is linked to a specific shoe entry, making it easy to track which keys access which inventory items. 
                      Monitor key status, creation dates, and usage—all from your centralized dashboard.
                    </p>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                    <BookOpenText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-200 mb-1">Comprehensive Documentation</h3>
                    <p className="text-gray-400">
                      Need help integrating? Our detailed documentation covers authentication, all available endpoints, request/response formats, 
                      error handling, and includes code examples in multiple programming languages.{" "}
                      <Link className="underline hover:text-white font-medium transition-colors" href="/docs">
                        View the full documentation →
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      {/* SIGNED IN VIEW */}
      <SignedIn>
        <div className="mx-auto max-w-6xl space-y-8 p-6">
          <div className="flex items-center justify-between pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 border border-gray-700">
                  <div className="transform rotate-6">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.5 9.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5S17.62 7 19 7s2.5 1.12 2.5 2.5zM19 3c-3.31 0-6 2.69-6 6 0 1.39.47 2.67 1.26 3.69L9.5 18.5l-3-3-3 3h15l-5-5c1.02-.79 1.76-1.96 2.15-3.3.12-.42.19-.86.19-1.2C21.5 5.69 22.31 3 19 3z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                    API KEYS (Shoes)
                  </h1>
                  <p className="text-gray-400">Create a shoe entry + a generated API key</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={"/docs"}>
                <Button
                  variant={"outline"}
                  className="flex items-center gap-2 bg-gray-900 border-gray-700 text-gray-200 transition-all duration-200 shadow-sm hover:bg-gray-800 hover:border-gray-600"
                  aria-label="Open API GUIDE"
                >
                  <BookOpenText className="w-4 h-4" />
                  View API Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Create Shoe + Key */}
          <Card className="border border-gray-800 shadow-xl bg-gradient-to-r from-gray-900 to-black backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div className="space-y-1">
                <CardTitle className="text-xl flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  Generate Shoe API Key
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Each shoe entry gets its own API key (visible once)
                </CardDescription>
              </div>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-600 text-white"
                aria-label="Create API key"
                onClick={createKey}
                disabled={loading || uploading}
              >
                {loading || uploading ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {uploading ? "Uploading..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create
                  </>
                )}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="col-span-1 md:col-span-1 space-y-1">
                  <label className="text-sm font-medium text-gray-300">Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full border border-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 rounded-md p-2 bg-gray-950 text-gray-200"
                  >
                    <option value="">Select type</option>
                    <option value="Running">Running</option>
                    <option value="Dress shoes">Dress shoes</option>
                    <option value="Sneakers">Sneakers</option>
                    <option value="Boots">Boots</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Brand *</label>
                  <input
                    placeholder="e.g. Nike"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full border border-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 rounded-md p-2 bg-gray-950 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Model *</label>
                  <input
                    placeholder="e.g. Air Zoom Pegasus"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full border border-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 rounded-md p-2 bg-gray-950 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Size</label>
                  <input
                    value="6 - 13"
                    readOnly
                    className="border border-gray-700 bg-gray-950 rounded-md p-2 w-full cursor-not-allowed text-gray-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Price (PHP) *</label>
                  <input
                    placeholder="e.g. 150"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    min="1"
                    className="w-full border border-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 rounded-md p-2 bg-gray-950 text-gray-200 placeholder:text-gray-500"
                  />
                </div>

                {/* File Upload Section */}
                <div className="space-y-1 md:col-span-1">
                  <label className="text-sm font-medium text-gray-300">Shoe Image (Optional)</label>
                  
                  {!selectedFile && !previewUrl ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="shoe-image-upload"
                      />
                      <label
                        htmlFor="shoe-image-upload"
                        className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-700 rounded-md p-3 cursor-pointer hover:border-gray-500 hover:bg-gray-900/50 transition-all duration-200 h-[42px]"
                      >
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          Upload image (max 4MB)
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-700 rounded-md p-2 bg-gray-950">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-900 rounded flex items-center justify-center overflow-hidden border border-gray-700 flex-shrink-0">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-300 truncate">
                            {selectedFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {selectedFile && (selectedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearFile}
                          className="hover:bg-red-950/50 h-8 w-8 p-0 flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {justCreated && (
                <div className="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 to-gray-950 p-4 shadow-sm">
                  <div className="text-sm font-medium text-gray-200 flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    Here is your API Key (visible once):
                  </div>
                  <div className="mt-2 flex items-center gap-2 p-3 bg-black rounded-md border border-gray-800">
                    <code className="text-sm break-all font-mono text-gray-300 flex-1">{justCreated.key}</code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="text-gray-400 mt-3 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Save this key securely. You won't be able to see it again.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keys Table Card */}
          <Card className="border border-gray-800 shadow-xl bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                  <Key className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Your Shoe Keys</CardTitle>
                  <CardDescription className="text-gray-400">Manage and monitor your shoe API keys</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader className="bg-gray-950/80">
                    <TableRow className="border-gray-800">
                      <TableHead className="font-semibold text-gray-300">Brand</TableHead>
                      <TableHead className="font-semibold text-gray-300">Key</TableHead>
                      <TableHead className="font-semibold text-gray-300">Created</TableHead>
                      <TableHead className="font-semibold text-gray-300">Status</TableHead>
                      <TableHead className="text-right font-semibold text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {items.map((row) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-gray-800/50 transition-colors duration-200 border-gray-800"
                      >
                        <TableCell className="font-medium text-gray-200">{row.brand}</TableCell>

                        <TableCell className="font-mono text-sm bg-gray-950 text-gray-400 rounded px-2 py-1 inline-block border border-gray-800">
                          {row.masked}
                        </TableCell>

                        <TableCell className="text-gray-400">
                          {new Date(row.createdAt).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          {row.revoked ? (
                            <Badge variant="secondary" className="bg-red-950/50 text-red-400 border-red-900">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                              Revoked
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-800">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1.5"></div>
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
                            className="hover:shadow-md transition-all duration-200 bg-red-950/50 hover:bg-red-900/50 border border-red-900"
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
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
                              <Key className="w-8 h-8 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-gray-200 font-medium">No shoe API keys yet</p>
                              <p className="text-gray-500 text-sm">
                                Create your first shoe + key to get started
                              </p>
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

          <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <div className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 p-6 shadow-sm">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-700">
                <AlertCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-200 mb-1">Usage Tip</h3>
                <p className="text-gray-400">
                  Call secured endpoints with the <code className="bg-gray-950 text-gray-300 px-2 py-0.5 rounded text-sm font-mono border border-gray-800">x-api-key</code> header. See{" "}
                  <Link className="underline hover:text-white font-medium transition-colors" href={"/docs"}>
                    Docs
                  </Link>{" "}
                  for examples and best practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}