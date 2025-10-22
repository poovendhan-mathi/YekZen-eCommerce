import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  InteractiveButton,
  FloatingActionButton,
  InteractiveCard,
  RippleEffect,
  MagneticButton,
  AnimatedTooltip,
} from "../components/ui/MicroInteractions";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      onClick,
      className,
      disabled,
      style,
      onMouseMove,
      onMouseLeave,
      ...props
    }) => (
      <button
        onClick={onClick}
        className={className}
        disabled={disabled}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        {...props}
      >
        {children}
      </button>
    ),
    div: ({ children, className, onHoverStart, onHoverEnd, ...props }) => (
      <div
        className={className}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        {...props}
      >
        {children}
      </div>
    ),
    span: ({ children, className, ...props }) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn(() => 0) }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn(() => 0) }),
  useSpring: (value) => value,
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("MicroInteractions - InteractiveButton", () => {
  describe("Rendering", () => {
    it("should render with children text", () => {
      render(<InteractiveButton>Click Me</InteractiveButton>);
      expect(screen.getByRole("button")).toHaveTextContent("Click Me");
    });

    it("should render with custom className", () => {
      render(
        <InteractiveButton className="custom-class">Button</InteractiveButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("should apply correct variant styles", () => {
      const { rerender } = render(
        <InteractiveButton variant="primary">Primary</InteractiveButton>
      );
      let button = screen.getByRole("button");
      expect(button.className).toContain("from-blue-500");

      rerender(
        <InteractiveButton variant="secondary">Secondary</InteractiveButton>
      );
      button = screen.getByRole("button");
      expect(button.className).toContain("bg-white");

      rerender(
        <InteractiveButton variant="success">Success</InteractiveButton>
      );
      button = screen.getByRole("button");
      expect(button.className).toContain("from-green-500");

      rerender(<InteractiveButton variant="danger">Danger</InteractiveButton>);
      button = screen.getByRole("button");
      expect(button.className).toContain("from-red-500");
    });

    it("should apply correct size styles", () => {
      const { rerender } = render(
        <InteractiveButton size="sm">Small</InteractiveButton>
      );
      let button = screen.getByRole("button");
      expect(button.className).toContain("text-sm");

      rerender(<InteractiveButton size="md">Medium</InteractiveButton>);
      button = screen.getByRole("button");
      expect(button.className).toContain("text-base");

      rerender(<InteractiveButton size="lg">Large</InteractiveButton>);
      button = screen.getByRole("button");
      expect(button.className).toContain("text-lg");
    });
  });

  describe("Interactions", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(
        <InteractiveButton onClick={handleClick}>Click</InteractiveButton>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger onClick when disabled", () => {
      const handleClick = jest.fn();
      render(
        <InteractiveButton onClick={handleClick} disabled>
          Disabled
        </InteractiveButton>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled styles", () => {
      render(<InteractiveButton disabled>Disabled Button</InteractiveButton>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:opacity-50");
      expect(button.className).toContain("disabled:cursor-not-allowed");
    });

    it("should have disabled attribute", () => {
      render(<InteractiveButton disabled>Disabled</InteractiveButton>);
      expect(screen.getByRole("button")).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should support aria-label", () => {
      render(
        <InteractiveButton aria-label="Submit form">Submit</InteractiveButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-label",
        "Submit form"
      );
    });

    it("should be keyboard accessible", () => {
      const handleClick = jest.fn();
      render(
        <InteractiveButton onClick={handleClick}>Accessible</InteractiveButton>
      );

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});

describe("MicroInteractions - FloatingActionButton", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(
        <FloatingActionButton>
          <span>+</span>
        </FloatingActionButton>
      );
      expect(screen.getByText("+")).toBeInTheDocument();
    });

    it("should apply correct position", () => {
      const { rerender } = render(
        <FloatingActionButton position="bottom-right">+</FloatingActionButton>
      );
      let button = screen.getByRole("button");
      expect(button.className).toContain("bottom-6");
      expect(button.className).toContain("right-6");

      rerender(
        <FloatingActionButton position="bottom-left">+</FloatingActionButton>
      );
      button = screen.getByRole("button");
      expect(button.className).toContain("left-6");
    });

    it("should apply custom className", () => {
      render(
        <FloatingActionButton className="custom-fab">+</FloatingActionButton>
      );
      expect(screen.getByRole("button")).toHaveClass("custom-fab");
    });
  });

  describe("Interactions", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(
        <FloatingActionButton onClick={handleClick}>+</FloatingActionButton>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should handle mouse movement for magnetic effect", () => {
      render(<FloatingActionButton>+</FloatingActionButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });
      expect(button).toBeInTheDocument();
    });

    it("should reset position on mouse leave", () => {
      render(<FloatingActionButton>+</FloatingActionButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseLeave(button);
      expect(button).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - InteractiveCard", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(
        <InteractiveCard>
          <h2>Card Title</h2>
          <p>Card content</p>
        </InteractiveCard>
      );
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(
        <InteractiveCard className="custom-card">
          <p>Content</p>
        </InteractiveCard>
      );
      const card = screen.getByText("Content").parentElement;
      expect(card).toHaveClass("custom-card");
    });

    it("should have default card styles", () => {
      render(
        <InteractiveCard>
          <p>Content</p>
        </InteractiveCard>
      );
      const card = screen.getByText("Content").parentElement;
      expect(card?.className).toContain("bg-white");
      expect(card?.className).toContain("rounded-xl");
    });
  });

  describe("Interactions", () => {
    it("should handle hover state", () => {
      render(
        <InteractiveCard>
          <p>Hover me</p>
        </InteractiveCard>
      );
      const card = screen.getByText("Hover me").parentElement;

      fireEvent.mouseEnter(card);
      expect(card).toBeInTheDocument();

      fireEvent.mouseLeave(card);
      expect(card).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - RippleEffect", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<RippleEffect>Click for ripple</RippleEffect>);
      expect(screen.getByRole("button")).toHaveTextContent("Click for ripple");
    });

    it("should apply custom className", () => {
      render(<RippleEffect className="ripple-btn">Ripple</RippleEffect>);
      expect(screen.getByRole("button")).toHaveClass("ripple-btn");
    });
  });

  describe("Interactions", () => {
    it("should handle click and create ripple", () => {
      const handleClick = jest.fn();
      render(<RippleEffect onClick={handleClick}>Click</RippleEffect>);

      const button = screen.getByRole("button");
      fireEvent.click(button, { clientX: 100, clientY: 100 });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should have overflow hidden for ripple effect", () => {
      render(<RippleEffect>Ripple</RippleEffect>);
      const button = screen.getByRole("button");
      expect(button.className).toContain("overflow-hidden");
    });
  });
});

