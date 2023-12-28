declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT?: string;
        DATABASE_URL: string;
        JWT_SECRET: string;
        JWT_ACCESS_EXPIRATION: string;
        JWT_REFRESH_EXPIRATION: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}