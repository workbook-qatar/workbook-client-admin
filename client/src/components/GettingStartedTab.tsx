
import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  PlayCircle, 
  Settings, 
  CreditCard, 
  Users, 
  Bell, 
  Shield, 
  Smartphone,
  HelpCircle,
  BookOpen,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function GettingStartedTab() {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(15);

  const steps = [
    {
      id: "org-details",
      title: "Add Organization Details",
      status: "completed",
      description: "Add your organization's address to Workbook to auto-populate them in invoices and bookings. Also, add users to provide access to your employees.",
      actions: [
        { label: "Edit Organization Profile", href: "/settings/organization" },
        { label: "Invite Users", href: "/settings/users" }
      ]
    },
    {
      id: "workforce",
      title: "Set up Workforce",
      status: "current",
      description: "Add your drivers, technicians, and back-office staff. Define their roles, skills, and working hours to start assigning jobs efficiently.",
      actions: [
        { label: "Add Staff Member", href: "/workforce" },
        { label: "Import from CSV", href: "/workforce/import" }
      ]
    },
    {
      id: "services",
      title: "Create Service Catalog",
      status: "pending",
      description: "Define the services you offer, including pricing, duration, and required skills. This forms the backbone of your booking system.",
      actions: [
        { label: "Add Service", href: "/services" },
        { label: "Configure Categories", href: "/services/categories" }
      ]
    },
    {
      id: "dispatch",
      title: "Configure Dispatch Rules",
      status: "pending",
      description: "Set up automation rules for task assignment based on location, skills, and availability to optimize your operations.",
      actions: [
        { label: "Set up Rules", href: "/dispatch/rules" },
        { label: "View Territory Map", href: "/settings/territories" }
      ]
    }
  ];

  const features = [
    {
      icon: CreditCard,
      title: "Connect with Payment Gateways",
      description: "Integrate with Stripe or PayPal to collect payments faster from your customers.",
      linkText: "Configure Payments",
      extra: "Stripe / PayPal"
    },
    {
      icon: Users,
      title: "Enable Customer Portals",
      description: "Allow your customers to book services, track status, and view invoices online.",
      linkText: "Set up Portal"
    },
    {
      icon: Bell,
      title: "Set up Notifications",
      description: "Configure automated email and SMS reminders for bookings and staff updates.",
      linkText: "Configure Alerts"
    },
    {
      icon: Shield,
      title: "Configure Roles & Permissions",
      description: "Secure your data by defining granular access controls for your team members.",
      linkText: "Manage Roles"
    }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Welcome to Workbook <a href="#" className="text-sm font-normal text-blue-600 hover:underline flex items-center gap-1"><PlayCircle className="w-4 h-4"/> Overview of Workbook</a>
        </h1>
        <p className="text-gray-500">The complete operating system for your service business that you can set up in no time!</p>
      </div>

      {/* Main Success Checklist Card */}
      <Card className="border shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
             <h2 className="font-semibold text-lg">Let's get you up and running</h2>
             <div className="flex items-center gap-4">
                <Progress value={progress} className="w-48 h-2" />
                <span className="text-sm font-medium text-blue-600">{progress}% Completed</span>
             </div>
          </div>
          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Is this too hard? Get Help</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[300px]">
          {/* Left Sidebar: Steps List */}
          <div className="md:col-span-4 border-r border-gray-100 bg-white py-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left px-6 py-4 flex items-center gap-3 transition-colors relative ${
                  activeStep === index ? "bg-blue-50/50" : "hover:bg-gray-50"
                }`}
              >
                {activeStep === index && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className={`shrink-0 ${step.status === 'completed' ? 'text-green-500' : 'text-gray-300'}`}>
                   {step.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <span className={`text-sm font-medium ${activeStep === index ? "text-blue-700" : "text-gray-600"}`}>
                  {step.title}
                </span>
              </button>
            ))}
          </div>

          {/* Right Content: Details */}
          <div className="md:col-span-8 p-8 flex flex-col justify-center">
             <div className="max-w-xl space-y-6">
                <h3 className="text-xl font-bold text-gray-900">{steps[activeStep].title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {steps[activeStep].description}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                   {steps[activeStep].actions.map((action, i) => (
                     <Button key={i} variant="link" className="p-0 h-auto text-blue-600 font-semibold hover:no-underline hover:text-blue-700 flex items-center gap-1 group">
                        {action.label} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {i < steps[activeStep].actions.length - 1 && <span className="text-gray-300 mx-3 font-light">|</span>}
                     </Button>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </Card>

      {/* Explore Features Grid */}
      <div className="space-y-6">
         <h3 className="text-lg font-bold text-gray-900">Explore useful features and set up Workbook</h3>
         <p className="text-gray-500 -mt-4">Your journey to effortlessly manage your operations starts here.</p>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
               <Card key={i} className="hover:shadow-md transition-shadow border-gray-200">
                  <CardContent className="p-6 flex items-start gap-5">
                     <div className="p-3 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                        <feature.icon className="w-6 h-6" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                        {feature.extra && <div className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded w-fit text-gray-600 mt-2">{feature.extra}</div>}
                        <div className="pt-3 flex items-center gap-4">
                           <a href="#" className="text-sm font-medium text-blue-600 hover:underline">{feature.linkText}</a>
                           <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"><PlayCircle className="w-3 h-3"/> Watch & Learn</a>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>

      <Separator className="my-10" />

      {/* Footer / Mobile App Promo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
         {/* Mobile App */}
         <div className="space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
               <Smartphone className="w-5 h-5 text-gray-400" /> Account on the go!
            </h4>
            <p className="text-sm text-gray-500">
               Download the Workbook app for Android and iOS to manage your operations from anywhere, anytime!
            </p>
            <div className="flex gap-4 items-center pt-2">
               <div className="w-24 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
                  QR Code
               </div>
               <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">App Store</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-xs">Google Play</Button>
               </div>
            </div>
         </div>

         {/* Support */}
         <div className="space-y-4">
             <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Help & Support</h4>
             <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Contact Support</a></li>
                <li><a href="#" className="hover:text-blue-600">Knowledge Base</a></li>
                <li><a href="#" className="hover:text-blue-600">Webinars</a></li>
                <li><a href="#" className="hover:text-blue-600">API Documentation</a></li>
             </ul>
         </div>

         {/* Quick Links */}
         <div className="space-y-4">
             <h4 className="font-bold text-gray-900 uppercase text-xs tracking-wider">Quick Links</h4>
             <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Getting Started Guide</a></li>
                <li><a href="#" className="hover:text-blue-600">Mobile Apps</a></li>
                <li><a href="#" className="hover:text-blue-600">What's New?</a></li>
             </ul>
         </div>
      </div>
      
      <div className="flex items-center justify-center pt-10 pb-4 text-gray-400 text-sm gap-2">
         <HelpCircle className="w-4 h-4" /> You can directly talk to us every Sunday to Friday 9:00 AM to 6:00 PM
      </div>
    </div>
  );
}
