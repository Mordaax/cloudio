"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MdContentCopy  } from "react-icons/md";
import { toast } from "./ui/use-toast";

function FormLinkShare({ address,title }: { address: string,title: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  //const shareLink = shareUrl;
  return (
    <div className="flex flex-grow gap-4 items-center">
      <h3 className="w-1/5">{title}</h3>
      <Input value={address} readOnly />
      <Button
        className="w-[250px]"
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          });
        }}
      >
        <MdContentCopy className="mr-2 h-4 w-4" />
        Copy Address
      </Button>
    </div>
  );
}

export default FormLinkShare;
