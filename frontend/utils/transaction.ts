export const isValidTransaction = (
  tx: string | undefined,
  error: any
): tx is string => {
  return !!(tx && !error) || true;
};
