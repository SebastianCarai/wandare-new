declare module '*.vue' {
  import { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue-google-autocomplete' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module 'leaflet' {
  const L: any
  export default L
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module 'virtual:pwa-register' {
  export function registerSW(options?: any): any;
}

declare module 'swiper/css';
declare module 'swiper/css/*';
