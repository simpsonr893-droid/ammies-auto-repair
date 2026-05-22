import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('motion/react', () => ({
  motion: new Proxy({} as Record<string, React.FC>, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, rest, children),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App smoke test', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it("shows Sammie's Autobody brand name", () => {
    render(<App />);
    expect(screen.getAllByText("Sammie's").length).toBeGreaterThan(0);
  });

  it('renders the main navigation', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('renders the chat toggle button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /open chat|close chat/i })).toBeInTheDocument();
  });

  it('has a main landmark', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
