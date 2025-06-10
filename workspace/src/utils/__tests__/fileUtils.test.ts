
import { describe, it, expect, vi } from 'vitest';
import { fileToDataUri } from '../fileUtils';

// Mock FileReader
const mockFileReader = {
  readAsDataURL: vi.fn(),
  onload: vi.fn(),
  onerror: vi.fn(),
  result: '',
};
vi.stubGlobal('FileReader', vi.fn(() => mockFileReader));

// Mock File
const createMockFile = (name = 'test.png', type = 'image/png', content = ['content']) => {
  const blob = new Blob(content, { type });
  return new File([blob], name, { type });
};

describe('fileToDataUri', () => {
  it('should resolve with a data URI on successful file read', async () => {
    const mockFile = createMockFile();
    const mockDataUri = 'data:image/png;base64,Y29udGVudA=='; // "content" base64 encoded

    // Simulate successful load
    mockFileReader.readAsDataURL = vi.fn((file) => {
      expect(file).toBe(mockFile);
      mockFileReader.result = mockDataUri;
      // Call onload directly as if the event triggered
      if (typeof mockFileReader.onload === 'function') {
        (mockFileReader.onload as EventListener)({} as Event);
      }
    });

    const promise = fileToDataUri(mockFile);

    // Since onload is called synchronously in the mock, we can await directly
    await expect(promise).resolves.toBe(mockDataUri);
    expect(FileReader).toHaveBeenCalledTimes(1);
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });

  it('should reject with an error on file read error', async () => {
    const mockFile = createMockFile();
    const mockError = new Error('File read failed');

    // Simulate error
    mockFileReader.readAsDataURL = vi.fn((file) => {
      expect(file).toBe(mockFile);
      // Call onerror directly as if the event triggered
      if (typeof mockFileReader.onerror === 'function') {
         (mockFileReader.onerror as any)(mockError); // Pass the error object
      }
    });
    
    const promise = fileToDataUri(mockFile);

    await expect(promise).rejects.toBe(mockError);
    expect(FileReader).toHaveBeenCalledTimes(1); // Ensure FileReader was instantiated
    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(mockFile);
  });
});
