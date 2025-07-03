import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from './chat-input';

// Mock the translation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simple translation mock
  }),
}));

// Mock the useDropzone hook
jest.mock('react-dropzone', () => ({
  useDropzone: (config: any) => {
    return {
      getInputProps: () => ({}),
      ...config,
    };
  },
}));

describe('ChatInput', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn((e) => e.preventDefault());
  const mockOnEmojiClick = jest.fn();
  const mockOnFileUpload = jest.fn();
  const mockOnRemoveFile = jest.fn();

  const defaultProps = {
    value: '',
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    onEmojiClick: mockOnEmojiClick,
    onFileUpload: mockOnFileUpload,
    selectedFiles: [],
    onRemoveFile: mockOnRemoveFile,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chat input with all buttons', () => {
    render(<ChatInput {...defaultProps} />);

    expect(screen.getByPlaceholderText('TYPE_MESSAGE...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /attach file/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open emoji picker/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  test('calls onChange when typing in input', () => {
    render(<ChatInput {...defaultProps} />);
    const input = screen.getByPlaceholderText('TYPE_MESSAGE...');

    fireEvent.change(input, { target: { value: 'Hello' } });
    expect(mockOnChange).toHaveBeenCalledWith('Hello');
  });

  test('calls onSubmit when form is submitted', () => {
    render(<ChatInput {...defaultProps} value="Test message" />);
    const form = screen.getByTestId('chat-form');

    fireEvent.submit(form);
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('shows plus button and dropdown when input has text', () => {
    render(<ChatInput {...defaultProps} value="Test" />);

    expect(screen.getByRole('button', { name: /more options/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /upload image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /attach file/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /open emoji picker/i })).not.toBeInTheDocument();
  });

  test('displays selected files', () => {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    render(<ChatInput {...defaultProps} selectedFiles={[testFile]} />);

    expect(screen.getByText('test.png')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove file test\.png/i })).toBeInTheDocument();
  });

  test('calls onRemoveFile when remove button is clicked', () => {
    const testFile = new File(['test'], 'test.png', { type: 'image/png' });
    render(<ChatInput {...defaultProps} selectedFiles={[testFile]} />);

    const removeButton = screen.getByRole('button', { name: /remove file test\.png/i });
    fireEvent.click(removeButton);
    expect(mockOnRemoveFile).toHaveBeenCalledWith(0);
  });

  test('handles file upload via image button', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const { container } = render(<ChatInput {...defaultProps} />);

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnFileUpload).toHaveBeenCalledWith([file]);
  });

  test('handles emoji button click', () => {
    render(<ChatInput {...defaultProps} />);

    const emojiButton = screen.getByRole('button', { name: /emoji/i });
    fireEvent.click(emojiButton);
    expect(mockOnEmojiClick).toHaveBeenCalled();
  });
});
