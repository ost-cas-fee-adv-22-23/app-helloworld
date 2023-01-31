import { FC, ReactElement } from "react";
import {Button, MumbleIcon} from '@smartive-education/design-system-component-library-hello-world-team';

type HeaderProps = {
  title: string;
  children?: ReactElement;
};

export const Header: FC<HeaderProps> = ({ children, title }: HeaderProps) => {
  return (
    <>
      <h1>{title}</h1>
      {children}
      <Button label="Click me" onClick={function noRefCheck() {}} size="M" variant="gradient">
        <MumbleIcon size={16}/>
      </Button>
    </>
  );
};
