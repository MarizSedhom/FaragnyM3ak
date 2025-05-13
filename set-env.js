const fs = require('fs');

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  production: true,
  FireBase: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}"
  },
  ThemovieDB: {
    production: true,
    apiKey: "${process.env.TMDB_API_KEY}",
    nullImageUrl: "https://viterbi-web.usc.edu/~zexunyao/itp301/Assignment_07/img.jpeg",
    apiBaseUrl: "${process.env.TMDB_API_BASE_URL}",
    imageBaseUrl: "${process.env.TMDB_IMAGE_BASE_URL}"
  },
  stripePublicKey: "${process.env.STRIPE_PUBLIC_KEY}",
  stripeSecretKey: "${process.env.STRIPE_SECRET_KEY}"
};
`;

fs.writeFileSync(targetPath, envFileContent, { encoding: 'utf8' });
console.log('✅ environment.ts created successfully!');
