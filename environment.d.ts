
  declare namespace NodeJS {
    interface ProcessEnv {
      AUTH_SECRET: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
    }
  }
