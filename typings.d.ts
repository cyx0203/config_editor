declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}

interface Window {
  ipcRenderer: {
    on: (event: string, listener: (event: any, arg: any) => void) => void;
    send: (event: string, arg: any) => void;
  };
  z: {
    originConfig: Record<string, { visiable: boolean; type: number; subList: FormItemType[] }>;
    config: Record<string, any>;
  };
}

type InputType = 'text' | 'boolean' | 'number' | 'dropdown';

type Status = 'loading' | 'idle' | 'error';

type FormItemType = {
  name: string;
  type: InputType;
  visiable?: boolean;
  disabled?: boolean;
  value?: string | number | boolean;
  tip?: string;
  key: string;
  options?: { label: string; value: string }[];
};

type FormType = {
  [key: string]: {
    visiable?: boolean;
    type?: number;
    subList?: FormItemType[];
  };
};
