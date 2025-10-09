import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Alert } from 'react-native';
import { UpdateContactScreen } from '../../src/screens/UpdateContactScreen';
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
const mockUpdateContact = jest.fn();
const mockContactsService = {
  updateContact: mockUpdateContact,
};

describe('UpdateContactScreen', () => {
  let store: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset ContactsService mock
    (ContactsService as jest.Mock).mockReturnValue(mockContactsService);

    // Create store with initial state including existing contacts
    store = configureStore({
      reducer: {
        authentication: authenticationSlice,
        contacts: contactsSlice,
      },
      preloadedState: {
        authentication: {
          userId: 'a3e7f8c1-2b4d-4c9e-8f1a-3d5e7b9c1a2f',
          name: 'Test User',
          email: 'test@email.com',
          createdAt: '2025-01-15T08:00:00.000000',
          isAuth: true,
        },
        contacts: {
          contacts: [
            {
              id: 'b7c8d9e2-3f4a-4b5c-9e2d-4a6f8c1e3b7a',
              name: 'Alejandro Herrera',
              cellphone: '3124567890',
              email: 'alejandro.herrera@email.com',
              created_at: '2025-01-15T08:30:00.000000',
              is_favorite: false,
              user_id: 'a3e7f8c1-2b4d-4c9e-8f1a-3d5e7b9c1a2f',
            },
          ],
          currentPhone: '',
          currentContactId: 'c9d1e4f3-5a6b-4d7e-1f4c-6b8d2a4f7e9c',
        },
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <UpdateContactScreen navigation={mockNavigation} />
      </Provider>,
    );
  };

  it('should render update contact screen correctly', () => {
    const { getByText, getByTestId } = renderComponent();

    expect(getByText('¡Actualiza tu contacto!')).toBeTruthy();
    expect(getByText('Celular: ')).toBeTruthy();
    expect(getByText('Nombre: ')).toBeTruthy();
    expect(getByText('Correo electrónico (opcional): ')).toBeTruthy();
    expect(getByTestId('regular-button-Volver')).toBeTruthy();
    expect(getByTestId('regular-button-Actualizar')).toBeTruthy();
  });

  it('should show error when phone is not numeric', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];

    // Fill non-numeric phone and valid name
    fireEvent.changeText(phoneInput, 'abc123');
    fireEvent.changeText(nameInput, 'Isabel Morales');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');

    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono debe ser numérico',
      );
    });
  });

  it('should show error when phone already exists', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];

    // Fill existing phone number and valid name
    fireEvent.changeText(phoneInput, '3124567890');
    fireEvent.changeText(nameInput, 'Diana Espinosa');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');

    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El número de teléfono ya está registrado',
      );
    });
  });

  it('should show error when name is too short', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];

    // Fill valid phone and short name
    fireEvent.changeText(phoneInput, '987654321');
    fireEvent.changeText(nameInput, 'A');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');
    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El nombre debe tener al menos 2 caracteres',
      );
    });
  });

  it('should show error when email format is invalid', async () => {
    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];
    const emailInput = inputs[2];

    // Fill valid data and invalid email
    fireEvent.changeText(phoneInput, '987654321');
    fireEvent.changeText(nameInput, 'Carolina López');
    fireEvent.changeText(emailInput, 'invalid-email');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');
    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'El email no tiene un formato válido',
      );
    });
  });

  it('should update contact successfully with valid data', async () => {
    const mockContactResponse = {
      id: 'c9d1e4f3-5a6b-4d7e-1f4c-6b8d2a4f7e9c',
      name: 'Roberto Méndez',
      cellphone: '3001234567',
      created_at: '2025-01-18T16:45:00.000000',
      user_id: 'a3e7f8c1-2b4d-4c9e-8f1a-3d5e7b9c1a2f',
    };

    mockUpdateContact.mockResolvedValue(mockContactResponse);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];
    const emailInput = inputs[2];

    // Fill valid data
    fireEvent.changeText(phoneInput, '3001234567');
    fireEvent.changeText(nameInput, 'Roberto Méndez');
    fireEvent.changeText(emailInput, 'roberto.mendez@empresa.com.co');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');
    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(mockUpdateContact).toHaveBeenCalledWith(
        {
          email: 'roberto.mendez@empresa.com.co',
          name: 'Roberto Méndez',
          cellphone: '3001234567',
        },
        'c9d1e4f3-5a6b-4d7e-1f4c-6b8d2a4f7e9c',
      );
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should update contact successfully with empty phone and email', async () => {
    const mockContactResponse = {
      id: 'c9d1e4f3-5a6b-4d7e-1f4c-6b8d2a4f7e9c',
      name: 'Sofía Ramírez',
      cellphone: '',
      created_at: '2025-01-18T17:20:00.000000',
      user_id: 'a3e7f8c1-2b4d-4c9e-8f1a-3d5e7b9c1a2f',
    };

    mockUpdateContact.mockResolvedValue(mockContactResponse);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const nameInput = inputs[1];

    // Fill only name (phone and email stay empty)
    fireEvent.changeText(nameInput, 'Sofía Ramírez');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');
    await act(async () => {
      fireEvent.press(updateButton);
    });

    await waitFor(() => {
      expect(mockUpdateContact).toHaveBeenCalledWith(
        {
          email: '',
          name: 'Sofía Ramírez',
          cellphone: '',
        },
        'c9d1e4f3-5a6b-4d7e-1f4c-6b8d2a4f7e9c',
      );
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });

  it('should show error when update contact fails', async () => {
    mockUpdateContact.mockResolvedValue(null);

    const { getAllByTestId, getByTestId } = renderComponent();

    const inputs = getAllByTestId('custom-input');
    const phoneInput = inputs[0];
    const nameInput = inputs[1];

    // Fill valid data
    fireEvent.changeText(phoneInput, '987654321');
    fireEvent.changeText(nameInput, 'Mateo Herrera');

    // Click update button
    const updateButton = getByTestId('regular-button-Actualizar');
    await act(async () => {
      fireEvent.press(updateButton);
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
    await act(async () => {
      fireEvent.press(volverButton);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('MenuScreen');
    });
  });
});
