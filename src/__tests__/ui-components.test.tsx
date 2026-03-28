import { render, screen } from "@testing-library/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import BackLink from "@/components/ui/BackLink";
import ErrorBanner from "@/components/ui/ErrorBanner";

describe("LoadingSpinner", () => {
  it("should render a spinner element", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });
});

describe("EmptyState", () => {
  it("should render title text", () => {
    render(<EmptyState title="No items found" />);
    expect(screen.getByText("No items found")).toBeTruthy();
  });

  it("should render description when provided", () => {
    render(<EmptyState title="Empty" description="Try adding something" />);
    expect(screen.getByText("Try adding something")).toBeTruthy();
  });

  it("should render action link when actionLabel and actionHref provided", () => {
    render(<EmptyState title="Empty" actionLabel="Add" actionHref="/add" />);
    const link = screen.getByText("Add");
    expect(link.closest("a")?.getAttribute("href")).toBe("/add");
  });
});

describe("BackLink", () => {
  it("should render a link to home with label", () => {
    render(<BackLink label="Go back" />);
    const link = screen.getByText("Go back");
    expect(link).toBeTruthy();
    expect(link.closest("a")).toBeTruthy();
    expect(link.closest("a")?.getAttribute("href")).toBe("/");
  });

  it("should render a link to custom href", () => {
    render(<BackLink label="Back" href="/custom" />);
    const link = screen.getByText("Back");
    expect(link.closest("a")?.getAttribute("href")).toBe("/custom");
  });
});

describe("ErrorBanner", () => {
  it("should render error message", () => {
    render(<ErrorBanner message="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeTruthy();
  });
});
