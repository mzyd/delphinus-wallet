// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";
import './style.scss'

interface IProps {
  value: any;
  disabled?: boolean;
  label?: string;
  onChange: (e: any) => void;
}

export default function ChainSelect(props: IProps) {
  const { value, label, disabled, onChange } = props;

  return (
    <div className="hole">
      {label && <div>{label}:</div>}
      <input value={value} disabled={disabled} onChange={onChange} />
    </div>
  );
}
