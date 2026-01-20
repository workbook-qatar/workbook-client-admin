import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

// Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  role: "admin" | "supervisor" | "staff";
  isDefault: boolean;
  status: "active" | "suspended" | "pending";
  logoUrl?: string;
  features: string[];
  setupComplete: boolean;
  createdAt: string;
  edition: string; // e.g., "Premium Trial", "Zoho One" equivalent
  location: string;
  industry?: string; 
}

interface OrganizationContextType {
  activeOrganization: Organization | null;
  availableOrganizations: Organization[];
  isLoading: boolean;
  switchOrganization: (orgId: string) => void;
  createOrganization: (data: Partial<Organization>) => Promise<void>;
  updateOrganization: (orgId: string, data: Partial<Organization>) => void;
  deleteOrganization: (orgId: string) => void;
  markAsDefault: (orgId: string) => void;
}

// Mock Data
const MOCK_ORGS: Organization[] = [
  {
    id: "12587",
    name: "Tartoos Contracting and Cleaning Services",
    slug: "tartoos-main",
    role: "admin",
    isDefault: true,
    status: "active",
    features: ["accounting", "inventory", "crm"],
    setupComplete: true,
    createdAt: "2023-10-01",
    edition: "Enterprise",
    location: "Qatar",
    logoUrl: "/tartoos-logo.jpg",
  },
  {
    id: "14920",
    name: "Tartoos Hospitality & Events",
    slug: "tartoos-hospitality",
    role: "admin",
    isDefault: false,
    status: "active",
    features: ["accounting"],
    setupComplete: true,
    createdAt: "2024-03-15",
    edition: "Premium",
    location: "Qatar",
    logoUrl: "/tartoos-logo.jpg",
  },
  {
    id: "15003",
    name: "Tartoos Facility Management",
    slug: "tartoos-facility",
    role: "supervisor",
    isDefault: false,
    status: "active",
    features: ["reports"],
    setupComplete: true,
    createdAt: "2025-01-10",
    edition: "Standard",
    location: "UAE",
    logoUrl: "/tartoos-logo.jpg",
  },
];

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [availableOrganizations, setAvailableOrganizations] =
    useState<Organization[]>(MOCK_ORGS);
  const [activeOrganization, setActiveOrganization] =
    useState<Organization | null>(MOCK_ORGS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  // Simulate initial load
  useEffect(() => {
    // In a real app, we would fetch from API/Local Storage here
    const savedOrgId = localStorage.getItem("active_org_id");
    if (savedOrgId) {
      const savedOrg = availableOrganizations.find(o => o.id === savedOrgId);
      if (savedOrg) setActiveOrganization(savedOrg);
    }

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const switchOrganization = (orgId: string) => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      const org = availableOrganizations.find(o => o.id === orgId);
      if (org) {
        setActiveOrganization(org);
        localStorage.setItem("active_org_id", orgId);
        toast.success(`Switched to ${org.name}`);
        // Optionally redirect to dashboard or preserve route
        setLocation("/");
      }
      setIsLoading(false);
    }, 600);
  };

  const createOrganization = async (data: Partial<Organization>) => {
    setIsLoading(true);
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const newOrg: Organization = {
          id: `org_${Math.random().toString(36).substr(2, 9)}`,
          name: data.name || "New Organization",
          slug: (data.name || "new-org").toLowerCase().replace(/\s+/g, "-"),
          role: "admin", // Creator is always admin
          isDefault: false,
          status: "active",
          features: ["accounting"], // Default features
          setupComplete: false,
          createdAt: new Date().toISOString().split("T")[0],
          edition: "Free Plan",
          location: data.location || "Qatar",
          ...data,
        };

        setAvailableOrganizations([...availableOrganizations, newOrg]);
        setActiveOrganization(newOrg); // Auto-switch
        localStorage.setItem("active_org_id", newOrg.id);

        toast.success("Organization created successfully!");
        resolve();
        setIsLoading(false);
      }, 1500);
    });
  };

  const updateOrganization = (orgId: string, data: Partial<Organization>) => {
    setAvailableOrganizations(prev =>
      prev.map(org => (org.id === orgId ? { ...org, ...data } : org))
    );
    if (activeOrganization?.id === orgId) {
      setActiveOrganization(prev => (prev ? { ...prev, ...data } : null));
    }
    toast.success("Organization updated");
  };

  const deleteOrganization = (orgId: string) => {
    if (orgId === activeOrganization?.id) {
      toast.error("Cannot delete the active organization. Switch first.");
      return;
    }
    setAvailableOrganizations(prev => prev.filter(o => o.id !== orgId));
    toast.success("Organization deleted");
  };

  const markAsDefault = (orgId: string) => {
    setAvailableOrganizations(prev =>
      prev.map(org => ({
        ...org,
        isDefault: org.id === orgId,
      }))
    );
    toast.success("Default organization updated");
  };

  return (
    <OrganizationContext.Provider
      value={{
        activeOrganization,
        availableOrganizations,
        isLoading,
        switchOrganization,
        createOrganization,
        updateOrganization,
        deleteOrganization,
        markAsDefault,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
};
