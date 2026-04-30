import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Disclaimer from './Disclaimer';

describe('Disclaimer Component', () => {
  it('renders with the expected semantic roles and content', () => {
    render(<Disclaimer />);

    // Check semantic role (Critical notice)
    const criticalNotice = screen.getByRole('note', { name: /critical medical disclaimer/i });
    expect(criticalNotice).toBeInTheDocument();

    // Check title text
    expect(screen.getByText('Experimental System')).toBeInTheDocument();

    // Check important notice text
    expect(criticalNotice).toHaveTextContent(/HealthNet AI is an experimental clinical decision support system/i);

    // Check sub-sections
    expect(screen.getByText('Legal Status')).toBeInTheDocument();
    expect(screen.getByText(/Privacy & Ethics/i)).toBeInTheDocument();
    
    // Check content through text content matchers
    const body = document.body;
    expect(body).toHaveTextContent(/not a medical device/i);
    expect(body).toHaveTextContent(/data is processed securely/i);
  });
});
