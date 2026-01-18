
import React from "react";
import { 
  ExternalLink,
  BookOpen,
  Youtube,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function RecentUpdatesTab() {
  const updates = [
    {
      date: "30 October 2025",
      title: "New Dashboard Experience",
      description: "We've completely redesigned the dashboard to give you better visibility into your daily operations. You can now see real-time booking stats, staff availability, and revenue snapshots at a glance.",
      link: "#"
    },
    {
      date: "25 October 2025",
      title: "Mobile App Offline Support",
      description: "Field staff can now access their job details and complete checklists even without an internet connection. Changes will sync automatically once they are back online.",
      link: "#"
    },
    {
      date: "20 October 2025",
      title: "Enhanced Dispatch Rules",
      description: "You can now create more granular dispatch rules based on technician skills and territory. This ensures the right person is assigned to every job tailored to their expertise.",
      link: "#"
    },
    {
      date: "15 October 2025",
      title: "Bulk Staff Import",
      description: "Onboarding a large team? Use our new CSV import tool to add hundreds of staff members, including their details and skills, in just a few clicks.",
      link: "#"
    },
    {
      date: "01 October 2025",
      title: "Customer Portal 2.0",
      description: "A fresh look for your customers! They can now track their service status in real-time on a map and rate their experience directly from the portal.",
      link: "#"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Left Column: Timeline */}
      <div className="flex-1 w-full space-y-12">
         {/* Vertical Guide Line Container */}
         <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6 pb-12 space-y-16">
            {updates.map((update, i) => (
               <div key={i} className="relative pl-8 md:pl-12">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white ${i === 0 ? 'border-blue-500 bg-blue-500' : 'border-blue-300'}`}></div>
                  
                  {/* Content */}
                  <div className="flex flex-col gap-2">
                     <span className="text-sm text-gray-400 font-medium">{update.date}</span>
                     <h3 className="text-xl font-bold text-gray-900">{update.title}</h3>
                     <p className="text-gray-600 leading-relaxed text-base">
                        {update.description}
                     </p>
                     <a href={update.link} className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center gap-1 w-fit">
                        Learn more <ExternalLink className="w-3 h-3" />
                     </a>
                  </div>
               </div>
            ))}
         </div>
         
         <div className="text-center pt-4">
            <Button variant="outline" className="text-gray-500">Load More Updates</Button>
         </div>
      </div>

      {/* Right Column: Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-6 sticky top-6">
         
         {/* Help Resources Card */}
         <Card className="border shadow-sm overflow-hidden bg-white">
            <div className="bg-blue-50/50 p-6 flex justify-center">
                {/* Illustration Placeholder */}
                <BookOpen className="w-16 h-16 text-blue-200" />
            </div>
            <CardContent className="p-6 space-y-4">
               <h6 className="text-blue-500 font-bold text-xs tracking-wider uppercase flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Help Resources
               </h6>
               <h4 className="font-bold text-gray-900">Want to understand how Workbook works?</h4>
               <p className="text-sm text-gray-500">
                  Read our help resources to understand Workbook in-depth and how you can make the most of the features.
               </p>
               <div className="flex items-center gap-4 pt-2">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Visit Help Doc</Button>
                  <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 flex items-center gap-1">FAQ <ExternalLink className="w-3 h-3"/></a>
               </div>
            </CardContent>
         </Card>

         {/* Video Tutorials Card */}
         <Card className="border shadow-sm overflow-hidden bg-white">
             <CardContent className="p-6 space-y-4">
                <h6 className="text-red-500 font-bold text-xs tracking-wider uppercase flex items-center gap-2">
                   <Youtube className="w-3 h-3" /> Video Tutorials
                </h6>
                <p className="text-sm text-gray-500">
                   Visit our YouTube channel and watch the videos and webinars to learn everything about Workbook.
                </p>
                <a href="#" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-2">
                   Go To YouTube Channel <ExternalLink className="w-3 h-3" />
                </a>
             </CardContent>
         </Card>

         <div className="flex justify-end">
            <Button variant="ghost" size="sm" className="text-gray-400 gap-2 border border-gray-200 bg-white shadow-sm">
                <span className="text-xs">Need Assistance?</span> <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </Button>
         </div>

      </div>
    </div>
  );
}
