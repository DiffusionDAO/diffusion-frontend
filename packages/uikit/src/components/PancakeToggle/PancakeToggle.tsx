import React from "react";
import { PancakeStack, PancakeInput, PancakeLabel } from "./StyledPancakeToggle";
import { PancakeToggleProps, scales } from "./types";

const PancakeToggle: React.FC<React.PropsWithChildren<PancakeToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <PancakeStack scale={scale}>
    <PancakeInput id={props.id || "diffusion-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <PancakeLabel scale={scale} checked={checked} htmlFor={props.id || "diffusion-toggle"}>
      <div className="pancakes">
        <div className="diffusion" />
        <div className="diffusion" />
        <div className="diffusion" />
        <div className="butter" />
      </div>
    </PancakeLabel>
  </PancakeStack>
);

export default PancakeToggle;
