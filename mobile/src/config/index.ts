import Config from 'react-native-config';

interface AppConfig {
  GOOGLE_MAPS_API_KEY: string;
}

// Type-safe access to environment variables
const config: AppConfig = {
  GOOGLE_MAPS_API_KEY: Config.GOOGLE_MAPS_API_KEY || '',
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['GOOGLE_MAPS_API_KEY'];
  const missingVars = requiredVars.filter((varName) => !Config[varName]);
  
  if (missingVars.length > 0) {
    console.warn(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Make sure you have created a .env file with all required variables.'
    );
  }
};

// Run validation when module is imported
validateConfig();

export default config;