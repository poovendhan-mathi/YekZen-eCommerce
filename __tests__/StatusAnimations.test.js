import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AnimatedCheckmark,
  AnimatedError,
  AnimatedWarning,
  FormFieldAnimation,
  LoadingButton,
  AnimatedToast,
  NotificationToast,
  AnimatedProgressBar,
  StatusIndicator,
} from "../components/ui/StatusAnimations";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, style, animate, initial, exit, ...props }) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, disabled, onClick, ...props }) => (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    ),
    svg: ({
      children,
      width,
      height,
      viewBox,
      stroke,
      strokeWidth,
      ...props
    }) => (
      <svg
        width={width}
        height={height}
        viewBox={viewBox}
        stroke={stroke}
        strokeWidth={strokeWidth}
        {...props}
      >
        {children}
      </svg>
    ),
    path: ({ d, ...props }) => <path d={d} {...props} />,
    circle: ({ cx, cy, r, ...props }) => (
      <circle cx={cx} cy={cy} r={r} {...props} />
    ),
    line: ({ x1, y1, x2, y2, ...props }) => (
      <line x1={x1} y1={y1} x2={x2} y2={y2} {...props} />
    ),
    span: ({ children, className, ...props }) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock heroicons
jest.mock("@heroicons/react/24/outline", () => ({
  CheckCircleIcon: (props) => <svg data-testid="check-icon" {...props} />,
  XCircleIcon: (props) => <svg data-testid="x-icon" {...props} />,
  ExclamationTriangleIcon: (props) => (
    <svg data-testid="warning-icon" {...props} />
  ),
  InformationCircleIcon: (props) => <svg data-testid="info-icon" {...props} />,
}));

