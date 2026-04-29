import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInterface from './ChatInterface';
import * as geminiService from '@/src/services/geminiService';

// Mock the API service completely so we don't hit the real network in tests
vi.mock('@/src/services/geminiService', () => ({
  getChatResponse: vi.fn(),
}));

describe('ChatInterface Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the initial assistant greeting', () => {
    render(<ChatInterface />);
    
    expect(screen.getByRole('log', { name: /conversation history/i })).toBeInTheDocument();
    expect(screen.getByText(/Hello! I’m HealthNet AI/i)).toBeInTheDocument();
  });

  it('allows user to type a message but disables "Send" if empty', async () => {
    const user = userEvent.setup();
    render(<ChatInterface />);

    const input = screen.getByRole('textbox', { name: /message input/i });
    const sendButton = screen.getByRole('button', { name: /send message/i });

    // Initial state
    expect(sendButton).toBeDisabled();

    // Type something
    await user.type(input, 'I have a fever');
    expect(input).toHaveValue('I have a fever');
    expect(sendButton).not.toBeDisabled();

    // Clear input
    await user.clear(input);
    expect(sendButton).toBeDisabled();
  });

  it('sends a message and displays the AI response', async () => {
    const user = userEvent.setup();
    
    // Mock the API resolution
    // @ts-ignore
    geminiService.getChatResponse.mockResolvedValueOnce({
      role: 'assistant',
      content: 'You should rest and drink plenty of fluids.',
      reasoning: {
        steps: ['Analyze fever symptom', 'Recommend common cold protocol'],
        confidence: 0.95
      }
    });

    render(<ChatInterface />);

    const input = screen.getByRole('textbox', { name: /message input/i });
    const sendButton = screen.getByRole('button', { name: /send message/i });

    await user.type(input, 'I have a fever');
    await user.click(sendButton);

    // Verify user message appears in log
    expect(screen.getByText('I have a fever')).toBeInTheDocument();
    
    // Input should be cleared
    expect(input).toHaveValue('');

    // Wait for the mock API to resolve and append the response to the UI
    await waitFor(() => {
      expect(screen.getByText('You should rest and drink plenty of fluids.')).toBeInTheDocument();
    });

    // Check if the getChatResponse was called with the correct payload structure
    expect(geminiService.getChatResponse).toHaveBeenCalledTimes(1);
    expect(geminiService.getChatResponse).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ content: 'I have a fever' })
      ])
    );
  });
});
