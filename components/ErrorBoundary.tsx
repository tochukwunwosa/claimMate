'use client';

import React, { ReactNode } from 'react';
import { Button } from './ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // The error parameter is prefixed with underscore to indicate it's intentionally unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // send this to a logging service
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload(); // Reload the page to reset the app state
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className='relative w-screen h-screen flex items-center justify-center flex-col'>
          {/* bg white overlay */}
          <div className="absolute inset-0 bg-gradient-to-b !from-foreground/98 !to-foreground/98 dark:!from-background/98 dark:!to-background/98" />
          <div className='relative z-10 text-center'>
            <h2 className="text-lg font-semibold">Oops! Something went wrong.</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sorry, the error is from us!
            </p>
            <Button
              variant="outline"
              onClick={this.handleReset}
              className="cursor-pointer mt-4 hover:scale-[1.02] transition"
            >
              Try again?
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
