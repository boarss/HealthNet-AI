import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HerbalGuide from './HerbalGuide';

describe('HerbalGuide Component', () => {
  it('renders the initial list of remedies', () => {
    render(<HerbalGuide />);

    expect(screen.getByText('Ginger')).toBeInTheDocument();
    expect(screen.getByText('Chamomile')).toBeInTheDocument();
    expect(screen.getByText('Echinacea')).toBeInTheDocument();
    expect(screen.getByText('Peppermint')).toBeInTheDocument();
    expect(screen.getByText('Turmeric')).toBeInTheDocument();
  });

  it('filters remedies based on search text', async () => {
    const user = userEvent.setup();
    render(<HerbalGuide />);

    const searchInput = screen.getByPlaceholderText(/search remedies/i);
    
    // Type 'ginger'
    await user.type(searchInput, 'ginger');

    // Ginger should be visible
    expect(screen.getByText('Ginger')).toBeInTheDocument();
    
    // Others should not
    await waitFor(() => {
      expect(screen.queryByText('Chamomile')).not.toBeInTheDocument();
      expect(screen.queryByText('Turmeric')).not.toBeInTheDocument();
    });
  });

  it('filters remedies based on category buttons', async () => {
    const user = userEvent.setup();
    render(<HerbalGuide />);

    // Click 'Stress' category button
    const stressButton = screen.getByRole('button', { name: 'Stress', pressed: false });
    await user.click(stressButton);

    // Only Chamomile is in Stress category
    expect(screen.getByText('Chamomile')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Ginger')).not.toBeInTheDocument();
    });

    // Verify button is marked as pressed
    expect(stressButton).toHaveAttribute('aria-pressed', 'true');

    // Click 'All' to reset
    const allButton = screen.getByRole('button', { name: /All Remedies/i });
    await user.click(allButton);
    expect(screen.getByText('Ginger')).toBeInTheDocument();
  });
});
