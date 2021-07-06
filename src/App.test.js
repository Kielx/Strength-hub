import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders strength-hub text", () => {
  render(<App />);
  const strengthHub = screen.getByText(/strength-hub/i);
  expect(strengthHub).toBeInTheDocument();
});

test("Sets one rep max correctly", () => {
  const app = render(<App />);
  const input = app.getAllByTestId("weightInput")[0];
  fireEvent.change(input, { target: { value: "23" } });
  expect(input.value).toBe("23");
});

test("It should not allow letters to be inputted", () => {
  const app = render(<App />);
  const input = app.getAllByTestId("weightInput")[0];

  fireEvent.change(input, { target: { value: "Hello" } });

  expect(input.value).toBe("");
});

test("It should allow input to be deleted", () => {
  const app = render(<App />);
  const input = app.getAllByTestId("weightInput")[0];
  fireEvent.change(input, { target: { value: "" } });
  expect(input.value).toBe("");
});

test("Proper output is calculated and displayed", () => {
  const app = render(<App />);
  const input = app.getAllByTestId("weightInput")[0];
  fireEvent.change(input, { target: { value: "120" } });
  expect(input.value).toBe("120");
  const output = screen.getAllByText(/70.2/i)[0];
  expect(output).toBeDefined();
});

test("Working checkboxes", () => {
  const app = render(<App />);
  const input = app.getAllByTestId("check")[0];

  fireEvent.change(input);
  expect(input.checked).toBe(false);
});
