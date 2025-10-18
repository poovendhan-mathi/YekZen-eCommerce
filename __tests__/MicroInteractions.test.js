import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  useMotionValue: () => ({ set: jest.fn(), get: jest.fn() }),
  useTransform: () => ({ set: jest.fn(), get: jest.fn() }),
  useSpring: () => ({ set: jest.fn(), get: jest.fn() }),
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("MicroInteractions - InteractiveButton", () => {
  describe("Rendering", () => {
    it("should render with children text", () => {
      render(<InteractiveButton>Click Me</InteractiveButton>);
      expect(screen.getByText("Click Me")).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      render(<InteractiveButton className="custom-class">Button</InteractiveButton>);
      const button = screen.getByText("Button");
      expect(button).toHaveClass("custom-class");
    });

    it("should apply correct variant styles", () => {
      const { rerender } = render(<InteractiveButton variant="primary">Primary</InteractiveButton>);
      let button = screen.getByText("Primary");
      expect(button.className).toContain("from-blue-500");

      rerender(<InteractiveButton variant="secondary">Secondary</InteractiveButton>);
      button = screen.getByText("Secondary");
      expect(button.className).toContain("bg-white");

      rerender(<InteractiveButton variant="success">Success</InteractiveButton>);
      button = screen.getByText("Success");
      expect(button.className).toContain("from-green-500");

      rerender(<InteractiveButton variant="danger">Danger</InteractiveButton>);
      button = screen.getByText("Danger");
      expect(button.className).toContain("from-red-500");
    });

    it("should apply correct size styles", () => {
      const { rerender } = render(<InteractiveButton size="sm">Small</InteractiveButton>);
      let button = screen.getByText("Small");
      expect(button.className).toContain("text-sm");

      rerender(<InteractiveButton size="md">Medium</InteractiveButton>);
      button = screen.getByText("Medium");
      expect(button.className).toContain("text-base");

      rerender(<InteractiveButton size="lg">Large</InteractiveButton>);
      button = screen.getByText("Large");
      expect(button.className).toContain("text-lg");
    });
  });

  describe("Interactions", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(<InteractiveButton onClick={handleClick}>Click</InteractiveButton>);
      
      fireEvent.click(screen.getByText("Click"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should not trigger onClick when disabled", () => {
      const handleClick = jest.fn();
      render(
        <InteractiveButton onClick={handleClick} disabled>
          Disabled
        </InteractiveButton>
      );
      
      fireEvent.click(screen.getByText("Disabled"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("should handle mouse press and release", () => {
      render(<InteractiveButton>Press Me</InteractiveButton>);
      const button = screen.getByText("Press Me");
      
      fireEvent.mouseDown(button);
      fireEvent.mouseUp(button);
      
      expect(button).toBeInTheDocument();
    });

    it("should handle keyboard events", () => {
      const handleClick = jest.fn();
      render(<InteractiveButton onClick={handleClick}>Keyboard</InteractiveButton>);
      const button = screen.getByText("Keyboard");
      
      fireEvent.keyDown(button, { key: "Enter", code: "Enter" });
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should apply disabled styles", () => {
      render(<InteractiveButton disabled>Disabled Button</InteractiveButton>);
      const button = screen.getByText("Disabled Button");
      expect(button).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    it("should have disabled attribute", () => {
      render(<InteractiveButton disabled>Disabled</InteractiveButton>);
      expect(screen.getByText("Disabled")).toBeDisabled();
    });
  });

  describe("Accessibility", () => {
    it("should be keyboard accessible", () => {
      render(<InteractiveButton>Accessible</InteractiveButton>);
      const button = screen.getByText("Accessible");
      expect(button).toHaveAttribute("type");
    });

    it("should support aria-label", () => {
      render(<InteractiveButton aria-label="Custom Label">Button</InteractiveButton>);
      expect(screen.getByLabelText("Custom Label")).toBeInTheDocument();
    });

    it("should forward custom props", () => {
      render(
        <InteractiveButton data-testid="custom-button" id="btn-1">
          Custom Props
        </InteractiveButton>
      );
      const button = screen.getByTestId("custom-button");
      expect(button).toHaveAttribute("id", "btn-1");
    });
  });
});

describe("MicroInteractions - AnimatedTooltip", () => {
  describe("Rendering", () => {
    it("should render children", () => {
      render(
        <AnimatedTooltip content="Tooltip text">
          <button>Hover me</button>
        </AnimatedTooltip>
      );
      expect(screen.getByText("Hover me")).toBeInTheDocument();
    });

    it("should not show tooltip initially", () => {
      render(
        <AnimatedTooltip content="Hidden tooltip">
          <button>Button</button>
        </AnimatedTooltip>
      );
      expect(screen.queryByText("Hidden tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Tooltip Visibility", () => {
    it("should show tooltip on mouse enter", async () => {
      render(
        <AnimatedTooltip content="Tooltip content">
          <button>Hover target</button>
        </AnimatedTooltip>
      );
      
      const button = screen.getByText("Hover target");
      fireEvent.mouseEnter(button.parentElement);
      
      await waitFor(() => {
        expect(screen.getByText("Tooltip content")).toBeInTheDocument();
      });
    });

    it("should hide tooltip on mouse leave", async () => {
      render(
        <AnimatedTooltip content="Disappearing tooltip">
          <button>Hover target</button>
        </AnimatedTooltip>
      );
      
      const container = screen.getByText("Hover target").parentElement;
      fireEvent.mouseEnter(container);
      
      await waitFor(() => {
        expect(screen.getByText("Disappearing tooltip")).toBeInTheDocument();
      });
      
      fireEvent.mouseLeave(container);
      
      await waitFor(() => {
        expect(screen.queryByText("Disappearing tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("Tooltip Positioning", () => {
    it("should position tooltip at the top by default", () => {
      render(
        <AnimatedTooltip content="Top tooltip">
          <button>Button</button>
        </AnimatedTooltip>
      );
      
      const container = screen.getByText("Button").parentElement;
      fireEvent.mouseEnter(container);
      
      waitFor(() => {
        const tooltip = screen.getByText("Top tooltip");
        expect(tooltip).toHaveClass("bottom-full");
      });
    });

    it("should support all position options", async () => {
      const positions = ["top", "bottom", "left", "right"];
      
      for (const position of positions) {
        const { unmount } = render(
          <AnimatedTooltip content={`${position} tooltip`} position={position}>
            <button>{position}</button>
          </AnimatedTooltip>
        );
        
        const container = screen.getByText(position).parentElement;
        fireEvent.mouseEnter(container);
        
        await waitFor(() => {
          expect(screen.getByText(`${position} tooltip`)).toBeInTheDocument();
        });
        
        unmount();
      }
    });

    it("should apply custom className to tooltip", async () => {
      render(
        <AnimatedTooltip content="Custom styled" className="custom-tooltip-class">
          <button>Button</button>
        </AnimatedTooltip>
      );
      
      const container = screen.getByText("Button").parentElement;
      fireEvent.mouseEnter(container);
      
      await waitFor(() => {
        const tooltip = screen.getByText("Custom styled");
        expect(tooltip).toHaveClass("custom-tooltip-class");
      });
    });
  });

  describe("Accessibility", () => {
    it("should wrap children in accessible container", () => {
      render(
        <AnimatedTooltip content="Accessible tooltip">
          <button>Accessible button</button>
        </AnimatedTooltip>
      );
      
      expect(screen.getByText("Accessible button")).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - FloatingActionButton", () => {
  const mockActions = [
    { icon: "➕", label: "Add", onClick: jest.fn() },
    { icon: "✏️", label: "Edit", onClick: jest.fn() },
    { icon: "🗑️", label: "Delete", onClick: jest.fn() },
  ];

  beforeEach(() => {
    mockActions.forEach(action => action.onClick.mockClear());
  });

  describe("Rendering", () => {
    it("should render FAB button", () => {
      render(<FloatingActionButton actions={mockActions} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should not show actions initially", () => {
      render(<FloatingActionButton actions={mockActions} />);
      expect(screen.queryByText("Add")).not.toBeInTheDocument();
    });
  });

  describe("Action Menu", () => {
    it("should expand menu on click", async () => {
      render(<FloatingActionButton actions={mockActions} />);
      
      const fab = screen.getByRole("button");
      fireEvent.click(fab);
      
      await waitFor(() => {
        expect(screen.getByText("Add")).toBeInTheDocument();
        expect(screen.getByText("Edit")).toBeInTheDocument();
        expect(screen.getByText("Delete")).toBeInTheDocument();
      });
    });

    it("should collapse menu on second click", async () => {
      render(<FloatingActionButton actions={mockActions} />);
      
      const fab = screen.getByRole("button");
      fireEvent.click(fab);
      
      await waitFor(() => {
        expect(screen.getByText("Add")).toBeInTheDocument();
      });
      
      fireEvent.click(fab);
      
      await waitFor(() => {
        expect(screen.queryByText("Add")).not.toBeInTheDocument();
      });
    });

    it("should trigger action onClick", async () => {
      render(<FloatingActionButton actions={mockActions} />);
      
      const fab = screen.getByRole("button");
      fireEvent.click(fab);
      
      await waitFor(() => {
        expect(screen.getByText("Add")).toBeInTheDocument();
      });
      
      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);
      
      expect(mockActions[0].onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("should have proper button role", () => {
      render(<FloatingActionButton actions={mockActions} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      render(<FloatingActionButton actions={mockActions} />);
      const fab = screen.getByRole("button");
      
      fireEvent.keyDown(fab, { key: "Enter" });
      expect(fab).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - MagneticButton", () => {
  describe("Rendering", () => {
    it("should render with children", () => {
      render(<MagneticButton>Magnetic</MagneticButton>);
      expect(screen.getByText("Magnetic")).toBeInTheDocument();
    });

    it("should apply custom className", () => {
      render(<MagneticButton className="magnetic-custom">Button</MagneticButton>);
      expect(screen.getByText("Button")).toHaveClass("magnetic-custom");
    });
  });

  describe("Magnetic Effect", () => {
    it("should handle mouse movement", () => {
      render(<MagneticButton strength={0.5}>Magnetic Button</MagneticButton>);
      const button = screen.getByText("Magnetic Button");
      
      fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });
      expect(button).toBeInTheDocument();
    });

    it("should reset position on mouse leave", () => {
      render(<MagneticButton>Magnetic Button</MagneticButton>);
      const button = screen.getByText("Magnetic Button");
      
      fireEvent.mouseMove(button, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(button);
      
      expect(button).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(<MagneticButton onClick={handleClick}>Click Magnetic</MagneticButton>);
      
      fireEvent.click(screen.getByText("Click Magnetic"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should support custom strength", () => {
      render(<MagneticButton strength={0.8}>Strong Magnetic</MagneticButton>);
      expect(screen.getByText("Strong Magnetic")).toBeInTheDocument();
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
      render(<InteractiveCard className="custom-card">Content</InteractiveCard>);
      const card = screen.getByText("Content").parentElement;
      expect(card).toHaveClass("custom-card");
    });
  });

  describe("3D Tilt Effect", () => {
    it("should handle mouse movement for tilt", () => {
      render(<InteractiveCard>Tilt Card</InteractiveCard>);
      const card = screen.getByText("Tilt Card").parentElement;
      
      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      expect(card).toBeInTheDocument();
    });

    it("should reset tilt on mouse leave", () => {
      render(<InteractiveCard>Tilt Card</InteractiveCard>);
      const card = screen.getByText("Tilt Card").parentElement;
      
      fireEvent.mouseMove(card, { clientX: 100, clientY: 100 });
      fireEvent.mouseLeave(card);
      
      expect(card).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should handle click events", () => {
      const handleClick = jest.fn();
      render(<InteractiveCard onClick={handleClick}>Clickable Card</InteractiveCard>);
      
      fireEvent.click(screen.getByText("Clickable Card"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("should support custom tilt intensity", () => {
      render(<InteractiveCard intensity={0.2}>Low Intensity</InteractiveCard>);
      expect(screen.getByText("Low Intensity")).toBeInTheDocument();
    });
  });
});

describe("MicroInteractions - Integration Tests", () => {
  it("should work together - Tooltip with Button", async () => {
    render(
      <AnimatedTooltip content="Click to proceed">
        <InteractiveButton>Proceed</InteractiveButton>
      </AnimatedTooltip>
    );
    
    const button = screen.getByText("Proceed");
    expect(button).toBeInTheDocument();
    
    fireEvent.mouseEnter(button.parentElement);
    await waitFor(() => {
      expect(screen.getByText("Click to proceed")).toBeInTheDocument();
    });
  });

  it("should work together - Card with Magnetic Button", () => {
    render(
      <InteractiveCard>
        <MagneticButton>Magnetic Inside Card</MagneticButton>
      </InteractiveCard>
    );
    
    expect(screen.getByText("Magnetic Inside Card")).toBeInTheDocument();
  });
});

describe("MicroInteractions - Performance", () => {
  it("should render multiple buttons efficiently", () => {
    const { container } = render(
      <>
        {[...Array(10)].map((_, i) => (
          <InteractiveButton key={i}>Button {i}</InteractiveButton>
        ))}
      </>
    );
    
    expect(container.querySelectorAll("button")).toHaveLength(10);
  });

  it("should handle rapid interactions", () => {
    const handleClick = jest.fn();
    render(<InteractiveButton onClick={handleClick}>Rapid Click</InteractiveButton>);
    const button = screen.getByText("Rapid Click");
    
    for (let i = 0; i < 10; i++) {
      fireEvent.click(button);
    }
    
    expect(handleClick).toHaveBeenCalledTimes(10);
  });
});
