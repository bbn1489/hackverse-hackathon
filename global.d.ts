declare namespace JSX {
  // Minimal fallback so TS recognizes JSX intrinsic elements in this project.
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
