<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFileDialog, useMediaControls } from '@vueuse/core'

const props = defineProps<{
  id: number
  type: string
  file: File
  url: string
  poster?: string
}>()

const emit = defineEmits<{
  updatePoster: [id: number, poster: string]
}>()

const videoRef = useTemplateRef('videoRef')

const { playing } = useMediaControls(videoRef, {
  src: () => props.url,
})

const { onChange } = useFileDialog({
  reset: true,
  multiple: false,
})

onChange((files) => {
  if (!files?.length) return

  const poster = Array.from(files)[0];

  console.log(poster)

  emit('updatePoster',props.id, URL.createObjectURL(poster!))
})

const handleClick = () => {
  // type.startsWith('video') ? open() : null

  playing.value = !playing.value
}
</script>

<template>
  <div class="size-full" @click="handleClick">
    <template v-if="props.type.startsWith('image')">
      <img :src="props.url" class="size-full object-cover" />
    </template>
    <template v-else-if="props.type.startsWith('video')">
      <!-- <video  preload="none" :src="props.url" class="size-full object-cover" :poster="props.poster" /> -->
       <video ref="videoRef" class="size-full object-cover" loop></video>
    </template>
  </div>
</template>
