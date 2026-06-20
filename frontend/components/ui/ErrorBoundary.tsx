"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { LucideAlertTriangle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by EcoSphere ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-xl mx-auto my-12 flex flex-col items-center gap-3">
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <LucideAlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="font-display text-md font-bold text-red-800">Something went wrong</h2>
          <p className="text-xs text-red-600 max-w-sm leading-relaxed">
            The application encountered a critical runtime exception.
          </p>
          <pre className="text-[10px] font-mono bg-white border border-red-100 p-3 rounded text-left max-w-full overflow-x-auto text-red-700">
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-800 text-white text-xs font-semibold rounded-full hover:bg-red-900 transition-smooth"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
