import { getAiHintForImage } from '../imageUtils';

describe('getAiHintForImage', () => {
  it('returns the imageHint when provided', () => {
    const result = getAiHintForImage({ imageHint: 'shiny phone' });
    expect(result).toBe('shiny phone');
  });

  it('uses the product name as fallback', () => {
    const result = getAiHintForImage({ productName: 'Eco-Friendly Water Bottle' });
    expect(result).toBe('eco-friendly water');
  });

  it('uses the category if nothing else is available', () => {
    const result = getAiHintForImage({ category: 'Electronics' });
    expect(result).toBe('electronics');
  });

  it('returns a default phrase when no info exists', () => {
    const result = getAiHintForImage({});
    expect(result).toBe('product photo');
  });
});
