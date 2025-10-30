<script setup lang="ts">
import { useToast } from '@/composables/useToast';

const { toast, remove } = useToast();
</script>

<template>
  <Teleport v-if="toast" to="body">
    <div class="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center">
      <Transition :key="toast?.id" name="toast" appear>
        <div
          class="pointer-events-auto min-w-[220px] rounded-md px-4 py-3 text-sm shadow-lg"
          :class="{
            'bg-green-500 text-white': toast?.type === 'success',
            'bg-red-500 text-white': toast?.type === 'error',
            'bg-blue-500 text-white': toast?.type === 'info',
          }"
        >
          <div class="flex items-center justify-between">
            <span>{{ toast?.message }}</span>
            <button class="ml-3 text-white/80 hover:text-white" @click="remove()">✕</button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
</style>
