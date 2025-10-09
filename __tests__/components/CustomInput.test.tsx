/**
 * @format
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { jest, describe, it, expect } from '@jest/globals';
import { CustomInput } from '../../src/components/atoms/CustomInput';

describe('CustomInput', () => {
  it('renders correctly', () => {
    const mockAction = jest.fn();
    const { getByTestId } = render(
      <CustomInput action={mockAction} isSensitive={false} />,
    );

    expect(getByTestId).toBeDefined();
  });

  it('calls action when text changes', () => {
    const mockAction = jest.fn();
    const { getByTestId } = render(
      <CustomInput action={mockAction} isSensitive={false} />,
    );

    const textInput = getByTestId('custom-input');
    fireEvent.changeText(textInput, 'test text');

    expect(mockAction).toHaveBeenCalledWith('test text');
  });

  it('renders with secure text entry when isSensitive is true', () => {
    const mockAction = jest.fn();
    const { getByTestId } = render(
      <CustomInput action={mockAction} isSensitive={true} />,
    );

    const textInput = getByTestId('custom-input');
    expect(textInput.props.secureTextEntry).toBe(true);
  });

  it('renders without secure text entry when isSensitive is false', () => {
    const mockAction = jest.fn();
    const { getByTestId } = render(
      <CustomInput action={mockAction} isSensitive={false} />,
    );

    const textInput = getByTestId('custom-input');
    expect(textInput.props.secureTextEntry).toBe(false);
  });
});
