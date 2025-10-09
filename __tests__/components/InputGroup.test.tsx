/**
 * @format
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { InputGroup } from '../../src/components/molecules/InputGroup';

describe('InputGroup', () => {
  const mockInputAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input group with label and input', () => {
    render(
      <InputGroup
        text="Email"
        inputAction={mockInputAction}
        isSensitive={false}
      />
    );

    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByTestId('custom-input')).toBeTruthy();
  });

  it('should call inputAction when input changes', () => {
    render(
      <InputGroup
        text="Password"
        inputAction={mockInputAction}
        isSensitive={true}
      />
    );

    const input = screen.getByTestId('custom-input');
    fireEvent.changeText(input, 'test password');

    expect(mockInputAction).toHaveBeenCalledWith('test password');
  });

  it('should render sensitive input correctly', () => {
    render(
      <InputGroup
        text="Password"
        inputAction={mockInputAction}
        isSensitive={true}
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should render non-sensitive input correctly', () => {
    render(
      <InputGroup
        text="Email"
        inputAction={mockInputAction}
        isSensitive={false}
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input.props.secureTextEntry).toBe(false);
  });

  it('should render with different labels', () => {
    const { rerender } = render(
      <InputGroup
        text="First Label"
        inputAction={mockInputAction}
        isSensitive={false}
      />
    );

    expect(screen.getByText('First Label')).toBeTruthy();

    rerender(
      <InputGroup
        text="Second Label"
        inputAction={mockInputAction}
        isSensitive={false}
      />
    );

    expect(screen.getByText('Second Label')).toBeTruthy();
    expect(screen.queryByText('First Label')).toBeNull();
  });

  it('should default to non-sensitive when isSensitive not provided', () => {
    render(
      <InputGroup
        text="Default Input"
        inputAction={mockInputAction}
      />
    );

    const input = screen.getByTestId('custom-input');
    expect(input.props.secureTextEntry).toBe(false);
  });
});
