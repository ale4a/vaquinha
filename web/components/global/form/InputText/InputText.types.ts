export interface Props<T extends string | number = string> {
  label: string;
  type?: 'text' | 'number';
  value?: T;
  onChange?: (value: T) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  placeHolder?: string;
  maxLength?: number;
}
