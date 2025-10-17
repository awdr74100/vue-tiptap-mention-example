<script setup lang="ts">
import PostCard from '@/components/PostCard.vue'
import { ref, onBeforeUnmount } from 'vue'
import { useFileDialog } from '@vueuse/core'

const fileArray = ref<
  {
    id: number
    type: string
    file: File
    url: string
    poster?: string
  }[]
>([])

function revokeAllObjectURLs() {
  fileArray.value.forEach((p) => URL.revokeObjectURL(p.url))
}

const { onChange, open } = useFileDialog({
  reset: true,
  multiple: true,
})

onChange((files) => {
  if (!files?.length) return

  revokeAllObjectURLs()

  fileArray.value = Array.from(files).map((file, index) => ({
    id: index,
    file: file,
    type: file.type,
    url: URL.createObjectURL(file),
    poster: undefined,
  }))
})

onBeforeUnmount(() => {
  revokeAllObjectURLs()
})

const updatePoster = (id: number, url: string) => {
  console.log(id, url)

  fileArray.value = fileArray.value.map((item) => {
    if (item.id === id) {
      console.log('trigger')
      return {
        ...item,
        poster: url,
      }
    }

    return { ...item }
  })
}
</script>

<template>
  <div class="mx-auto min-h-dvh max-w-[1024px]">
    <button @click="open()" class="w-full bg-gray-400 py-4" type="button">上傳</button>

    <ul class="size-full grid grid-cols-4 gap-4">
      <template v-for="fileItem in fileArray" :key="fileItem.id">
        <li class="size-full min-h-100">
          <PostCard v-bind="fileItem" @update-poster="updatePoster" />
        </li>
      </template>
    </ul>
  </div>
</template>
