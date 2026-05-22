import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Nav from '../components/Nav';

describe('Nav', () => {
  it('renders the brand name', () => {
    render(<Nav onOpenChat={vi.fn()} />);
    expect(screen.getByText("Sammie's")).toBeInTheDocument();
    expect(screen.getByText('Autobody')).toBeInTheDocument();
  });

  it('renders the Free Estimate button', () => {
    render(<Nav onOpenChat={vi.fn()} />);
    expect(screen.getByRole('button', { name: /free estimate/i })).toBeInTheDocument();
  });

  it('calls onOpenChat when Free Estimate is clicked', () => {
    const onOpenChat = vi.fn();
    render(<Nav onOpenChat={onOpenChat} />);
    fireEvent.click(screen.getByRole('button', { name: /free estimate/i }));
    expect(onOpenChat).toHaveBeenCalledOnce();
  });

  it('has a main navigation landmark', () => {
    render(<Nav onOpenChat={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('toggles mobile menu on hamburger click', () => {
    render(<Nav onOpenChat={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: /open menu/i });
    expect(toggle).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });
});
