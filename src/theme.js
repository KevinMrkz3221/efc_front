// Paleta de colores profesional para agencias aduanales
export const colors = {
  // Colores principales
  primary: {
    navy: '#1B2A41',
    navyDark: '#162234',
    navyLight: '#263549',
    lightGray: '#F2F4F7',
    white: '#FFFFFF'
  },
  
  // Colores de acento
  accent: {
    success: '#2E7D32',
    successLight: '#4CAF50',
    successDark: '#1B5E20',
    warning: '#F57C00',
    warningLight: '#FF9800',
    warningDark: '#E65100',
    error: '#C62828',
    errorLight: '#E53935',
    errorDark: '#B71C1C',
    info: '#4DA6FF',
    infoLight: '#64B5F6',
    infoDark: '#1976D2'
  },
  
  // Colores neutros para texto
  text: {
    primary: '#333333',
    secondary: '#7A7A7A',
    inverse: '#FFFFFF'
  },
  
  // Fondos
  background: {
    primary: '#F2F4F7',
    card: '#FFFFFF',
    overlay: 'rgba(27, 42, 65, 0.8)'
  }
};

// Clases de Tailwind CSS pre-definidas para uso común
export const tailwindClasses = {
  // Botones
  button: {
    primary: 'bg-navy hover:bg-navy-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
    secondary: 'bg-info hover:bg-info-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
    success: 'bg-success hover:bg-success-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
    warning: 'bg-warning hover:bg-warning-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
    error: 'bg-error hover:bg-error-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
    outline: 'border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200'
  },
  
  // Tarjetas
  card: {
    default: 'bg-card rounded-lg shadow-md border border-gray-200 p-6',
    elevated: 'bg-card rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200'
  },
  
  // Inputs
  input: {
    default: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent transition-all duration-200',
    error: 'w-full px-3 py-2 border border-error rounded-lg focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-all duration-200'
  },
  
  // Texto
  text: {
    heading: 'text-text-primary font-bold',
    subheading: 'text-text-primary font-semibold',
    body: 'text-text-primary',
    caption: 'text-text-secondary text-sm',
    inverse: 'text-text-inverse'
  },
  
  // Estados
  status: {
    success: 'bg-success-light text-white px-3 py-1 rounded-full text-sm font-medium',
    warning: 'bg-warning text-white px-3 py-1 rounded-full text-sm font-medium',
    error: 'bg-error text-white px-3 py-1 rounded-full text-sm font-medium',
    info: 'bg-info text-white px-3 py-1 rounded-full text-sm font-medium'
  }
};

// Gradientes personalizados
export const gradients = {
  primaryHero: 'bg-gradient-to-br from-navy via-navy-light to-info-dark',
  card: 'bg-gradient-to-r from-white to-light-gray-50',
  button: 'bg-gradient-to-r from-navy to-navy-light',
  accent: 'bg-gradient-to-r from-info to-info-dark'
};

export default { colors, tailwindClasses, gradients };