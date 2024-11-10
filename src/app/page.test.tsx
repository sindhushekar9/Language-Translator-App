import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Translator from './page';
import { Language } from './types';
import test, { describe } from 'node:test';

// Mocking global fetch function
global.fetch = jest.fn()
  .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ joke: 'Why did the chicken cross the road? To get to the other side!' }) }) // For joke fetch
  .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ translatedText: 'Pollo traducido' }) }) // For translation fetch
  .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ amount: 1, joke: 'Why did the chicken cross the road? To get to the other side!' }) }) // Joke API
  .mockRejectedValueOnce(new Error('Failed to fetch joke')) // Simulate joke fetch error
  .mockRejectedValueOnce(new Error('Failed to fetch translation')) // Simulate translation fetch error
  .mockResolvedValueOnce({ json: jest.fn().mockResolvedValue({ joke: 'What do you call fake spaghetti? An impasta!' }) }); // For joke regeneration

describe('Translator Component Tests', () => {

  // 1. Test Case: Render Initial UI Elements
  test('should render initial UI elements', () => {
    render(<Translator />);

    // Header check
    expect(screen.getByText('Language Translator App')).toBeInTheDocument();
    expect(screen.getByText(/A web application using Next.js and TypeScript/)).toBeInTheDocument();

    // Check if skeleton is displayed
    expect(screen.getByTestId('skeleton-joke')).toBeInTheDocument();

    // Buttons check
    expect(screen.getByText('Regenerate')).toBeInTheDocument();
    expect(screen.getByText('Translate')).toBeInTheDocument();
  });

  // 2. Test Case: Fetch Joke API
  test('fetches and displays jokes correctly', async () => {
    render(<Translator />);

    // Wait for joke to be displayed
    await waitFor(() => expect(screen.queryByText('Why did the chicken cross the road? To get to the other side!')).toBeInTheDocument());
  });

  // 3. Test Case: Translate Joke
  test('should translate joke when language is selected', async () => {
    render(<Translator />);

    // Wait for joke to be displayed
    await waitFor(() => screen.getByText('Why did the chicken cross the road? To get to the other side!'));

    // Select a language (mocked language)
    const mockedLanguage: Language = { language: 'es', name: 'Spanish' };
    fireEvent.change(screen.getByLabelText('Select Language'), { target: { value: mockedLanguage.language } });

    // Translate joke
    fireEvent.click(screen.getByText('Translate'));

    // Wait for translated joke
    await waitFor(() => expect(screen.getByText('Pollo traducido')).toBeInTheDocument());
  });

  // 4. Test Case: Show Toast Notification if No Language is Selected
  test('should show error toastr if no language selected', async () => {
    render(<Translator />);

    // Wait for joke to be displayed
    await waitFor(() => screen.getByText('Why did the chicken cross the road? To get to the other side!'));

    // Click translate without selecting language
    fireEvent.click(screen.getByText('Translate'));

    // Wait for toast notification
    await waitFor(() => expect(screen.getByText('Please select a language')).toBeInTheDocument());
  });

//   // 5. Test Case: Handle Joke Fetch Error
//   test('should show error message if joke fetch fails', async () => {
//     global.fetch.mockRejectedValueOnce(new Error('Failed to fetch joke'));

//     render(<Translator />);

//     // Wait for error message
//     await waitFor(() => screen.getByText('Failed to fetch joke. Please try again.'));
//   });

  // 6. Test Case: Handle Translation Fetch Error
  test('should show error message if translation fails', async () => {
    render(<Translator />);

    // Wait for joke to be displayed
    await waitFor(() => screen.getByText('Why did the chicken cross the road? To get to the other side!'));

    // Select a language (mocked language)
    const mockedLanguage: Language = { language: 'es', name: 'Spanish' };
    fireEvent.change(screen.getByLabelText('Select Language'), { target: { value: mockedLanguage.language } });

    // Click translate
    fireEvent.click(screen.getByText('Translate'));

    // Wait for error message
    await waitFor(() => screen.getByText('Failed to translate. Please try again.'));
  });

  // 7. Test Case: Regenerate Joke
  test('should regenerate a new joke when clicked', async () => {
    render(<Translator />);

    // Wait for initial joke to be displayed
    await waitFor(() => screen.getByText('Why did the chicken cross the road? To get to the other side!'));

    // Click regenerate
    fireEvent.click(screen.getByText('Regenerate'));

    // Wait for the new joke to be displayed
    await waitFor(() => screen.getByText('What do you call fake spaghetti? An impasta!'));
  });

});
