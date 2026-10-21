import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WatchRender } from "./watch-render";

describe("WatchRender", () => {
  it("is announced by name when labelled", () => {
    render(
      <WatchRender
        dial="#1d2b4a"
        accent="#c9ced6"
        layout="chronograph"
        material="steel"
        label="پریمو"
      />,
    );
    expect(screen.getByRole("img", { name: "پریمو" })).toBeInTheDocument();
  });

  it("is hidden from assistive tech when decorative", () => {
    const { container } = render(
      <WatchRender dial="#efe6d2" accent="#8a6a3b" layout="three-hand" material="yellow-gold" />,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps gradient ids unique when rendered twice", () => {
    const { container } = render(
      <>
        <WatchRender dial="#000000" accent="#ffffff" layout="tourbillon" material="titanium" />
        <WatchRender dial="#000000" accent="#ffffff" layout="tourbillon" material="titanium" />
      </>,
    );
    const ids = [...container.querySelectorAll("linearGradient")].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
