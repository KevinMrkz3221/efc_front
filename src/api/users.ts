const API_URL = import.meta.env.VITE_EFC_API_URL || 'http://localhost:8000';

// Función helper para manejar respuestas
async function handleResponse(response, operation = 'operación') {
  console.log(`📡 ${operation} response:`, response.status, response.statusText);
  
  if (response.status === 401) {
    console.error('❌ Unauthorized - session expired');
    throw new Error('SESSION_EXPIRED');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ ${operation} error:`, response.status, errorText);
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  
  // Verificar que la respuesta es JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('❌ Response is not JSON:', text.substring(0, 200));
    throw new Error('El servidor no devolvió JSON válido');
  }
  
  return response.json();
}

export async function fetchUsers(token) {
  try {
    const url = `${API_URL}/user/users/`;
    console.log('👥 Fetching users from:', url);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const data = await handleResponse(res, 'Fetch Users');
    console.log('✅ Users data received');
    return data;
    
  } catch (error) {
    console.error('❌ Error in fetchUsers:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión al servidor');
    }
    throw error;
  }
}

export async function createUser(token, userData) {
  try {
    const url = `${API_URL}/user/users/`;
    console.log('➕ Creating user at:', url);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(res, 'Create User');
    console.log('✅ User created successfully');
    return data;
    
  } catch (error) {
    console.error('❌ Error in createUser:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión al servidor');
    }
    throw error;
  }
}

export async function updateUser(token, id, userData) {
  try {
    const url = `${API_URL}/user/users/${id}/`;
    console.log('✏️ Updating user at:', url);
    
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(res, 'Update User');
    console.log('✅ User updated successfully');
    return data;
    
  } catch (error) {
    console.error('❌ Error in updateUser:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión al servidor');
    }
    throw error;
  }
}

export async function deleteUser(token, id) {
  try {
    const url = `${API_URL}/user/users/${id}/`;
    console.log('🗑️ Deleting user at:', url);
    
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (res.status === 401) {
      console.error('❌ Unauthorized - session expired');
      throw new Error('SESSION_EXPIRED');
    }
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Delete User error:', res.status, errorText);
      throw new Error(`Error ${res.status}: ${res.statusText}`);
    }
    
    console.log('✅ User deleted successfully');
    return true; // DELETE suele no devolver contenido
    
  } catch (error) {
    console.error('❌ Error in deleteUser:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión al servidor');
    }
    throw error;
  }
}

export async function getCurrentUser(token) {
  try {
    const url = `${API_URL}/user/users/me/`;
    console.log('👤 Fetching current user from:', url);
    
    const res = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    const data = await handleResponse(res, 'Get Current User');
    console.log('✅ Current user data received:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Error in getCurrentUser:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión al servidor');
    }
    throw error;
  }
}
