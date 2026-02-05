declare module 'next/image' {
  import * as React from 'react';
  
  export interface StaticImageData {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  }

  export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string | StaticImageData;
    alt: string;
    width?: number | string;
    height?: number | string;
    fill?: boolean;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    quality?: number;
    sizes?: string;
    style?: React.CSSProperties;
    onLoad?: (result: {naturalWidth: number; naturalHeight: number}) => void;
    onError?: (error: Error) => void;
  }

  const Image: React.ForwardRefExoticComponent<ImageProps & React.RefAttributes<HTMLImageElement>>;
  export default Image;
}
