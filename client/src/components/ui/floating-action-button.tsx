import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingActionItem {
  icon: string;
  label: string;
  color?: string;
  onClick: () => void;
}

interface FloatingActionButtonProps {
  items: FloatingActionItem[];
  className?: string;
}

export function FloatingActionButton({ items, className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };
  
  return (
    <div className={cn("fixed right-4 bottom-20 z-40", className)}>
      <AnimatePresence>
        {isOpen && (
          <div className="mb-2 space-y-2">
            {items.map((item, index) => (
              <motion.button
                key={index}
                className={`flex items-center shadow-lg rounded-full ${
                  item.color || "bg-gray-800"
                } text-white`}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2, delay: 0.05 * (items.length - index) }}
                onClick={() => handleItemClick(item.onClick)}
              >
                <div className="flex items-center pr-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full">
                    <i className={`${item.icon} text-white`}></i>
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>
      
      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-plus"} text-xl`}></i>
      </motion.button>
    </div>
  );
}

export default FloatingActionButton;