import React from 'react';

interface LoadingSpinnerProps {
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ label = 'Loading' }) => {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-5">
      <div className="relative h-12 w-12">
        {/* Track */}
        <div className="absolute inset-0 rounded-full border-2 border-white/10" />
        {/* Spinning arc */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-sky-400 border-r-sky-400/50" />
        {/* Inner glow dot */}
        <div className="absolute inset-[35%] rounded-full bg-sky-400/20 blur-[2px]" />
      </div>
      {label && (
        <p className="animate-pulse text-sm tracking-wide text-neutral-500">{label}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
