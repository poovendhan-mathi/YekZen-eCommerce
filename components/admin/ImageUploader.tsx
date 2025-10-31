/**
 * Image Uploader Component for Admin
 * Supports drag-and-drop, URL input, and file upload
 */

"use client";

import { useState, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { ProductImage } from "../../types/product.types";
import { storageService } from "../../services/storage.service";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  productId,
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const result = await storageService.uploadProductImage(
          file,
          productId,
          images.length + index
        );

        if (result.success && result.url) {
          return {
            url: result.url,
            alt: file.name,
            order: images.length + index,
            type: "uploaded" as const,
            storageRef: result.storageRef,
          };
        }
        return null;
      });

      const uploadedImages = (await Promise.all(uploadPromises)).filter(
        (img): img is ProductImage => img !== null
      );

      if (uploadedImages.length > 0) {
        onChange([...images, ...uploadedImages]);
        toast.success(
          `${uploadedImages.length} image(s) uploaded successfully`
        );
      }
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlAdd = () => {
    const url = urlInput.trim();

    if (!url) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (!storageService.isValidImageUrl(url)) {
      toast.error("Please enter a valid image URL");
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImage: ProductImage = {
      url,
      alt: "Product image",
      order: images.length,
      type: "url",
    };

    onChange([...images, newImage]);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("Image URL added successfully");
  };

  const handleRemoveImage = async (index: number) => {
    const image = images[index];

    // Delete from storage if it was uploaded
    if (image.type === "uploaded" && image.storageRef) {
      await storageService.deleteProductImage(image.storageRef);
    }

    const updatedImages = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, order: i }));

    onChange(updatedImages);
    toast.success("Image removed");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images *
          <span className="text-gray-500 font-normal ml-2">
            ({images.length}/{maxImages})
          </span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Upload
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={images.length >= maxImages}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LinkIcon className="w-4 h-4" />
            Add URL
          </button>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2"
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleUrlAdd()}
          />
          <button
            type="button"
            onClick={handleUrlAdd}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add
          </button>
        </motion.div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Image Grid */}
      <Reorder.Group
        axis="x"
        values={images}
        onReorder={onChange}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {images.map((image, index) => (
          <Reorder.Item key={image.url} value={image}>
            <motion.div
              layout
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-all cursor-move"
            >
              <img
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Primary Badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                  Primary
                </div>
              )}

              {/* Type Badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {image.type === "uploaded" ? "Uploaded" : "URL"}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>

              {/* Order Number */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                {index + 1}
              </div>
            </motion.div>
          </Reorder.Item>
        ))}

        {/* Upload Drop Zone */}
        {images.length < maxImages && (
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <>
                <PhotoIcon className="w-12 h-12 text-gray-400" />
                <span className="text-sm text-gray-600 font-medium">
                  Add Image
                </span>
                <span className="text-xs text-gray-500">Drop or click</span>
              </>
            )}
          </div>
        )}
      </Reorder.Group>

      <p className="text-xs text-gray-500">
        💡 Tip: Drag images to reorder. First image will be the primary image.
        Supported formats: JPG, PNG, WebP, GIF (max 5MB each)
      </p>
    </div>
  );
}
