export default (...args) => {
  if (process.env.NODE_ENV === "production") {
    return;
  } else {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};
