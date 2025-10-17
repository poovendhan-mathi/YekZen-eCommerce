import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "../components/ui/Button";

describe("Button Component", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant classes", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText("Secondary Button");
    expect(button).toHaveClass("bg-white");
  });

  it("disables when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText("Disabled Button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("opacity-50");
  });

  it("shows loading state", () => {
    render(<Button loading>Loading Button</Button>);
    expect(screen.getByText("Loading Button")).toBeInTheDocument();
    // Check for loading spinner
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
