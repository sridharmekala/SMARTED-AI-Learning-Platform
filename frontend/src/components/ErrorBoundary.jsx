import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      message: ''
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error.message
    };
  }

  componentDidCatch(error) {
    console.error('SMARTED frontend error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-shell">
          <section className="page-card error-card">
            <h1>SMARTED frontend error</h1>
            <p>{this.state.message}</p>
            <p>Open browser DevTools Console for the full error details.</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
