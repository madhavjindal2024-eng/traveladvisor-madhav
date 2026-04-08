import { Component } from 'react';

/**
 * Catches render errors and shows a calm fallback UI.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(err) {
    console.error(err);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)]">
            Something went wrong
          </p>
          <p className="max-w-md text-sm text-[var(--text-muted)]">
            Refresh the page or return home. The error was logged for debugging.
          </p>
          <a href="/" className="text-[var(--accent-primary)] underline">
            Back to home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
