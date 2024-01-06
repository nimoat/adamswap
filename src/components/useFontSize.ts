import { Ref, useEffect, useRef, useState } from "react";

const useFontSize = (
  {
    minSize,
    maxSize,
    minLength,
  }: { minSize: number; maxSize: number; minLength: number },
  text: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): [number, Ref<any>] => {
  const ref = useRef(null);

  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (ref.current) {
      // 计算文本长度，并根据长度设置字体大小
      if (text.length <= minLength) {
        setFontSize(maxSize);
      } else {
        const fontSize = parseInt(
          (maxSize - (text.length - minLength) * 1.8).toString(),
          10
        );
        setFontSize(fontSize < minSize ? minSize : fontSize);
      }
    }
  }, [minSize, maxSize, minLength, text]);

  return [fontSize, ref];
};

export default useFontSize;
