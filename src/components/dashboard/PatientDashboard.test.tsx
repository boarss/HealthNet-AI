import { render, screen } from '@testing-library/react';
import PatientDashboard from './PatientDashboard';

describe('PatientDashboard Component', () => {
  it('renders vital signs correctly', () => {
    render(<PatientDashboard />);

    // Check vitals region exists
    expect(screen.getByRole('region', { name: /patient vitals/i })).toBeInTheDocument();

    const vitalsRegion = screen.getByRole('region', { name: /patient vitals/i });

    // Check Heart Rate
    expect(screen.getByText('Heart Rate')).toBeInTheDocument();
    expect(vitalsRegion).toHaveTextContent('72');

    // Check Blood Pressure
    expect(screen.getByText('Blood Pressure')).toBeInTheDocument();
    expect(vitalsRegion).toHaveTextContent('120/80');

    // Check Temperature
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(vitalsRegion).toHaveTextContent('98.6');
  });

  it('renders active conditions and medications', () => {
    render(<PatientDashboard />);

    expect(screen.getByText('Hypertension')).toBeInTheDocument();
    expect(screen.getByText('Type 2 Diabetes (Managed)')).toBeInTheDocument();
    expect(screen.getByText('Metformin 500 mg')).toBeInTheDocument();
    expect(screen.getByText('Lisinopril 10 mg')).toBeInTheDocument();
  });

  it('renders the vaccination schedule', () => {
    render(<PatientDashboard />);

    // Check the list role
    const vaccinationList = screen.getByRole('list', { name: /vaccination history/i });
    expect(vaccinationList).toBeInTheDocument();

    // Check list items
    expect(screen.getByText('Influenza (Annual)')).toBeInTheDocument();
    expect(screen.getByText('Pneumococcal')).toBeInTheDocument();
    
    // Check status badges
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
  });
});
