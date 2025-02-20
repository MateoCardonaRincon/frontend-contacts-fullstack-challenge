export const getEnv = () => {
  const envVariables = process.env;
  return {...envVariables};
//   return { TEST_VAR: 'Hey' };
};
