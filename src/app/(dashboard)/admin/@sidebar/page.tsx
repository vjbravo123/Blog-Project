"use client";

import React, { useState } from "react";
import { Sidebar } from "@/features/admin/components/sidebar";
import { Menu } from "lucide-react";

export default function SidebarSlot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* This floating button only appears on mobile to trigger the sidebar slot */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-900 border rounded-lg shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>
    </>
  );
}