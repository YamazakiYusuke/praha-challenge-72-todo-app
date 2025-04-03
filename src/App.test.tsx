import { useAuth0 } from '@auth0/auth0-react';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.Mock;

describe('App', () => {
  test('renders login button when not authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    });

    render(<App />);
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
  });

  test('renders todo app when authenticated', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    });

    render(<App />);
    const labelElement = screen.getByLabelText(/Add Todo/i);
    expect(labelElement).toBeInTheDocument();
  });

  test('renders loading state', () => {
    mockUseAuth0.mockReturnValue({
      isLoading: true,
    });

    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});
