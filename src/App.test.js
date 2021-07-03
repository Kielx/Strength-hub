import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders strength-hub text", () => {
  render(<App />);
  const strengthHub = screen.getByText(/strength-hub/i);
  expect(strengthHub).toBeInTheDocument();
});
