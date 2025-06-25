import { Component, ReactNode } from "react";

// Global error boundary for catching UI errors gracefully.
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  error: unknown;
}
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error: error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 border shadow bg-white rounded">
          <h2 className="font-bold text-red-700 text-lg mb-2">Something went wrong</h2>
          <pre className="bg-gray-100 text-xs p-2 rounded text-red-800">
            {String(this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
