import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import ErrorPage from "../../Pages/auth/ErrorPage";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  // componentDidCatch(error: Error, info: any) {
  //   console.error("React Error Caught:", error, info);
  // }
  componentDidCatch(error: Error, info: ErrorInfo) {
  console.error("React Error Caught:", error, info);
}

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
            <ErrorPage error={this.state.error?.message} />
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
