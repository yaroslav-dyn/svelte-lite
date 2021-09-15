
import {toast} from '@zerodevx/svelte-toast'


const selectedTheme =  {
  warningTheme :{
    '--toastBackground': '#F56565',
        '--toastBarBackground': '#C53030'
  },
  successTheme : {
    '--toastBackground': '#48BB78',
        '--toastBarBackground': '#2F855A'
  }

}



export const showToast = (message, theme) => {
  const th = selectedTheme.theme
  const opt = {
    theme: th
  }
  toast.push(message  , opt);
}



