import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F6F0E4',
            color: '#3D291A',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(63, 13, 18, 0.08)',
              border: '1px solid rgba(213, 191, 134, 0.4)',
              padding: '32px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'rgba(167, 29, 49, 0.1)',
                color: '#A9D6F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '28px'
              }}
            >
              ⚠
            </div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#3D291A',
                marginBottom: '8px'
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#846752',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}
            >
              The application encountered an unexpected error while loading this view. You can reload the page or return to the main dashboard.
            </p>
            {this.state.error?.message && (
              <pre
                style={{
                  backgroundColor: '#F7F7F2',
                  border: '1px solid #E8E5D8',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#A9D6F5',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '24px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}
              >
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#A9D6F5',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#F6F0E4',
                  color: '#3D291A',
                  border: '1px solid #E5DACB',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

