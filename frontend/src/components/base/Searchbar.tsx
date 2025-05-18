"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/useDebounce";

function Searchbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  // Focus on Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Optional: Do something with debounced query
  useEffect(() => {
    if (debouncedQuery.trim()) {
      console.log("Search for:", debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <div className="text-font1 bg-font4/3 gap-1 flex items-center py-1 px-2 border border-font3/10 rounded-md">
      <svg className="size-4 mr-1 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>

      <Input
        ref={inputRef}
        type="search"
        placeholder="Search meetings, transcripts, etc..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="h-9 px-0 flex-1 shadow-transparent bg-transparent border-none focus:outline-none focus:ring-0 text-xs placeholder:text-font3"
      />

      <div className="flex gap-1 text-xs text-font3">
        <span className="size-7 bg-element3 cursor-pointer rounded-sm flex items-center justify-center">
          <kbd className="kbd kbd-sm">⌘</kbd>
        </span>
        <span className="size-7 bg-element3 cursor-pointer rounded-sm flex items-center justify-center">
          <kbd className="kbd kbd-sm">K</kbd>
        </span>
      </div>
    </div>
  );
}

export default Searchbar;
