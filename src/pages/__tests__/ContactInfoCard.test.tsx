import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MapPin, Phone } from "lucide-react";
import { ContactInfoCard } from "@/pages/Contact";

describe("ContactInfoCard", () => {
  it("renders an entry without href as a non-link div (no crash)", () => {
    const { container } = render(<ContactInfoCard icon={MapPin} label="Location" value="Cairo - Egypt" />);
    expect(screen.getByText("Cairo - Egypt")).toBeInTheDocument();
    expect(container.querySelector("a")).toBeNull();
  });

  it("renders a tel link left-to-right", () => {
    render(<ContactInfoCard icon={Phone} label="Phone" value="+20 11" href="tel:+2011" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "tel:+2011");
    expect(screen.getByText("+20 11")).toHaveAttribute("dir", "ltr");
  });
});
