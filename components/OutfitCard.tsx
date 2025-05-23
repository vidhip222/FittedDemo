// components/outfit-card.tsx
"use client"

import { useState } from "react";
import Image from "next/image";
import { Heart, HeartFilled, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OutfitCard({ outfit, userId }: { outfit: any, userId: string }) {
  const [isSaved, setIsSaved] = useState(outfit.saved || false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/outfits/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, outfitId: outfit.id })
      });
      if (res.ok) setIsSaved(!isSaved);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden relative bg-white shadow-sm">
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        aria-label={isSaved ? "Unsave outfit" : "Save outfit"}
      >
        {isSaved ? (
          <HeartFilled className="w-5 h-5 text-red-500" />
        ) : (
          <Heart className="w-5 h-5" />
        )}
      </button>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{outfit.name}</h3>
        <div className="grid grid-cols-2 gap-3">
          {outfit.pieces.map((piece: any) => (
            <div key={`${piece.type}-${piece.name}`} className="border rounded-md p-2">
              <div className="relative aspect-square mb-2">
                <Image
                  src={piece.image}
                  alt={piece.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium capitalize">{piece.type}</p>
                <p className="text-xs">{piece.name}</p>
                {piece.isFromCloset ? (
                  <span className="text-xs text-green-600">From your closet</span>
                ) : (
                  <>
                    {piece.price && <p className="text-xs font-medium">{piece.price}</p>}
                    {piece.link && (
                      <Button size="xs" className="w-full mt-1" asChild>
                        <a href={piece.link} target="_blank" rel="noopener noreferrer">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          Buy
                        </a>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}