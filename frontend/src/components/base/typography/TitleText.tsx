import React, { JSX } from "react";
import clsx from "clsx";

type TextVariant =
    | "heading1"
    | "heading2"
    | "title1"
    | "title2"
    | "title3"
    | "leading1"
    | "leading2"
    | "leading3"
    | "medium1"
    | "medium2"
    | "medium3";

type TextProps = {
    variant: TextVariant;
    as?: keyof JSX.IntrinsicElements;
    className?: string;
    children: React.ReactNode;
};

export const TitleText: React.FC<TextProps> = ({
    variant,
    as = "div",
    className,
    children,
}) => {
    const Component = as;
    return <Component className={clsx(variant, className)} >{children}</Component>;
};
