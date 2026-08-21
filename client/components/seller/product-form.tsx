"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().positive("Price must be a positive number."),
  salePrice: z.coerce.number().min(0, "Sale price cannot be negative.").optional(),
  sku: z.string().min(3, "SKU must be at least 3 characters."),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  status: z.enum(["ACTIVE", "DRAFT"]),
}).refine((data) => {
  if (data.salePrice && data.salePrice >= data.price) {
    return false;
  }
  return true;
}, {
  message: "Sale price must be lower than regular price.",
  path: ["salePrice"],
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      sku: "",
      status: "ACTIVE",
      price: 0,
      stock: 0,
      salePrice: 0,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (images.length === 0) {
      toast.error("Please upload at least one product image.");
      return;
    }
    console.log("Product Submitted:", data, images);
    toast.success("Product created successfully!");
    router.push("/seller/products");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">General Information</h2>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Premium Wireless Headphones" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={5}
                        placeholder="Describe your product in detail..."
                        className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regular Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank if no sale.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-12345" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Media & Publish */}
        <div className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Product Media</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload image</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
              
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                      <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Publish Status</h2>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="status-active"
                          value="ACTIVE"
                          checked={field.value === "ACTIVE"}
                          onChange={() => field.onChange("ACTIVE")}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="status-active" className="cursor-pointer">Active</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="status-draft"
                          value="DRAFT"
                          checked={field.value === "DRAFT"}
                          onChange={() => field.onChange("DRAFT")}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label htmlFor="status-draft" className="cursor-pointer">Draft</Label>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="mt-8 flex flex-col gap-3">
              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Save Product</Button>
              <Button type="button" variant="outline" onClick={() => router.back()} className="w-full border-slate-200 dark:border-slate-700">Discard Changes</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
