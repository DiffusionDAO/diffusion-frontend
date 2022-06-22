import React from "react";
import { StyledCard, StyledCardInner } from "./StyledCard";
import { CardProps } from "./types";
// background :background={background}
const Card: React.FC<CardProps> = ({ ribbon, children, background, ...props }) => {
  return (
    <StyledCard {...props}>
      <StyledCardInner background={'none'} hasCustomBorder={!!props.borderBackground}>
        {ribbon}
        {children}
      </StyledCardInner>
    </StyledCard>
  );
};
export default Card;
