// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as react from "react";

interface IProps {
  value: string;
  label: string;
  onChange: (e: any) => void;
}

export default function ChainSelect(props: IProps) {
  const { value, label, onChange } = props;

  return (
    <div className="hole">
      <div>{label}:</div>
      <input value={value} onChange={onChange} />
    </div>
  );
}
