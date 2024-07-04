"use client";

import React from "react";
import { Loader } from "lucide-react";

type LoadingSpinnerProps = {
  text?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="w-full flex justify-center items-center">
      <Loader className="animate-spin h-5 w-5 mr-3" />
      {text && <span>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
