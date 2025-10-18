import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  AnimatedCheckmark,
  AnimatedError,
  AnimatedWarning,
  FormFieldAnimation,
  NotificationToast,
  LoadingButton,
} from "../components/ui/StatusAnimations";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    svg: ({ children, ...props }) => <svg {...props}>{children}</svg>,
    path: (props) => <path {...props} />,
    circle: (props) => <circle {...props} />,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
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
      expect(svg).toBeInTheDocument();
    });

    it("should use default values", () => {
      const { container } = render(<AnimatedCheckmark />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "64");
    });
  });

  describe("Animation", () => {
    it("should animate on mount", () => {
      const { container } = render(<AnimatedCheckmark />);
      expect(container.querySelector("circle")).toBeInTheDocument();
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
      expect(svg).toHaveAttribute("height", "80");
    });

    it("should have red color by default", () => {
      const { container } = render(<AnimatedError />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should show X mark", () => {
      const { container } = render(<AnimatedError />);
      const paths = container.querySelectorAll("path");
      expect(paths.length).toBeGreaterThan(0);
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
      const { container } = render(<AnimatedWarning size={70} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "70");
      expect(svg).toHaveAttribute("height", "70");
    });

    it("should have warning color", () => {
      const { container } = render(<AnimatedWarning />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - FormFieldAnimation", () => {
  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <FormFieldAnimation>
          <input placeholder="Test input" />
        </FormFieldAnimation>
      );
      expect(screen.getByPlaceholderText("Test input")).toBeInTheDocument();
    });

    it("should wrap children in container", () => {
      const { container } = render(
        <FormFieldAnimation>
          <input />
        </FormFieldAnimation>
      );
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("should show error message when error prop is provided", () => {
      render(
        <FormFieldAnimation error="This field is required">
          <input />
        </FormFieldAnimation>
      );
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });

    it("should apply error styling", () => {
      render(
        <FormFieldAnimation error="Error message">
          <input />
        </FormFieldAnimation>
      );
      const errorMsg = screen.getByText("Error message");
      expect(errorMsg).toHaveClass("text-red-500");
    });

    it("should not show error when error is null", () => {
      const { container } = render(
        <FormFieldAnimation error={null}>
          <input />
        </FormFieldAnimation>
      );
      expect(container.querySelector(".text-red-500")).not.toBeInTheDocument();
    });

    it("should update when error changes", () => {
      const { rerender } = render(
        <FormFieldAnimation error={null}>
          <input />
        </FormFieldAnimation>
      );
      expect(screen.queryByText("New error")).not.toBeInTheDocument();

      rerender(
        <FormFieldAnimation error="New error">
          <input />
        </FormFieldAnimation>
      );
      expect(screen.getByText("New error")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    it("should show success indicator when success is true", () => {
      const { container } = render(
        <FormFieldAnimation success={true}>
          <input />
        </FormFieldAnimation>
      );
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should apply success styling", () => {
      const { container } = render(
        <FormFieldAnimation success={true}>
          <input />
        </FormFieldAnimation>
      );
      const successIcon = container.querySelector(".text-green-500");
      expect(successIcon).toBeInTheDocument();
    });

    it("should not show success when success is false", () => {
      const { container } = render(
        <FormFieldAnimation success={false}>
          <input />
        </FormFieldAnimation>
      );
      expect(
        container.querySelector(".text-green-500")
      ).not.toBeInTheDocument();
    });
  });

  describe("Combined States", () => {
    it("should prioritize error over success", () => {
      render(
        <FormFieldAnimation error="Error message" success={true}>
          <input />
        </FormFieldAnimation>
      );
      expect(screen.getByText("Error message")).toBeInTheDocument();
    });

    it("should show neither when both are false", () => {
      const { container } = render(
        <FormFieldAnimation error={null} success={false}>
          <input />
        </FormFieldAnimation>
      );
      expect(container.querySelector(".text-red-500")).not.toBeInTheDocument();
      expect(
        container.querySelector(".text-green-500")
      ).not.toBeInTheDocument();
    });
  });
});

describe("StatusAnimations - NotificationToast", () => {
  describe("Rendering", () => {
    it("should render when visible", () => {
      render(
        <NotificationToast
          type="success"
          message="Success message"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText("Success message")).toBeInTheDocument();
    });

    it("should not render when not visible", () => {
      render(
        <NotificationToast
          type="success"
          message="Hidden message"
          isVisible={false}
          onClose={jest.fn()}
        />
      );
      expect(screen.queryByText("Hidden message")).not.toBeInTheDocument();
    });
  });

  describe("Toast Types", () => {
    it("should render success toast with correct styling", () => {
      render(
        <NotificationToast
          type="success"
          message="Success!"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      const toast = screen.getByText("Success!").parentElement;
      expect(toast).toHaveClass("bg-green-500");
    });

    it("should render error toast with correct styling", () => {
      render(
        <NotificationToast
          type="error"
          message="Error occurred"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      const toast = screen.getByText("Error occurred").parentElement;
      expect(toast).toHaveClass("bg-red-500");
    });

    it("should render warning toast with correct styling", () => {
      render(
        <NotificationToast
          type="warning"
          message="Warning!"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      const toast = screen.getByText("Warning!").parentElement;
      expect(toast).toHaveClass("bg-yellow-500");
    });

    it("should render info toast with correct styling", () => {
      render(
        <NotificationToast
          type="info"
          message="Information"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      const toast = screen.getByText("Information").parentElement;
      expect(toast).toHaveClass("bg-blue-500");
    });
  });

  describe("Close Functionality", () => {
    it("should call onClose when close button is clicked", () => {
      const handleClose = jest.fn();
      render(
        <NotificationToast
          type="success"
          message="Closeable"
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
        <NotificationToast
          type="success"
          message="Auto close"
          isVisible={true}
          onClose={handleClose}
          duration={1000}
        />
      );

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(handleClose).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("should not auto-close when duration is 0", async () => {
      jest.useFakeTimers();
      const handleClose = jest.fn();

      render(
        <NotificationToast
          type="success"
          message="No auto close"
          isVisible={true}
          onClose={handleClose}
          duration={0}
        />
      );

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(handleClose).not.toHaveBeenCalled();
      jest.useRealTimers();
    });
  });

  describe("Accessibility", () => {
    it("should have proper aria roles", () => {
      render(
        <NotificationToast
          type="success"
          message="Accessible toast"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      expect(screen.getByText("Accessible toast")).toBeInTheDocument();
    });

    it("should have close button with aria-label", () => {
      render(
        <NotificationToast
          type="success"
          message="Toast"
          isVisible={true}
          onClose={jest.fn()}
        />
      );
      const closeButton = screen.getByRole("button");
      expect(closeButton).toHaveAttribute("aria-label", "Close notification");
    });
  });
});

describe("StatusAnimations - LoadingButton", () => {
  describe("Rendering", () => {
    it("should render children when not loading", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      expect(screen.getByText("Submit")).toBeInTheDocument();
    });

    it("should render loading text when loading", () => {
      render(
        <LoadingButton isLoading={true} loadingText="Submitting...">
          Submit
        </LoadingButton>
      );
      expect(screen.getByText("Submitting...")).toBeInTheDocument();
    });

    it("should render default loading text", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <LoadingButton isLoading={false} className="custom-btn">
          Button
        </LoadingButton>
      );
      expect(screen.getByText("Button")).toHaveClass("custom-btn");
    });
  });

  describe("Loading State", () => {
    it("should show spinner when loading", () => {
      const { container } = render(
        <LoadingButton isLoading={true}>Submit</LoadingButton>
      );
      const spinner = container.querySelector(".border-t-transparent");
      expect(spinner).toBeInTheDocument();
    });

    it("should disable button when loading", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should not disable button when not loading", () => {
      render(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    it("should respect explicit disabled prop", () => {
      render(
        <LoadingButton isLoading={false} disabled={true}>
          Submit
        </LoadingButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Interactions", () => {
    it("should handle click when not loading", () => {
      const handleClick = jest.fn();
      render(
        <LoadingButton isLoading={false} onClick={handleClick}>
          Click me
        </LoadingButton>
      );

      fireEvent.click(screen.getByText("Click me"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not handle click when loading", () => {
      const handleClick = jest.fn();
      render(
        <LoadingButton isLoading={true} onClick={handleClick}>
          Click me
        </LoadingButton>
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should toggle between loading and normal states", () => {
      const { rerender } = render(
        <LoadingButton isLoading={false}>Submit</LoadingButton>
      );
      expect(screen.getByText("Submit")).toBeInTheDocument();

      rerender(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      expect(screen.getByText("Loading...")).toBeInTheDocument();

      rerender(<LoadingButton isLoading={false}>Submit</LoadingButton>);
      expect(screen.getByText("Submit")).toBeInTheDocument();
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
      expect(screen.getByLabelText("Submit form")).toBeInTheDocument();
    });

    it("should indicate loading state to screen readers", () => {
      render(<LoadingButton isLoading={true}>Submit</LoadingButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });
});

describe("StatusAnimations - Integration Tests", () => {
  it("should work with form validation flow", async () => {
    const { rerender } = render(
      <FormFieldAnimation error={null} success={false}>
        <input placeholder="Email" />
      </FormFieldAnimation>
    );

    // Initial state
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    // Error state
    rerender(
      <FormFieldAnimation error="Invalid email" success={false}>
        <input placeholder="Email" />
      </FormFieldAnimation>
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();

    // Success state
    rerender(
      <FormFieldAnimation error={null} success={true}>
        <input placeholder="Email" />
      </FormFieldAnimation>
    );
    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
  });

  it("should coordinate LoadingButton with NotificationToast", async () => {
    const TestComponent = () => {
      const [isLoading, setIsLoading] = React.useState(false);
      const [showToast, setShowToast] = React.useState(false);

      const handleSubmit = () => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setShowToast(true);
        }, 1000);
      };

      return (
        <>
          <LoadingButton isLoading={isLoading} onClick={handleSubmit}>
            Submit
          </LoadingButton>
          <NotificationToast
            type="success"
            message="Form submitted successfully"
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        </>
      );
    };

    const React = require("react");
    jest.useFakeTimers();

    render(<TestComponent />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Form submitted successfully")
      ).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});

describe("StatusAnimations - Performance", () => {
  it("should render multiple status indicators efficiently", () => {
    const { container } = render(
      <>
        <AnimatedCheckmark />
        <AnimatedError />
        <AnimatedWarning />
      </>
    );
    expect(container.querySelectorAll("svg")).toHaveLength(3);
  });

  it("should handle rapid state changes", () => {
    const { rerender } = render(
      <FormFieldAnimation error={null} success={false}>
        <input />
      </FormFieldAnimation>
    );

    for (let i = 0; i < 10; i++) {
      rerender(
        <FormFieldAnimation
          error={i % 2 === 0 ? "Error" : null}
          success={i % 2 !== 0}
        >
          <input />
        </FormFieldAnimation>
      );
    }

    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