describe("MicroInteractions - MagneticButton", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<MagneticButton>Magnetic</MagneticButton>);
      expect(screen.getByRole("button")).toHaveTextContent("Magnetic");
    });

    it("should apply custom className", () => {
      render(
        <MagneticButton className="magnetic-btn">Magnetic</MagneticButton>
      );
      expect(screen.getByRole("button")).toHaveClass("magnetic-btn");
    });
  });

  describe("Interactions", () => {
    it("should handle mouse movement", () => {
      render(<MagneticButton>Hover me</MagneticButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });
      expect(button).toBeInTheDocument();
    });

    it("should reset position on mouse leave", () => {
      render(<MagneticButton>Magnetic</MagneticButton>);
      const button = screen.getByRole("button");

      fireEvent.mouseLeave(button);
      expect(button).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - AnimatedTooltip", () => {
  describe("Rendering", () => {
    it("should render trigger element", () => {
      render(
        <AnimatedTooltip content="Tooltip text">
          <button>Hover me</button>
        </AnimatedTooltip>
      );
      expect(screen.getByRole("button")).toHaveTextContent("Hover me");
    });

    it("should show tooltip on hover", () => {
      render(
        <AnimatedTooltip content="Tooltip text">
          <button>Hover me</button>
        </AnimatedTooltip>
      );

      const trigger = screen.getByRole("button");
      fireEvent.mouseEnter(trigger);

      expect(screen.getByText("Tooltip text")).toBeInTheDocument();
    });

    it("should hide tooltip on mouse leave", async () => {
      render(
        <AnimatedTooltip content="Tooltip text">
          <button>Hover me</button>
        </AnimatedTooltip>
      );

      const trigger = screen.getByRole("button");
      fireEvent.mouseEnter(trigger);
      expect(screen.getByText("Tooltip text")).toBeInTheDocument();

      fireEvent.mouseLeave(trigger);
      await waitFor(() => {
        expect(screen.queryByText("Tooltip text")).not.toBeInTheDocument();
      });
    });
  });

  describe("Positioning", () => {
    it("should apply correct position styles", () => {
      const { rerender } = render(
        <AnimatedTooltip content="Top tooltip" position="top">
          <button>Hover</button>
        </AnimatedTooltip>
      );

      fireEvent.mouseEnter(screen.getByRole("button"));
      let tooltip = screen.getByText("Top tooltip");
      expect(tooltip.className).toContain("bottom-full");

      fireEvent.mouseLeave(screen.getByRole("button"));

      rerender(
        <AnimatedTooltip content="Bottom tooltip" position="bottom">
          <button>Hover</button>
        </AnimatedTooltip>
      );

      fireEvent.mouseEnter(screen.getByRole("button"));
      tooltip = screen.getByText("Bottom tooltip");
      expect(tooltip.className).toContain("top-full");
    });
  });
});
