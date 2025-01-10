import { Loader2 } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-yellow-200 to-orange-100">
      <Loader2 className="w-16 h-16 animate-spin text-purple-600 mb-4" />
      <p className="text-2xl font-bold text-purple-600">
        Loading your puzzle adventure...
      </p>
    </div>
  );
}
