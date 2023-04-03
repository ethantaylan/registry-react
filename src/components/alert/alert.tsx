import { Alert } from "react-bootstrap";

export interface BSAlertProps {
  variant: string;
  text: string
}

export const BSAlert: React.FC<BSAlertProps> = ({ variant, text }) => {
  return (
    <>
      <Alert variant={variant}>{text}</Alert>
    </>
  );
};
