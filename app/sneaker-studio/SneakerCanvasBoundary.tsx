"use client";

import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class SneakerCanvasBoundary extends Component<
  Props,
  State
> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Sneaker 3D preview failed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <img
          src="/images/sneaker-fallback.webp"
          alt="Blue athletic sneaker preview. The interactive 3D preview is unavailable."
          style={{
            display: "block",
            width: "100%",
            height: "400px",
            objectFit: "contain",
            backgroundColor: "#f3f4f6",
          }}
        />
      );
    }

    return this.props.children;
  }
}