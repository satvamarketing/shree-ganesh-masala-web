// eslint-config-next 16 ships native flat config, so its exports are spread
// directly. Wrapping them in FlatCompat (the Next 14/15 pattern) fails with a
// circular-structure error on this version.
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", "public/**", "scripts/**"] },
];

export default config;
