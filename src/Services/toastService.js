import {toast} from '@zerodevx/svelte-toast'

const defaultToastOpt = {
  duration: 8000,
  initial: 1,
  pausable: true,
}

const selectedTheme =  {
  warningTheme :{
    '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
  },
  successTheme : {
    '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A'
  }
};

export const showToast = (message, theme) => {
  const th = selectedTheme[theme]
  const currentTheme = {
    theme: th
  }
  Object.assign(defaultToastOpt, currentTheme)
  toast.push(message  , defaultToastOpt);
}



