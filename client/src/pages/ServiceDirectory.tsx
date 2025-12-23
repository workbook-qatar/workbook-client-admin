
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Plus, Zap, Check } from "lucide-react";
import { PRESET_CATEGORIES } from "@/data/service-presets";
import { toast } from "sonner";

export default function ServiceDirectory() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(PRESET_CATEGORIES[0]?.id || null);
  const [addedPackages, setAddedPackages] = useState<Set<string>>(new Set());

  // Helper to load existing added packages to show "Added" state
  useState(() => {
    try {
        const stored = localStorage.getItem("vendor_packages");
        if (stored) {
            const parsed = JSON.parse(stored);
            const ids = new Set(parsed.map((p:any) => p.id));
            setAddedPackages(ids);
        }
    } catch {
        // ignore
    }
  });

  const activeCategory = PRESET_CATEGORIES.find(c => c.id === selectedCategory);

  const handleAddPackage = (pkg: any, category: any) => {
    try {
        const stored = localStorage.getItem("vendor_packages");
        const currentPackages = stored ? JSON.parse(stored) : [];
        
        // Transform preset package to full package object
        const newPackage = {
            ...pkg,
            categoryId: category.id,
            status: 'active',
            staffReq: 1,
            desc: category.description,
            serviceAreas: [], // Standard packages need area config
            isPreset: true
        };

        const updatedPackages = [...currentPackages, newPackage];
        localStorage.setItem("vendor_packages", JSON.stringify(updatedPackages));
        
        setAddedPackages(prev => new Set(prev).add(pkg.id));
        toast.success(`"${pkg.name}" added to your services`);
    } catch (e) {
        toast.error("Failed to add package");
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-gray-50/50">
        
        {/* Header */}
        <div className="px-8 py-5 border-b bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
                 <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocation("/services")}
                  className="rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        Service Directory
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1.5 font-normal">
                             <Zap className="h-3 w-3 fill-amber-700" />
                             Official Templates
                        </Badge>
                    </h1>
                    <p className="text-sm text-gray-500">Browse and add standard industry packages to your catalog</p>
                </div>
            </div>
            <div>
                 <Button variant="outline" onClick={() => setLocation("/services")}>
                    Done
                 </Button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-8">
            <div className="max-w-[1600px] mx-auto h-full flex gap-6">
                
                {/* Sidebar: Categories */}
                <Card className="w-[300px] flex-none h-full overflow-hidden flex flex-col bg-white border-gray-200">
                    <div className="p-4 bg-gray-50/50 border-b font-semibold text-sm text-gray-700">
                        Categories
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {PRESET_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`w-full text-left px-3 py-3 rounded-lg text-sm mb-1 flex items-center justify-between group transition-all ${
                                    selectedCategory === cat.id 
                                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' 
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`font-medium ${selectedCategory === cat.id ? 'text-blue-900' : ''}`}>{cat.name}</span>
                                </div>
                                <div className="text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full border shadow-sm">
                                    {cat.packages.length}
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Main: Packages */}
                <div className="flex-1 overflow-y-auto">
                    {activeCategory ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{activeCategory.name}</h2>
                                    <p className="text-sm text-gray-500">{activeCategory.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                {activeCategory.packages.map(pkg => {
                                    const isAdded = addedPackages.has(pkg.id);
                                    
                                    return (
                                        <Card key={pkg.id} className="p-5 border-gray-200 hover:border-blue-200 transition-all hover:shadow-md group relative overflow-hidden">
                                            {isAdded && (
                                                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-medium shadow-sm">
                                                    ADDED
                                                </div>
                                            )}
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="font-mono text-[10px] text-gray-400 border-gray-200">
                                                            {pkg.code}
                                                        </Badge>
                                                        {pkg.materials && (
                                                            <Badge variant="secondary" className="text-[10px] h-5 bg-purple-50 text-purple-700 hover:bg-purple-50 border-0">
                                                                + Materials
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="font-semibold text-gray-900 leading-tight mb-2">{pkg.name}</h3>
                                                    
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {pkg.duration}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-gray-900 font-medium">
                                                            <span>QAR {pkg.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-none pt-2">
                                                    {isAdded ? (
                                                        <Button variant="ghost" size="sm" disabled className="gap-2 text-green-600 bg-green-50">
                                                            <Check className="h-4 w-4" />
                                                            Added
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            size="sm" 
                                                            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                                                            onClick={() => handleAddPackage(pkg, activeCategory)}
                                                        >
                                                            Add to Services
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            Select a category to view templates
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
