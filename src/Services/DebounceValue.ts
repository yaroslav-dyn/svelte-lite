let timer = null;
const defaultTime:number = 1000;


export const debounceValue = async (customTime: number) => {
  const delayTime = customTime ? customTime : defaultTime;
  clearTimeout(timer);
  timer = setTimeout(() => {
    return true
  }, delayTime);
}
