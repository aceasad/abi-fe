export const interpolate = (template, values = {}) =>
  Object.keys(values).reduce(
    (str, key) =>
      str.replace(new RegExp(`\\{${key}\\}`, 'g'), String(values[key] ?? '')),
    template
  );