describe("StatusAnimations - AnimatedCheckmark", () => {
  describe("Rendering", () => {
    it("should render checkmark icon", () => {
      const { container } = render(<AnimatedCheckmark />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply custom size", () => {
      const { container } = render(<AnimatedCheckmark size={100} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "100");
      expect(svg).toHaveAttribute("height", "100");
    });

    it("should apply custom color", () => {
      const { container } = render(<AnimatedCheckmark color="blue" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("stroke", "#3b82f6");
    });

    it("should use default values", () => {
      const { container } = render(<AnimatedCheckmark />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "64");
      expect(svg).toHaveAttribute("stroke", "#10b981");
    });

    it("should render path element", () => {
      const { container } = render(<AnimatedCheckmark />);
      expect(container.querySelector("path")).toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - AnimatedError", () => {
  describe("Rendering", () => {
    it("should render error icon", () => {
      const { container } = render(<AnimatedError />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply custom size", () => {
      const { container } = render(<AnimatedError size={80} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "80");
    });

    it("should apply custom color", () => {
      const { container } = render(<AnimatedError color="orange" />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("stroke", "#f97316");
    });

    it("should render circle and path", () => {
      const { container } = render(<AnimatedError />);
      expect(container.querySelector("circle")).toBeInTheDocument();
      expect(container.querySelector("path")).toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - AnimatedWarning", () => {
  describe("Rendering", () => {
    it("should render warning icon", () => {
      const { container } = render(<AnimatedWarning />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply custom size", () => {
      const { container } = render(<AnimatedWarning size={120} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "120");
    });

    it("should render path and lines", () => {
      const { container } = render(<AnimatedWarning />);
      expect(container.querySelector("path")).toBeInTheDocument();
      expect(container.querySelectorAll("line").length).toBeGreaterThan(0);
    });
  });
});

describe("StatusAnimations - FormFieldAnimation", () => {
  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <FormFieldAnimation>
          <input placeholder="Email" />
        </FormFieldAnimation>
      );
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    });

    it("should wrap children in animated div", () => {
      const { container } = render(
        <FormFieldAnimation>
          <input placeholder="Test" />
        </FormFieldAnimation>
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should accept delay prop", () => {
      render(
        <FormFieldAnimation delay={0.5}>
          <input placeholder="Delayed" />
        </FormFieldAnimation>
      );
      expect(screen.getByPlaceholderText("Delayed")).toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - LoadingButton", () => {
  describe("Rendering", () => {
    it("should render button with children", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      expect(screen.getByRole("button")).toHaveTextContent("Submit");
    });

    it("should show loading spinner when isLoading is true", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should disable button when loading", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("should not disable button when not loading", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("should handle click events when not loading", () => {
      const handleClick = jest.fn();
      render(
        <LoadingButton isLoading={false} onClick={handleClick}>
          Click
        </LoadingButton>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger click when loading", () => {
      const handleClick = jest.fn();
      render(
        <LoadingButton isLoading={true} onClick={handleClick}>
          Click
        </LoadingButton>
      );

      // Button is disabled, click should not trigger
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Type Attribute", () => {
    it("should default to submit type", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should support custom type", () => {
      render(
        <LoadingButton isLoading={false} type="button">
          Button
        </LoadingButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should support aria-label", () => {
      render(
        <LoadingButton isLoading={false} aria-label="Submit form">
          Submit
        </LoadingButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Submit form"
      );
    });

    it("should indicate loading state to screen readers", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });
});

describe("StatusAnimations - AnimatedToast", () => {
  describe("Rendering", () => {
    it("should render toast when visible", () => {
      render(
        <AnimatedToast
          message="Success message"
          type="success"
          isVisible={true}
        />
      );
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("should not render when not visible", () => {
      render(
        <AnimatedToast message="Hidden message" type="info" isVisible={false} />
      );
      expect(screen.queryByText("Hidden message")).not.toBeInTheDocument();
    });

    it("should render different toast types", () => {
      const { rerender } = render(
        <AnimatedToast message="Success" type="success" isVisible={true} />
      );
      expect(screen.getByText("Success")).toBeInTheDocument();

      rerender(<AnimatedToast message="Error" type="error" isVisible={true} />);
      expect(screen.getByText("Error")).toBeInTheDocument();

      rerender(
        <AnimatedToast message="Warning" type="warning" isVisible={true} />
      );
      expect(screen.getByText("Warning")).toBeInTheDocument();

      rerender(<AnimatedToast message="Info" type="info" isVisible={true} />);
      expect(screen.getByText("Info")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onClose when close button clicked", () => {
      const handleClose = jest.fn();
      render(
        <AnimatedToast
          message="Closeable toast"
          isVisible={true}
          onClose={handleClose}
        />
      );

      const closeButton = screen.getByRole("button");
      fireEvent.click(closeButton);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("should auto-close after duration", async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();

      render(
        <AnimatedToast
          message="Auto close"
          isVisible={true}
          onClose={handleClose}
          duration={1000}
        />
      );

      jest.advanceTimersByTime(1000);
      expect(handleClose).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });
  });
});

describe("StatusAnimations - NotificationToast", () => {
  it("should be an alias for AnimatedToast", () => {
    render(
      <NotificationToast message="Notification" type="info" isVisible={true} />
    );
    expect(screen.getByText("Notification")).toBeInTheDocument();
  });
});

describe("StatusAnimations - AnimatedProgressBar", () => {
  describe("Rendering", () => {
    it("should render progress bar", () => {
      const { container } = render(<AnimatedProgressBar progress={50} />);
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should show percentage by default", () => {
      render(<AnimatedProgressBar progress={75} />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("should hide percentage when showPercentage is false", () => {
      render(<AnimatedProgressBar progress={50} showPercentage={false} />);
      expect(screen.queryByText("50%")).not.toBeInTheDocument();
    });

    it("should apply different status colors", () => {
      const { container, rerender } = render(
        <AnimatedProgressBar progress={50} status="active" />
      );
      expect(container.querySelector(".from-blue-500")).toBeInTheDocument();

      rerender(<AnimatedProgressBar progress={100} status="success" />);
      expect(container.querySelector(".from-green-500")).toBeInTheDocument();

      rerender(<AnimatedProgressBar progress={30} status="error" />);
      expect(container.querySelector(".from-red-500")).toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - StatusIndicator", () => {
  describe("Rendering", () => {
    it("should render loading status", () => {
      const { container } = render(
        <StatusIndicator status="loading" message="Loading..." />
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should render success status", () => {
      const { container } = render(
        <StatusIndicator status="success" message="Complete!" />
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should render error status", () => {
      const { container } = render(
        <StatusIndicator status="error" message="Failed" />
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("should apply custom size", () => {
      const { container } = render(
        <StatusIndicator status="loading" size="lg" />
      );
      expect(container.querySelector("div")).toBeInTheDocument();
    });
  });
});
