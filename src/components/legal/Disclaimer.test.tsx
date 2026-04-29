import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Disclaimer from './Disclaimer';

describe('Disclaimer Component', () => {
  it('renders with the expected semantic roles and content', () => {
    render(<Disclaimer />);

    // Check semantic role
    const disclaimerCard = screen.getByRole('note', { name: /ethical and legal disclaimer/i });
    expect(disclaimerCard).toBeInTheDocument();

    // Check title text
    expect(screen.getByText('Ethical & Legal Notice')).toBeInTheDocument();

    // Check important notice text
    expect(
      screen.getByText(/HealthNet AI is an experimental clinical decision support system/i)
    ).toBeInTheDocument();

    // Check sub-sections
    expect(screen.getByText('Legal Status')).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(/not a medical device/i);
    
    expect(screen.getByText('Privacy & Ethics')).toBeInTheDocument();
    expect(screen.getByRole('note')).toHaveTextContent(/data is processed securely/i);
  });
});
