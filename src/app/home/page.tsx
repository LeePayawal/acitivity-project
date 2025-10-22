"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

import { 
  Zap, 
  Shield, 
  Key, 
  BookOpenText, 
  ArrowRight, 
  Sparkles,
  Globe,
  Code,
  Lock,
  Rocket,
  CheckCircle
} from "lucide-react";

const features = [
  {
    icon: Key,
    title: "Secure API Access",
    description: "Generate and manage API keys with full control over your footwear data access.",
    color: "from-gray-600 to-gray-800"
  },
  {
    icon: Shield,
    title: "Authentic Data",
    description: "Access verified shoe information from top brands with real-time updates.",
    color: "from-gray-500 to-gray-700"
  },
  {
    icon: Globe,
    title: "Global Catalog",
    description: "Browse shoes from around the world with our comprehensive database.",
    color: "from-gray-400 to-gray-600"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Easy integration with RESTful endpoints and extensive documentation.",
    color: "from-gray-700 to-gray-900"
  }
];

const quickActions = [
  {
    title: "Create API Key",
    description: "Get access to our shoes database",
    href: "/keys",
    icon: Key,
    primary: true
  },
  {
    title: "Browse Docs",
    description: "Learn about our endpoints",
    href: "/docs",
    icon: BookOpenText,
    primary: true
  },
  {
    title: "Test API",
    description: "Try our echo endpoint",
    href: "/api/ping",
    icon: Zap,
    primary: true
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900">
      
<SignedOut>
        <div className="min-h-screen overflow-x-hidden">
          {/* Hero Section */}
          <div className="relative min-h-screen flex items-center justify-center px-6">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-gray-800/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gray-600/10 rounded-full blur-3xl"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto text-center space-y-12">
              {/* Logo/Icon */}
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <div className="relative w-32 h-32 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-gray-600">
                    <div className="transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                      <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.5 9.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5S17.62 7 19 7s2.5 1.12 2.5 2.5zM19 3c-3.31 0-6 2.69-6 6 0 1.39.47 2.67 1.26 3.69L9.5 18.5l-3-3-3 3h15l-5-5c1.02-.79 1.76-1.96 2.15-3.3.12-.42.19-.86.19-1.2C21.5 5.69 22.31 3 19 3z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">The Future of Footwear Data</span>
                </div>
                
                <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent leading-tight">
                  Sneaker Data API
                </h1>
                
                <p className="text-gray-400 text-2xl max-w-3xl mx-auto leading-relaxed">
                  Access the world's most comprehensive sneaker database. 
                  <span className="text-white font-semibold"> 50,000+ shoes</span>, 
                  <span className="text-white font-semibold"> 200+ brands</span>, 
                  real-time pricing & inventory—all through one powerful API.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 border border-gray-600 group">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" className="px-8 py-6 text-lg border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-all duration-300">
                    View Documentation
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <Badge className="bg-gray-800/50 text-gray-300 border-gray-700 px-4 py-2 text-sm backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verified Data
                </Badge>
                <Badge className="bg-gray-800/50 text-gray-300 border-gray-700 px-4 py-2 text-sm backdrop-blur-sm">
                  <Zap className="w-4 h-4 mr-2" />
                  Lightning Fast
                </Badge>
                <Badge className="bg-gray-800/50 text-gray-300 border-gray-700 px-4 py-2 text-sm backdrop-blur-sm">
                  <Lock className="w-4 h-4 mr-2" />
                  Secure API Keys
                </Badge>
                <Badge className="bg-gray-800/50 text-gray-300 border-gray-700 px-4 py-2 text-sm backdrop-blur-sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Global Coverage
                </Badge>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">
                  Everything You Need for Sneaker Data
                </h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto">
                  Built for developers, designed for scale. Get access to comprehensive footwear data with enterprise-grade reliability.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="border border-gray-800 shadow-xl bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 hover:-translate-y-2 group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg border border-gray-700 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-gray-200 group-hover:text-white transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-center leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="relative py-24 px-6 bg-gradient-to-b from-transparent via-gray-950/50 to-transparent">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">
                  Get Started in Minutes
                </h2>
                <p className="text-gray-400 text-xl">
                  Three simple steps to access premium sneaker data
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                <div className="text-center space-y-6 group">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-700 to-gray-900 text-white rounded-2xl flex items-center justify-center font-bold text-2xl border border-gray-600 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-700 to-transparent"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                        <Key className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-200">Sign Up & Create Key</h3>
                    <p className="text-gray-400 leading-relaxed">Create your account and generate your first API key instantly. No credit card required.</p>
                  </div>
                </div>

                <div className="text-center space-y-6 group">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-600 to-gray-800 text-white rounded-2xl flex items-center justify-center font-bold text-2xl border border-gray-500 shadow-xl group-hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-700 to-transparent"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                        <BookOpenText className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-200">Explore Documentation</h3>
                    <p className="text-gray-400 leading-relaxed">Read our comprehensive docs with code examples in multiple languages and frameworks.</p>
                  </div>
                </div>

                <div className="text-center space-y-6 group">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-500 to-gray-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl border border-gray-400 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    3
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700 flex items-center justify-center">
                        <Code className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-200">Start Building</h3>
                    <p className="text-gray-400 leading-relaxed">Integrate our API into your app and start fetching real-time sneaker data immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="relative py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <Card className="border border-gray-800 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-950 to-black backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 to-gray-700/20 blur-3xl"></div>
                <CardContent className="relative z-10 py-16">
                  <div className="grid md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-2">
                      <div className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                        50K+
                      </div>
                      <div className="text-gray-400 text-lg">Shoe Models</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                        200+
                      </div>
                      <div className="text-gray-400 text-lg">Brands</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                        99.9%
                      </div>
                      <div className="text-gray-400 text-lg">Uptime</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-5xl font-bold bg-gradient-to-r from-gray-200 to-white bg-clip-text text-transparent">
                        &lt;100ms
                      </div>
                      <div className="text-gray-400 text-lg">Response Time</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="relative py-24 px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-5xl md:text-6xl font-bold text-white">
                Ready to Step Up Your Game?
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed">
                Join hundreds of developers building amazing sneaker applications with our API. 
                Start for free, scale as you grow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-10 py-7 text-xl shadow-2xl hover:shadow-gray-800/50 transition-all duration-300 border border-gray-600 group">
                    Start Building Now
                    <Rocket className="w-6 h-6 ml-3 group-hover:translate-y-[-4px] transition-transform" />
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" className="px-10 py-7 text-xl border-gray-700 hover:bg-gray-800 text-gray-300 hover:text-white transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mx-auto max-w-7xl space-y-12 p-6">
          
          {/* Hero Section */}
          <div className="text-center space-y-8 pt-12 pb-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl transform -rotate-6 border border-gray-700">
                  <div className="transform rotate-6">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.5 9.5c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5S17.62 7 19 7s2.5 1.12 2.5 2.5zM19 3c-3.31 0-6 2.69-6 6 0 1.39.47 2.67 1.26 3.69L9.5 18.5l-3-3-3 3h15l-5-5c1.02-.79 1.76-1.96 2.15-3.3.12-.42.19-.86.19-1.2C21.5 5.69 22.31 3 19 3z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-200 via-white to-gray-300 bg-clip-text text-transparent">
                Step Into Data!
              </h1>
              <p className="text-gray-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Your comprehensive sneaker API is ready. Access thousands of shoes, manage keys, 
                and integrate footwear data into your applications seamlessly.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-300">50K+</div>
                <div className="text-gray-500 text-sm">Shoe Models</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-300">200+</div>
                <div className="text-gray-500 text-sm">Brands</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-300">Real-time</div>
                <div className="text-gray-500 text-sm">Updates</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="border border-gray-800 shadow-2xl bg-gradient-to-r from-gray-900 via-gray-950 to-black backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl flex items-center justify-center gap-3 text-white">
                <Rocket className="w-8 h-8 text-gray-400" />
                Quick Start
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">
                Get your sneaker data flowing in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className={`
                      cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 
                      border-0 h-full
                      ${action.primary 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-900 text-white shadow-lg border border-gray-600' 
                        : 'bg-gray-950/80 hover:bg-gray-900 shadow-md border border-gray-800'
                      }
                    `}>
                      <CardHeader className="text-center pb-4">
                        <div className={`
                          w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4
                          ${action.primary 
                            ? 'bg-white/10 border border-gray-600' 
                            : 'bg-gradient-to-br from-gray-600 to-gray-800 border border-gray-700'
                          }
                        `}>
                          <action.icon className={`w-8 h-8 ${action.primary ? 'text-white' : 'text-white'}`} />
                        </div>
                        <CardTitle className={`text-xl ${action.primary ? 'text-white' : 'text-gray-200'}`}>
                          {action.title}
                        </CardTitle>
                        <CardDescription className={action.primary ? 'text-gray-300' : 'text-gray-400'}>
                          {action.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center pb-6">
                        <Button 
                          variant={action.primary ? "secondary" : "outline"}
                          className={`
                            group transition-all duration-200
                            ${action.primary 
                              ? 'bg-white/10 text-white border-white/20 hover:bg-white/20' 
                              : 'border-gray-700 hover:bg-gray-800 text-gray-300'
                            }
                          `}
                        >
                          Get Started
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">
                Why Sneaker Enthusiasts Love Us
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Built for developers who need reliable footwear data
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border border-gray-800 shadow-lg bg-gray-900/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg border border-gray-700`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-200">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          {/* Getting Started Section */}
          <Card className="border border-gray-800 shadow-xl bg-gradient-to-r from-gray-900 to-gray-950 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl flex items-center justify-center gap-3 text-white">
                <CheckCircle className="w-8 h-8 text-gray-400" />
                Lace Up and Start!
              </CardTitle>
              <CardDescription className="text-lg text-gray-400">
                Three simple steps to access our sneaker database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-600">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200">Generate Key</h3>
                  <p className="text-gray-400">Create your API key to unlock shoe data access</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-500">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200">Explore Docs</h3>
                  <p className="text-gray-400">Learn about endpoints and shoe data structure</p>
                </div>
                <div className="space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gray-500 text-white rounded-full flex items-center justify-center font-bold text-lg border border-gray-400">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-200">Integrate</h3>
                  <p className="text-gray-400">Start fetching sneaker data for your app</p>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <Link href="/keys">
                  <Button className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-600">
                    Get Your API Key
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </SignedIn>
    </main>
  );
}