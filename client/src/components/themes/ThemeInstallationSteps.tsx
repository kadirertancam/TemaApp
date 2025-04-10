import React from "react";

export function ThemeInstallationSteps() {
  const steps = [
    "Download the theme package",
    "Open your phone's theme settings",
    "Select \"Install from storage\"",
    "Choose the downloaded theme file",
    "Apply theme and enjoy!"
  ];
  
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-4">
      <h3 className="text-base font-medium mb-2 text-white">Installation Instructions</h3>
      <ol className="text-sm space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="flex">
            <span className="bg-purple-700 text-white rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">
              {index + 1}
            </span>
            <span className="text-gray-200">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ThemeInstallationSteps;
