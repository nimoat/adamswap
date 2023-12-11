import { useAccount, useContractWrite } from "wagmi";
import { encodeFunctionData } from "viem";
import { SwapInfoMap, SwapTypeEnum } from "./ConfirmModal";
import { useContext } from "react";
import { SwapType } from "./context";

type PropsType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError: (error: Error | any) => void;
};

export function useSwapWrite({ onError }: PropsType) {
  const { address: accountAddress } = useAccount();
  const swapType = useContext(SwapType) as SwapTypeEnum;

  const { data, write } = useContractWrite({
    abi: SwapInfoMap[swapType].abi,
    functionName: SwapInfoMap[swapType].functionName[0],
    address: SwapInfoMap[swapType].contractAddress,
    // gas: gasLimit,
    // gasPrice: feeData?.gasPrice ?? undefined, // @TODO: Legacy Transactions.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: onError,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const advanceWrite = (params: any) => {
    if ([SwapTypeEnum.erc204Eth, SwapTypeEnum.eth4Erc20].includes(swapType)) {
      const callData = [
        encodeFunctionData({
          abi: SwapInfoMap[swapType].abi,
          functionName: SwapInfoMap[swapType].functionName[1],
          args: params.args,
        }),
        encodeFunctionData({
          abi: SwapInfoMap[swapType].abi,
          functionName: SwapInfoMap[swapType].functionName[2],
          args:
            swapType === SwapTypeEnum.erc204Eth
              ? [0, accountAddress]
              : undefined,
        }),
      ];
      return write({ ...params, args: [callData] });
    }
    return write(params);
  };

  return { data, write: advanceWrite };
}
