declare module '@react-native/normalize-colors' {
  /** Returns the colour as a 32-bit unsigned integer 0xRRGGBBAA, or null if invalid. */
  export default function normalizeColor(color: unknown): number | null;
}
