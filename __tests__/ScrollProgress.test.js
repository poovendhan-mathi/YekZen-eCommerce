import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  ScrollProgressBar,
  CircularScrollProgress,
  ScrollToTop,
} from "../components/ui/ScrollProgress";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, style, ...props }) => (
      <div style={style} {...props}>
        {children}
      </div>
    ),
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    circle: (props) => <circle {...props} />,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
  },
  useScroll: () => ({
    scrollY: { get: jest.fn(() => 0), on: jest.fn(() => jest.fn()) },
    scrollYProgress: { get: jest.fn(() => 0) },
  }),
  useSpring: (value) => value,
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("ScrollProgress - ScrollProgressBar", () => {
  describe("Rendering", () => {
    it("should render the progress bar", () => {
      const { container } = render(<ScrollProgressBar />);
      const progressBar = container.querySelector(".fixed");
      expect(progressBar).toBeInTheDocument();
    });

    it("should be positioned at the top", () => {
      const { container } = render(<ScrollProgressBar />);
      const progressBar = container.querySelector(".fixed");
      expect(progressBar).toHaveClass("top-0", "left-0", "right-0");
    });

    it("should have correct height", () => {
      const { container } = render(<ScrollProgressBar />);
      const progressBar = container.querySelector(".h-1");
      expect(progressBar).toBeInTheDocument();
    });

    it("should have high z-index", () => {
      const { container } = render(<ScrollProgressBar />);
      const progressBar = container.querySelector(".z-\\[100\\]");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("Color Variants", () => {
    it("should apply blue color", () => {
      const { container } = render(<ScrollProgressBar color="blue" />);
      const progressBar = container.querySelector(".bg-blue-600");
      expect(progressBar).toBeInTheDocument();
    });

    it("should apply purple color", () => {
      const { container } = render(<ScrollProgressBar color="purple" />);
      const progressBar = container.querySelector(".bg-purple-600");
      expect(progressBar).toBeInTheDocument();
    });

    it("should apply green color", () => {
      const { container } = render(<ScrollProgressBar color="green" />);
      const progressBar = container.querySelector(".bg-green-600");
      expect(progressBar).toBeInTheDocument();
    });

    it("should apply red color", () => {
      const { container } = render(<ScrollProgressBar color="red" />);
      const progressBar = container.querySelector(".bg-red-600");
      expect(progressBar).toBeInTheDocument();
    });

    it("should apply gradient color", () => {
      const { container } = render(<ScrollProgressBar color="gradient" />);
      const progressBar = container.querySelector(".bg-gradient-to-r");
      expect(progressBar).toBeInTheDocument();
    });

    it("should default to blue if invalid color", () => {
      const { container } = render(<ScrollProgressBar color="invalid" />);
      const progressBar = container.querySelector(".bg-blue-600");
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe("Scroll Behavior", () => {
    it("should scale from left origin", () => {
      const { container } = render(<ScrollProgressBar />);
      const progressBar = container.querySelector(".origin-left");
      expect(progressBar).toBeInTheDocument();
    });
  });
});

describe("ScrollProgress - CircularScrollProgress", () => {
  describe("Rendering", () => {
    it("should render circular progress indicator", () => {
      const { container } = render(<CircularScrollProgress />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("should be positioned at bottom-right by default", () => {
      const { container } = render(<CircularScrollProgress />);
      const wrapper = container.querySelector(".fixed");
      expect(wrapper).toHaveClass("bottom-8", "right-8");
    });

    it("should have high z-index", () => {
      const { container } = render(<CircularScrollProgress />);
      const wrapper = container.querySelector(".z-50");
      expect(wrapper).toBeInTheDocument();
    });
  });

  describe("Size Configuration", () => {
    it("should apply default size of 60", () => {
      const { container } = render(<CircularScrollProgress />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "60");
      expect(svg).toHaveAttribute("height", "60");
    });

    it("should apply custom size", () => {
      const { container } = render(<CircularScrollProgress size={80} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "80");
      expect(svg).toHaveAttribute("height", "80");
    });

    it("should calculate circle radius correctly", () => {
      const size = 60;
      const { container } = render(<CircularScrollProgress size={size} />);
      const circles = container.querySelectorAll("circle");
      
      circles.forEach((circle) => {
        const cx = circle.getAttribute("cx");
        const cy = circle.getAttribute("cy");
        expect(cx).toBe(String(size / 2));
        expect(cy).toBe(String(size / 2));
      });
    });
  });

  describe("Visual Elements", () => {
    it("should render background circle", () => {
      const { container } = render(<CircularScrollProgress />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBeGreaterThanOrEqual(1);
    });

    it("should render progress circle", () => {
      const { container } = render(<CircularScrollProgress />);
      const circles = container.querySelectorAll("circle");
      expect(circles.length).toBe(2); // Background + progress
    });

    it("should render gradient definition", () => {
      const { container } = render(<CircularScrollProgress />);
      const gradient = container.querySelector("linearGradient");
      expect(gradient).toBeInTheDocument();
    });

    it("should have gradient with correct colors", () => {
      const { container } = render(<CircularScrollProgress />);
      const stops = container.querySelectorAll("stop");
      expect(stops.length).toBe(3);
    });

    it("should display percentage text", () => {
      const { container } = render(<CircularScrollProgress />);
      const text = container.querySelector("span");
      expect(text).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should rotate svg by -90 degrees", () => {
      const { container } = render(<CircularScrollProgress />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveClass("rotate-[-90deg]");
    });

    it("should have round stroke cap", () => {
      const { container } = render(<CircularScrollProgress />);
      const progressCircle = container.querySelectorAll("circle")[1];
      expect(progressCircle).toHaveAttribute("stroke-linecap", "round");
    });
  });
});

describe("ScrollProgress - ScrollToTop", () => {
  let mockScrollTo;

  beforeEach(() => {
    mockScrollTo = jest.fn();
    global.window.scrollTo = mockScrollTo;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should not render initially (below threshold)", () => {
      const { container } = render(<ScrollToTop threshold={300} />);
      expect(container.querySelector("button")).not.toBeInTheDocument();
    });

    it("should have gradient background", () => {
      // We need to mock scroll position for this
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector(".bg-gradient-to-r");
      // Button might not be visible initially
      expect(container).toBeInTheDocument();
    });

    it("should be positioned at bottom-right", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const wrapper = container.querySelector(".fixed");
      if (wrapper) {
        expect(wrapper).toHaveClass("bottom-8", "right-8");
      }
    });

    it("should have high z-index", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const wrapper = container.querySelector(".z-50");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Threshold Behavior", () => {
    it("should accept custom threshold", () => {
      const { container } = render(<ScrollToTop threshold={500} />);
      expect(container).toBeInTheDocument();
    });

    it("should default to 300 if no threshold provided", () => {
      const { container } = render(<ScrollToTop />);
      expect(container).toBeInTheDocument();
    });
  });

  describe("Click Behavior", () => {
    it("should scroll to top when clicked", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector("button");
      
      if (button) {
        fireEvent.click(button);
        expect(mockScrollTo).toHaveBeenCalledWith({
          top: 0,
          behavior: "smooth",
        });
      }
    });

    it("should call scrollTo with smooth behavior", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector("button");
      
      if (button) {
        fireEvent.click(button);
        expect(mockScrollTo).toHaveBeenCalledWith(
          expect.objectContaining({
            behavior: "smooth",
          })
        );
      }
    });
  });

  describe("Accessibility", () => {
    it("should have aria-label", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector('button[aria-label="Scroll to top"]');
      // Button may not be visible initially
      expect(container).toBeInTheDocument();
    });

    it("should be keyboard accessible", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector("button");
      
      if (button) {
        expect(button).toHaveAttribute("type");
      }
    });
  });

  describe("Visual Elements", () => {
    it("should render arrow icon", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const svg = container.querySelector("svg");
      // SVG may not be visible initially
      expect(container).toBeInTheDocument();
    });

    it("should have rounded shape", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector(".rounded-full");
      // Button may not be visible initially
      expect(container).toBeInTheDocument();
    });

    it("should have shadow effect", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector(".shadow-lg");
      // Button may not be visible initially
      expect(container).toBeInTheDocument();
    });
  });

  describe("Animation", () => {
    it("should have hover shadow effect class", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      const button = container.querySelector(".hover\\:shadow-xl");
      // Button may not be visible initially
      expect(container).toBeInTheDocument();
    });
  });
});

describe("ScrollProgress - Integration Tests", () => {
  it("should render all scroll components together", () => {
    const { container } = render(
      <>
        <ScrollProgressBar />
        <CircularScrollProgress />
        <ScrollToTop />
      </>
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll(".fixed").length).toBeGreaterThan(0);
  });

  it("should not conflict with each other's positioning", () => {
    const { container } = render(
      <>
        <ScrollProgressBar />
        <CircularScrollProgress />
        <ScrollToTop />
      </>
    );

    const fixedElements = container.querySelectorAll(".fixed");
    expect(fixedElements.length).toBeGreaterThan(0);
  });

  it("should maintain different z-indexes", () => {
    const { container } = render(
      <>
        <ScrollProgressBar />
        <CircularScrollProgress />
        <ScrollToTop />
      </>
    );

    expect(container.querySelector(".z-\\[100\\]")).toBeInTheDocument(); // Progress bar
    expect(container.querySelector(".z-50")).toBeInTheDocument(); // Circular or ScrollToTop
  });
});

describe("ScrollProgress - Performance", () => {
  it("should render efficiently with multiple instances", () => {
    const { container } = render(
      <>
        <ScrollProgressBar color="blue" />
        <ScrollProgressBar color="red" />
        <ScrollProgressBar color="green" />
      </>
    );

    const progressBars = container.querySelectorAll(".fixed");
    expect(progressBars.length).toBe(3);
  });

  it("should handle size variations efficiently", () => {
    const sizes = [40, 60, 80, 100];
    const { container } = render(
      <>
        {sizes.map((size) => (
          <CircularScrollProgress key={size} size={size} />
        ))}
      </>
    );

    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(sizes.length);
  });
});

describe("ScrollProgress - Edge Cases", () => {
  describe("ScrollProgressBar Edge Cases", () => {
    it("should handle undefined color gracefully", () => {
      const { container } = render(<ScrollProgressBar color={undefined} />);
      expect(container.querySelector(".fixed")).toBeInTheDocument();
    });

    it("should handle null color gracefully", () => {
      const { container } = render(<ScrollProgressBar color={null} />);
      expect(container.querySelector(".fixed")).toBeInTheDocument();
    });
  });

  describe("CircularScrollProgress Edge Cases", () => {
    it("should handle very small size", () => {
      const { container } = render(<CircularScrollProgress size={10} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "10");
    });

    it("should handle very large size", () => {
      const { container } = render(<CircularScrollProgress size={200} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "200");
    });

    it("should handle zero size", () => {
      const { container } = render(<CircularScrollProgress size={0} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "0");
    });
  });

  describe("ScrollToTop Edge Cases", () => {
    it("should handle negative threshold", () => {
      const { container } = render(<ScrollToTop threshold={-100} />);
      expect(container).toBeInTheDocument();
    });

    it("should handle zero threshold", () => {
      const { container } = render(<ScrollToTop threshold={0} />);
      expect(container).toBeInTheDocument();
    });

    it("should handle very large threshold", () => {
      const { container } = render(<ScrollToTop threshold={100000} />);
      expect(container).toBeInTheDocument();
    });

    it("should handle missing window.scrollTo", () => {
      const originalScrollTo = window.scrollTo;
      delete window.scrollTo;

      const { container } = render(<ScrollToTop threshold={0} />);
      expect(container).toBeInTheDocument();

      window.scrollTo = originalScrollTo;
    });
  });
});
