
  let timer = null;
  const defaultTime: number = 1000;
  export let debounceStatus = false
  

  export const debounceValue = async (customTime: number) => {
    debounceStatus = false;
    const delayTime = customTime ? customTime : defaultTime;
    clearTimeout(timer);
    timer = setTimeout(() => {
      debounceStatus = true;
    }, delayTime);
  }


