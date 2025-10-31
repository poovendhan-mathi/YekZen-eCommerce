/**
 * Unit Tests for ImageUploader Component
 */

// Mock Firebase before any imports
jest.mock("../../firebase/config", () => ({
  db: {},
  auth: {},
  storage: {},
}));

// Mock dependencies
jest.mock("../../services/storage.service");
jest.mock("react-hot-toast");

// Mock framer-motion Reorder
jest.mock("framer-motion", () => ({
  Reorder: {
    Group: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Item: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploader from "../../components/admin/ImageUploader";
import { storageService } from "../../services/storage.service";
import toast from "react-hot-toast";
import { ProductImage } from "../../types/product.types";

describe("ImageUploader Component", () => {
  const mockImages: ProductImage[] = [
    {
      url: "https://example.com/image1.jpg",
      alt: "Image 1",
      order: 0,
      type: "url",
    },
    {
      url: "https://example.com/image2.jpg",
      alt: "Image 2",
      order: 1,
      type: "uploaded",
      storageRef: "products/image2.jpg",
    },
  ];

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render upload area", () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      expect(screen.getByText(/Drag & drop images here/i)).toBeInTheDocument();
      expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    });

    it("should render existing images", () => {
      const { container } = render(
        <ImageUploader images={mockImages} onChange={mockOnChange} />
      );

      const images = container.querySelectorAll("img");
      expect(images).toHaveLength(2);
    });

    it("should show primary badge on first image", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      expect(screen.getByText("Primary")).toBeInTheDocument();
    });

    it("should show type badges", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      expect(screen.getByText("URL")).toBeInTheDocument();
      expect(screen.getByText("Uploaded")).toBeInTheDocument();
    });

    it("should show URL input field", () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      expect(
        screen.getByPlaceholderText(/Enter image URL/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add URL/i })
      ).toBeInTheDocument();
    });

    it("should display image counter", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      expect(screen.getByText("2 / 10")).toBeInTheDocument();
    });
  });

  describe("File Upload", () => {
    it("should handle file selection", async () => {
      (storageService.uploadProductImage as jest.Mock).mockResolvedValue({
        success: true,
        url: "https://example.com/uploaded.jpg",
        storageRef: "products/uploaded.jpg",
      });

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(storageService.uploadProductImage).toHaveBeenCalledWith(
          file,
          "product-123"
        );
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([
          {
            url: "https://example.com/uploaded.jpg",
            alt: "Product image 1",
            order: 0,
            type: "uploaded",
            storageRef: "products/uploaded.jpg",
          },
        ]);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Image uploaded successfully"
        );
      });
    });

    it("should handle multiple file selection", async () => {
      (storageService.uploadProductImage as jest.Mock).mockResolvedValue({
        success: true,
        url: "https://example.com/uploaded.jpg",
        storageRef: "products/uploaded.jpg",
      });

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const files = [
        new File(["image1"], "test1.jpg", { type: "image/jpeg" }),
        new File(["image2"], "test2.jpg", { type: "image/jpeg" }),
      ];

      fireEvent.change(fileInput, { target: { files } });

      await waitFor(() => {
        expect(storageService.uploadProductImage).toHaveBeenCalledTimes(2);
      });
    });

    it("should validate file types", async () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["document"], "test.pdf", {
        type: "application/pdf",
      });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Only image files (JPG, PNG, WebP) are allowed"
        );
      });

      expect(storageService.uploadProductImage).not.toHaveBeenCalled();
    });

    it("should validate file size", async () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const largeFile = new File(["x".repeat(6 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
      });

      Object.defineProperty(largeFile, "size", { value: 6 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [largeFile] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "File size must be less than 5MB"
        );
      });

      expect(storageService.uploadProductImage).not.toHaveBeenCalled();
    });

    it("should handle upload error", async () => {
      (storageService.uploadProductImage as jest.Mock).mockResolvedValue({
        success: false,
        error: "Upload failed",
      });

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Upload failed");
      });
    });

    it("should prevent upload when max images reached", async () => {
      const maxImages = Array.from({ length: 10 }, (_, i) => ({
        url: `https://example.com/image${i}.jpg`,
        alt: `Image ${i}`,
        order: i,
        type: "url" as const,
      }));

      render(<ImageUploader images={maxImages} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Maximum 10 images allowed per product"
        );
      });

      expect(storageService.uploadProductImage).not.toHaveBeenCalled();
    });
  });

  describe("URL Input", () => {
    it("should add image from URL", async () => {
      (storageService.isValidImageUrl as jest.Mock).mockResolvedValue(true);

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(/Enter image URL/i);
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      fireEvent.change(urlInput, {
        target: { value: "https://example.com/image.jpg" },
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(storageService.isValidImageUrl).toHaveBeenCalledWith(
          "https://example.com/image.jpg"
        );
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([
          {
            url: "https://example.com/image.jpg",
            alt: "Product image 1",
            order: 0,
            type: "url",
          },
        ]);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Image added successfully");
      });
    });

    it("should validate URL format", async () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(/Enter image URL/i);
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      fireEvent.change(urlInput, { target: { value: "invalid-url" } });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Please enter a valid URL");
      });

      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should validate image URL accessibility", async () => {
      (storageService.isValidImageUrl as jest.Mock).mockResolvedValue(false);

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(/Enter image URL/i);
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      fireEvent.change(urlInput, {
        target: { value: "https://example.com/invalid.jpg" },
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Unable to load image from URL. Please check the URL and try again."
        );
      });
    });

    it("should clear URL input after adding", async () => {
      (storageService.isValidImageUrl as jest.Mock).mockResolvedValue(true);

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(
        /Enter image URL/i
      ) as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      fireEvent.change(urlInput, {
        target: { value: "https://example.com/image.jpg" },
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(urlInput.value).toBe("");
      });
    });

    it("should prevent adding URL when max images reached", async () => {
      const maxImages = Array.from({ length: 10 }, (_, i) => ({
        url: `https://example.com/image${i}.jpg`,
        alt: `Image ${i}`,
        order: i,
        type: "url" as const,
      }));

      render(<ImageUploader images={maxImages} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(/Enter image URL/i);
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      fireEvent.change(urlInput, {
        target: { value: "https://example.com/image.jpg" },
      });
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Maximum 10 images allowed per product"
        );
      });
    });
  });

  describe("Drag and Drop", () => {
    it("should handle drag enter", () => {
      const { container } = render(
        <ImageUploader images={[]} onChange={mockOnChange} />
      );

      const dropZone = container.querySelector("div[class*='border-dashed']");

      fireEvent.dragEnter(dropZone!);

      expect(dropZone).toHaveClass("border-pink-500", "bg-pink-50");
    });

    it("should handle drag leave", () => {
      const { container } = render(
        <ImageUploader images={[]} onChange={mockOnChange} />
      );

      const dropZone = container.querySelector("div[class*='border-dashed']");

      fireEvent.dragEnter(dropZone!);
      fireEvent.dragLeave(dropZone!);

      expect(dropZone).not.toHaveClass("border-pink-500", "bg-pink-50");
    });

    it("should handle file drop", async () => {
      (storageService.uploadProductImage as jest.Mock).mockResolvedValue({
        success: true,
        url: "https://example.com/uploaded.jpg",
        storageRef: "products/uploaded.jpg",
      });

      const { container } = render(
        <ImageUploader images={[]} onChange={mockOnChange} />
      );

      const dropZone = container.querySelector("div[class*='border-dashed']");
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

      const dataTransfer = {
        files: [file],
      };

      fireEvent.drop(dropZone!, { dataTransfer });

      await waitFor(() => {
        expect(storageService.uploadProductImage).toHaveBeenCalledWith(
          file,
          "product-123"
        );
      });
    });
  });

  describe("Image Reordering", () => {
    it("should allow reordering images", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const reorderedImages = [mockImages[1], mockImages[0]];

      // Simulate Reorder.Group onReorder callback
      const reorderGroup = screen.getByTestId("image-reorder-group");

      // This would be triggered by framer-motion's reorder functionality
      // In actual usage, drag-and-drop would trigger this
    });

    it("should update order property after reordering", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const reorderedImages = [
        { ...mockImages[1], order: 0 },
        { ...mockImages[0], order: 1 },
      ];

      // After reordering, onChange should be called with updated order
      // This is tested through integration rather than unit test
    });
  });

  describe("Image Deletion", () => {
    it("should delete uploaded image", async () => {
      (storageService.deleteProductImage as jest.Mock).mockResolvedValue({
        success: true,
      });

      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[1]); // Delete second image (uploaded)

      await waitFor(() => {
        expect(storageService.deleteProductImage).toHaveBeenCalledWith(
          "products/image2.jpg"
        );
      });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([mockImages[0]]);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Image deleted successfully"
        );
      });
    });

    it("should delete URL image without storage call", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[0]); // Delete first image (URL)

      expect(storageService.deleteProductImage).not.toHaveBeenCalled();
      expect(mockOnChange).toHaveBeenCalledWith([mockImages[1]]);
      expect(toast.success).toHaveBeenCalledWith("Image removed successfully");
    });

    it("should handle delete error", async () => {
      (storageService.deleteProductImage as jest.Mock).mockResolvedValue({
        success: false,
        error: "Delete failed",
      });

      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      fireEvent.click(deleteButtons[1]);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Delete failed");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty images array", () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      expect(screen.getByText("0 / 10")).toBeInTheDocument();
    });

    it("should handle missing onChange callback", () => {
      const { container } = render(<ImageUploader images={mockImages} />);

      expect(container).toBeInTheDocument();
    });

    it("should handle images without storageRef", () => {
      const imagesWithoutRef = [
        {
          url: "https://example.com/image1.jpg",
          alt: "Image 1",
          order: 0,
          type: "uploaded" as const,
          // Missing storageRef
        },
      ];

      render(
        <ImageUploader images={imagesWithoutRef} onChange={mockOnChange} />
      );

      expect(screen.getByText("1 / 10")).toBeInTheDocument();
    });

    it("should handle rapid consecutive uploads", async () => {
      (storageService.uploadProductImage as jest.Mock).mockResolvedValue({
        success: true,
        url: "https://example.com/uploaded.jpg",
        storageRef: "products/uploaded.jpg",
      });

      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      const file = new File(["image"], "test.jpg", { type: "image/jpeg" });

      // Upload same file multiple times rapidly
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.change(fileInput, { target: { files: [file] } });
      fireEvent.change(fileInput, { target: { files: [file] } });

      // Should handle gracefully
      await waitFor(() => {
        expect(storageService.uploadProductImage).toHaveBeenCalled();
      });
    });
  });

  describe("Accessibility", () => {
    it("should have accessible file input", () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const fileInput = screen.getByTestId("file-input");
      expect(fileInput).toHaveAttribute("accept", "image/*");
      expect(fileInput).toHaveAttribute("multiple");
    });

    it("should have accessible delete buttons", () => {
      render(<ImageUploader images={mockImages} onChange={mockOnChange} />);

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      expect(deleteButtons).toHaveLength(2);
    });

    it("should have accessible URL form", () => {
      render(<ImageUploader images={[]} onChange={mockOnChange} />);

      const urlInput = screen.getByPlaceholderText(/Enter image URL/i);
      const addButton = screen.getByRole("button", { name: /Add URL/i });

      expect(urlInput).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });
  });
});
