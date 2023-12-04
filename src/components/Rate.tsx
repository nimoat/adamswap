import React, { useContext } from "react";
import { SwapPair } from "./context";
import { getNFloatNumber } from "./utils";

export default function Rate() {
  const swapPair = useContext(SwapPair);
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      1 {swapPair[0].symbol} ={" "}
      {getNFloatNumber(
        Number(swapPair[1].formatted) / Number(swapPair[0].formatted)
      )}{" "}
      {swapPair[1].symbol}
    </span>
  );
}
