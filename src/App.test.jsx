import { render, screen } from '@testing-library/react';
import App from './App';

test('renders react sample', () => {
  render(<App />);
  const linkElement = screen.getByText(/react sample/i);
  expect(linkElement).toBeInTheDocument();
});
