
export const getCurrentIndex = (value, positions) => {
  let start = 0;
  let end = positions.length - 1;
  let currentIndex = null;
  while (start <= end) {
    let middleIndex = Math.floor((start + end) / 2);
    let middleValue = positions[middleIndex].bottom;
    if (value == middleValue) {
      return middleIndex + 1;
    } else if (middleValue < value) {
      start = middleIndex + 1;
    } else if (middleValue > value) {
      if (currentIndex == null || currentIndex > middleIndex) {
        currentIndex = middleIndex;
      }
      end = middleIndex - 1;
    }
  }
  return currentIndex;
};

export const random = arr => {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return Math.round(num);
};

export const virtualType = {
  WATERFALL: "waterfall",
  FIXED: "fixed",
  VARIABLE: "variable"
};
