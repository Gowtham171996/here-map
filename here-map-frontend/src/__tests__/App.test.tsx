import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('../utils/env', () => ({
  getHereApiKey: () => 'rengnekgnerlgnsldvnwenfwkrjnes',
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  it('renders form and map', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<App />);

    expect(screen.getByPlaceholderText('Latitude')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Longitude')).toBeInTheDocument();
  });

  it('submits marker point', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ status: 201 });

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText('Latitude'), {
      target: { value: '12.97' },
    });
    fireEvent.change(screen.getByPlaceholderText('Longitude'), {
      target: { value: '77.59' },
    });

    fireEvent.click(screen.getByText('Add Marker'));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/points'),
        { lat: 12.97, lng: 77.59 }
      );
    });
  });
});