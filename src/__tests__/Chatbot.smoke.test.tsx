import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Chatbot from '../components/Chatbot';

// Replace Framer/Motion with plain HTML elements so jsdom doesn't choke on animation APIs
vi.mock('motion/react', () => ({
  motion: new Proxy({} as Record<string, React.FC>, {
    get: (_t, tag: string) =>
      ({ children, ...rest }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
        React.createElement(tag, rest, children),
  }),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Chatbot (closed)', () => {
  it('renders the chat toggle button', () => {
    render(<Chatbot isOpen={false} setIsOpen={vi.fn()} />);
    expect(screen.getByRole('button', { name: /open chat/i })).toBeInTheDocument();
  });

  it('does not render the chat panel when closed', () => {
    render(<Chatbot isOpen={false} setIsOpen={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

describe('Chatbot (open)', () => {
  it('renders the chat dialog', () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows the greeting message', () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    expect(screen.getByText(/Sammie's AI assistant/i)).toBeInTheDocument();
  });

  it('has an accessible input field', () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    expect(screen.getByLabelText(/type a message/i)).toBeInTheDocument();
  });

  it('send button is disabled when input is empty', () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('send button enables when input has text', () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/type a message/i), { target: { value: 'Hello' } });
    expect(screen.getByRole('button', { name: /send message/i })).not.toBeDisabled();
  });

  it('calls fetch and shows bot reply on send', async () => {
    render(<Chatbot isOpen={true} setIsOpen={vi.fn()} />);
    fireEvent.change(screen.getByLabelText(/type a message/i), {
      target: { value: 'What services do you offer?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    await waitFor(() =>
      expect(screen.getByText(/I'm Sammie's assistant/i)).toBeInTheDocument()
    );
  });

  it('calls setIsOpen(false) when close button in header is clicked', () => {
    const setIsOpen = vi.fn();
    render(<Chatbot isOpen={true} setIsOpen={setIsOpen} />);
    const closeButtons = screen.getAllByRole('button', { name: /close chat/i });
    fireEvent.click(closeButtons[0]);
    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});
