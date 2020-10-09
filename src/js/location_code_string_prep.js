//This has been created to convert the '+' symbol so that it can be a compatible string for video name.
export default {
  replace_plus_symbol(_str) {
    return _str.replace("+", "_");
  },
  restore_plus_symbol(_str) {
    return _str.replace("_", "+");
  }
};
