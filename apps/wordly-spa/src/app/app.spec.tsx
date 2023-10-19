import { render } from '@testing-library/react';

import WordlyGame from './WordlyGame';

describe('WordlyGame', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<WordlyGame />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<WordlyGame />);
    expect(getByText(/Welcome wordly-spa/gi)).toBeTruthy();
  });
});
