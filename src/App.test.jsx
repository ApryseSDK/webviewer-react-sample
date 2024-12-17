import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch globally prventing the error by intercepting all fetch calls and returning mock data.
global.fetch = vi.fn((url) =>
  Promise.resolve({
    text: () => Promise.resolve(`Mocked fetch content for URL: ${url}`),
  })
);

test('renders react sample', () => {
  render(<App />);
  const linkElement = screen.getByText(/react sample/i);
  expect(linkElement).toBeInTheDocument();
});
