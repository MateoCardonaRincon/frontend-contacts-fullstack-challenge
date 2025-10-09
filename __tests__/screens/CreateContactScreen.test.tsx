import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import { CreateContactScreen } from '../../src/screens/CreateContactScreen';
import authenticationSlice from '../../src/redux/slices/authenticationSlice';
import contactsSlice from '../../src/redux/slices/contactsSlice';
import { ContactsService } from '../../src/services/contacts.service';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock ContactsService
jest.mock('../../src/services/contacts.service', () => ({
  ContactsService: jest.fn(),
}));

// Mock ContactsService implementation
const mockSaveContact = jest.fn();
const mockContactsService = {
  saveContact: mockSaveContact,
};

describe('CreateContactScreen', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset ContactsService mock
    (ContactsService as jest.Mock).mockReturnValue(mockContactsService);

    // Create store with initial state
    store = configureStore({
      reducer: {
        authentication: authenticationSlice,
        contacts: contactsSlice,
      },
      preloadedState: {
        authentication: {
          userId: 'd5f7e8c2-4a6b-4e9c-2f5a-7e9c3b5d8f1e',
          name: 'Test User',
          email: 'test@email.com',
          createdAt: '2025-01-15T08:00:00.000000',
          isAuth: true,
        },
        contacts: {
          contacts: [],
          currentPhone: '3118562340',
          currentContactId: '',
        },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <CreateContactScreen navigation={mockNavigation} />
      </Provider>,
    );
  };

  it('should render create contact screen correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText('¡Guarda tu contacto: 3118562340!')).toBeTruthy();
    expect(getByText('Nombre: ')).toBeTruthy();
    expect(getByText('Correo electrónico (opcional): ')).toBeTruthy();
    expect(getByTestId('regular-button-Volver')).toBeTruthy();
    expect(getByTestId('regular-button-Guardar')).toBeTruthy();
  });

  it('should show error when name is too short', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    // Find and fill name input with short text
    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[0];
    fireEvent.changeText(nameInput, 'A');

    // Click save button
    const saveButton = getByTestId('regular-button-Guardar');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El nombre debe tener al menos 2 caracteres',
      );
    });
  });

  it('should show error when email format is invalid', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[0];
    const emailInput = inputs[1];

    // Fill valid name and invalid email
    fireEvent.changeText(nameInput, 'Alejandra Moreno');
    fireEvent.changeText(emailInput, 'correo-sin-formato');

    // Click save button
    const saveButton = getByTestId('regular-button-Guardar');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El email no tiene un formato válido',
      );
    });
  });

  it('should save contact successfully with valid data', async () => {
    const mockContactResponse = {
      id: 'f8c9d1e4-6b7a-4f5c-8e2d-9a1f4c7e6b8d',
      name: 'Santiago Rodríguez',
      cellphone: '3118562340',
      created_at: '2025-01-18T14:25:00.000000',
      user_id: 'd5f7e8c2-4a6b-4e9c-2f5a-7e9c3b5d8f1e',
    };

    mockSaveContact.mockResolvedValue(mockContactResponse);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[0];
    const emailInput = inputs[1];

    // Fill valid data
    fireEvent.changeText(nameInput, 'Santiago Rodríguez');
    fireEvent.changeText(emailInput, 'santiago.rodriguez@empresa.com.co');

    // Click save button
    const saveButton = getByTestId('regular-button-Guardar');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(mockSaveContact).toHaveBeenCalledWith({
        email: 'santiago.rodriguez@empresa.com.co',
        name: 'Santiago Rodríguez',
        cellphone: '3118562340',
        user_id: 'd5f7e8c2-4a6b-4e9c-2f5a-7e9c3b5d8f1e',
        is_favorite: false,
      });
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should save contact successfully with empty email', async () => {
    const mockContactResponse = {
      id: 'a1b2c3d4-5e6f-4789-abc1-2def4567890a',
      name: 'Camila Peña',
      cellphone: '3118562340',
      created_at: '2025-01-18T15:10:00.000000',
      user_id: 'd5f7e8c2-4a6b-4e9c-2f5a-7e9c3b5d8f1e',
    };

    mockSaveContact.mockResolvedValue(mockContactResponse);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[0];

    // Fill only name (email stays empty)
    fireEvent.changeText(nameInput, 'Camila Peña');

    // Click save button
    const saveButton = getByTestId('regular-button-Guardar');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(mockSaveContact).toHaveBeenCalledWith({
        email: '',
        name: 'Camila Peña',
        cellphone: '3118562340',
        user_id: 'd5f7e8c2-4a6b-4e9c-2f5a-7e9c3b5d8f1e',
        is_favorite: false,
      });
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should show error when save contact fails', async () => {
    mockSaveContact.mockResolvedValue(null);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[0];

    // Fill valid name
    fireEvent.changeText(nameInput, 'Mateo Herrera');

    // Click save button
    const saveButton = getByTestId('regular-button-Guardar');

    await act(async () => {
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Ocurrió un error guardando el contacto',
      );
    });
  });

  it('should navigate back to menu when volver button is pressed', async () => {
    const { getByTestId } = renderComponent();

    // Click volver button
    const volverButton = getByTestId('regular-button-Volver');
    fireEvent.press(volverButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });
});
