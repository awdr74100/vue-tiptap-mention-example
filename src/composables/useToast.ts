import { ref, computed } from 'vue';
import { nanoid } from 'nanoid';

export interface ToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastInternal extends ToastOptions {
  id: string;
}

const toast = ref<ToastInternal | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

export function useToast() {
  const show = (options: ToastOptions | string) => {
    // 清除舊的計時器
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    // 建立新 toast，如果有舊 toast 就覆蓋，但保持 id 不變
    const newToast: ToastInternal =
      typeof options === 'string'
        ? {
          id: nanoid(),
            // id: toast.value?.id ?? nanoid(),
            message: options,
            type: 'info',
            duration: 3000,
          }
        : {
          id: nanoid(),
            // id: toast.value?.id ?? nanoid(),
            message: options.message,
            type: options.type ?? 'info',
            duration: options.duration ?? 3000,
          };

    toast.value = newToast;

    if (newToast.duration && newToast.duration > 0) {
      timer = setTimeout(() => {
        remove();
      }, newToast.duration);
    }

    return newToast.id;
  };

  const remove = () => {
    if (timer) {
      console.log(timer);
      clearTimeout(timer);
      timer = null;
    }
    toast.value = null;
  };

  return {
    toast: computed(() => toast.value),
    show,
    remove,
  };
}
