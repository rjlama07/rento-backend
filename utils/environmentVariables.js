export const getDatabaseInfo = () => {
  const dbName = process.env.DB_NAME;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD;
  return {
    dbName,
    dbUser,
    dbPassword,
  };
};

export const getSecretKeys = () => {
  const accessSecret = process.env.ACCESSKEY;
  const refreshSecret = process.env.REFRESHKEY;
  return { accessSecret, refreshSecret };
};
