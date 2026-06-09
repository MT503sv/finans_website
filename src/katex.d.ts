// src/katex.d.ts  ← colócalo en la raíz de src/
declare module 'katex/dist/contrib/auto-render' {
  import { KatexOptions } from 'katex';
  export default function renderMathInElement(
    element: HTMLElement,
    options?: KatexOptions & {
      delimiters?: Array<{ left: string; right: string; display: boolean }>;
    }
  ): void;
}

declare module 'katex/dist/contrib/auto-render.mjs' {
  import { KatexOptions } from 'katex';
  export default function renderMathInElement(
    element: HTMLElement,
    options?: KatexOptions & {
      delimiters?: Array<{ left: string; right: string; display: boolean }>;
    }
  ): void;
}
