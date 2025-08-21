"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

type Props = { value: string; ariaLabel?: string };
export default function CopyButton({
    value,
    ariaLabel = "Copy to Clipbord",
}: Props){
const [ok, setOk] = useState(false);
    return(
        <Button
        variant={"outline"}
        size={"sm"}
        onClick={async() => {   
        await navigator.clipboard.writeText(value);
        setOk(true);
        setTimeout(() => setOk(false), 2000);
        }}
        aria-label={ariaLabel}
        >
 
        {ok ?(
            <div className="flex flex-row items-center gap-2">
            <Check /> Copied
            </div>
        ):(
            <div className="flex flex-row items-center gap-2">
            <Copy/> Copy
            </div>
        )
    }
        </Button>
    );
}