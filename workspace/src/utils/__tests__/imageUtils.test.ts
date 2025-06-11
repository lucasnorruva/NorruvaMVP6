
import { getAiHintForImage } from '../imageUtils';

describe('getAiHintForImage', () => {
  it('uses imageHint when provided', () => {
    const result = getAiHintForImage({ imageHint: 'luxury leather handbag' });
    expect(result).toBe('luxury leather');
  });

  it('falls back to productName', () => {
    const result = getAiHintForImage({ productName: 'Blue Cotton Shirt' });
    expect(result).toBe('blue cotton');
  });

  it('falls back to category', () => {
    const result = getAiHintForImage({ category: 'Home Appliances' });
    expect(result).toBe('home');
  });

  it('defaults to generic phrase', () => {
    const result = getAiHintForImage({});
    expect(result).toBe('product photo');
  });
});