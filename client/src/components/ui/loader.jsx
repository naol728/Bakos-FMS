import React from "react";

export const LoaderTwo = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
      <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
    </div>
  );
};
