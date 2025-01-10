import React, { useState } from "react";
import { Button } from "./ui/button";
import { FileText } from "lucide-react";
import axios from "axios";

export default function ImageDescription({
  image,
}: {
  image: HTMLImageElement;
}) {
  const [imageDescription, setImageDescription] = useState<string>("");
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const getImageDescription = async () => {
    if (!image?.src) return;

    setIsLoadingDescription(true);
    try {
      const response = await axios.post("/api/openai", {
        imageUrl: image.src,
      });
      setImageDescription(response.data.description);
    } catch (error) {
      console.error("Error getting image description:", error);
      alert("Failed to get image description");
    } finally {
      setIsLoadingDescription(false);
    }
  };
  return (
    <div className="text-center mb-6">
      <Button
        onClick={getImageDescription}
        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-6 px-6 rounded-full text-lg inline-flex items-center gap-2 shadow-lg mb-4 transition-transform hover:scale-105"
        disabled={isLoadingDescription}
      >
        <FileText className="w-5 h-5" />
        {isLoadingDescription
          ? "Getting Description..."
          : "Get Image Description"}
      </Button>

      {imageDescription && (
        <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-lg">
          <p className="text-lg text-gray-700">{imageDescription}</p>
        </div>
      )}
    </div>
  );
}
