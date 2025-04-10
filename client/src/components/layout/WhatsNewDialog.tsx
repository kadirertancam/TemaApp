import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WhatsNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UpdateFeature {
  title: string;
  description: string;
  icon: string;
}

interface Update {
  version: string;
  date: string;
  features: UpdateFeature[];
}

export function WhatsNewDialog({ open, onOpenChange }: WhatsNewDialogProps) {
  // This would typically come from an API
  const updates: Update[] = [
    {
      version: "2.1.0",
      date: "April 5, 2025",
      features: [
        {
          title: "New Filter Options",
          description: "Advanced filtering options for themes based on style, color, and more.",
          icon: "fas fa-filter"
        },
        {
          title: "Improved Theme Details",
          description: "Tabbed interface for better organization of theme information.",
          icon: "fas fa-columns"
        },
        {
          title: "Side Menu Navigation",
          description: "Easy access to all important sections of the app.",
          icon: "fas fa-bars"
        },
        {
          title: "Theme Sharing",
          description: "Share your favorite themes with friends via social media or messaging apps.",
          icon: "fas fa-share-alt"
        }
      ]
    },
    {
      version: "2.0.0",
      date: "March 15, 2025",
      features: [
        {
          title: "User Profiles",
          description: "Create your personal profile to track favorite themes and downloads.",
          icon: "fas fa-user-circle"
        },
        {
          title: "Dark Mode Support",
          description: "Enjoy a comfortable viewing experience in low light environments.",
          icon: "fas fa-moon"
        },
        {
          title: "Performance Improvements",
          description: "Faster loading times and smoother transitions between pages.",
          icon: "fas fa-tachometer-alt"
        }
      ]
    }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">What's New</span>
            <div className="ml-2 px-2 py-0.5 bg-purple-700 text-white text-xs rounded-full">v2.1</div>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Check out the latest features and improvements
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          {updates.map((update, index) => (
            <div key={index} className={`mb-6 ${index > 0 ? 'mt-6 pt-6 border-t border-gray-700' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold">Version {update.version}</h3>
                <span className="text-xs text-gray-400">{update.date}</span>
              </div>
              
              <div className="space-y-3">
                {update.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex">
                    <div className="w-8 h-8 rounded-full bg-purple-700/20 flex items-center justify-center flex-shrink-0 mr-3">
                      <i className={`${feature.icon} text-purple-400`}></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{feature.title}</h4>
                      <p className="text-xs text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </ScrollArea>
        
        <DialogFooter className="flex sm:justify-between border-t border-gray-700 pt-4">
          <Button 
            variant="outline" 
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
            onClick={() => onOpenChange(false)}
          >
            Dismiss
          </Button>
          <a 
            href="#" 
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              onOpenChange(false);
            }}
          >
            View full changelog
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WhatsNewDialog;