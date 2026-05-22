import '@testing-library/jest-dom';

// jsdom does not implement scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

// Stub Web Speech API (not in jsdom)
Object.defineProperty(window, 'speechSynthesis', {
  value: { speak: vi.fn(), cancel: vi.fn() },
  writable: true,
});

// Stub matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

// Stub fetch for /api/chat
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ text: "I'm Sammie's assistant. How can I help?" }),
} as Response);
