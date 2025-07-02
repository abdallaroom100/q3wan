declare module 'ogl' {
  export class Renderer {
    gl: WebGLRenderingContext;
    constructor(options?: { alpha?: boolean });
    setSize(width: number, height: number): void;
    render(options: { scene: Transform; camera: Camera }): void;
  }

  export class Camera {
    fov: number;
    aspect: number;
    position: { z: number };
    constructor(gl: WebGLRenderingContext);
    perspective(options: { aspect: number }): void;
  }

  export class Transform {
    position: { x: number; y: number; z: number };
    rotation: { z: number };
    scale: { x: number; y: number; z: number };
    setParent(parent: Transform): void;
  }

  export class Plane {
    constructor(gl: WebGLRenderingContext, options?: { heightSegments?: number; widthSegments?: number });
  }

  export class Mesh {
    position: { x: number; y: number; z: number };
    rotation: { z: number };
    scale: {
      x: number;
      y: number;
      z: number;
      set(x: number, y: number, z: number): void;
    };
    program: Program;
    constructor(gl: WebGLRenderingContext, options: { geometry: Plane; program: Program });
    setParent(parent: Transform): void;
  }

  export class Program {
    uniforms: { [key: string]: { value: any } };
    constructor(gl: WebGLRenderingContext, options: {
      vertex: string;
      fragment: string;
      uniforms?: { [key: string]: { value: any } };
      transparent?: boolean;
      depthTest?: boolean;
      depthWrite?: boolean;
    });
  }

  export class Texture {
    image: HTMLImageElement | HTMLCanvasElement;
    constructor(gl: WebGLRenderingContext, options?: { generateMipmaps?: boolean });
  }
} 