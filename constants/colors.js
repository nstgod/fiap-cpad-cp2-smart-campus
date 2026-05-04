// Cores compartilhadas entre temas (a marca FIAP é fixa)
const brand = {
  primary: '#ED145B',
  primaryDark: '#B30D45',
};

export const lightColors = {
  ...brand,
  primaryLight: '#FCE3EB',

  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceMuted: '#EFEFEF',

  text: '#1A1A1A',
  textMuted: '#666666',
  placeholder: '#999999',
  onPrimary: '#FFFFFF',

  border: '#E0E0E0',
  borderLight: '#EEEEEE',

  success: '#2E7D32',
  successBg: '#E8F5E9',
  error: '#C62828',
  errorBg: '#FFEBEE',
  warning: '#EF6C00',
  warningBg: '#FFF3E0',
  info: '#0277BD',
  infoBg: '#E1F5FE',

  shadow: '#000000',
  statusBar: 'dark-content',
};

export const darkColors = {
  ...brand,
  primaryLight: '#3A1A24',

  background: '#1A1A1A',
  surface: '#2A2A2A',
  surfaceMuted: '#333333',

  text: '#FFFFFF',
  textMuted: '#AAAAAA',
  placeholder: '#777777',
  onPrimary: '#FFFFFF',

  border: '#333333',
  borderLight: '#262626',

  success: '#4CAF50',
  successBg: '#1B3B23',
  error: '#F44336',
  errorBg: '#3B1B1B',
  warning: '#FF9800',
  warningBg: '#3B2A1B',
  info: '#4FC3F7',
  infoBg: '#1B2C3B',

  shadow: '#000000',
  statusBar: 'light-content',
};

// Default usado por imports legados (será substituído pelo useTheme em runtime)
export const colors = darkColors;
