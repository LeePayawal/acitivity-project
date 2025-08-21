import { BookOpenText, KeyRound, } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DocsPage(){
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="mx-auto max-w-4xl space-y-6 p-6">
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
            </div>
        </main>
    );
}