import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "#E8340A", fontFamily: "Anuphan" }}>เกิดข้อผิดพลาด</h2>
          <p style={{ fontFamily: "Bai Jamjuree", color: "#1A1207" }}>
            กรุณารีเฟรชหน้าเว็บ
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#00754b",
              color: "white",
              border: "2px solid #12201a",
              borderRadius: "999px",
              fontFamily: "Anuphan",
              cursor: "pointer"
            }}
          >
            รีเฟรช
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
