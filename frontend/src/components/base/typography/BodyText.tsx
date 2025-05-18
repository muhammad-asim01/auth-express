import React, { JSX } from "react";
import clsx from "clsx";

type BodyVariant = "body1" | "body2" | "body3" | "body4";

type BodyTextProps = {
  variant?: BodyVariant;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
};

export const BodyText: React.FC<BodyTextProps> = ({
  variant = "body2",
  as = "p",
  className,
  children,
}) => {
  const Component = as;
  return <Component className={clsx(`text-${variant}`, className)}>{children}</Component>;
};
