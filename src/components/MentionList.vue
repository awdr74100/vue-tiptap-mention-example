<script setup lang="ts">
import type { SuggestionKeyDownProps } from '@tiptap/suggestion'
import { watch, ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'

const props = defineProps<{
  items: any[]
  command: any
  query: string
}>()

type User = {
  id: number
}

const { data: getUsersResponse } = useQuery({
  queryKey: ['GET_USERS', () => props.query],
  queryFn: async () => {
    const users: User[] = await fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
      res.json(),
    )
    console.log(users)
    return users
  },
})

// const data = computed(() =>
//   [
//     'Lea Thompson',
//     'Cyndi Lauper',
//     'Tom Cruise',
//     'Madonna',
//     'Jerry Hall',
//     'Joan Collins',
//     'Winona Ryder',
//     'Christina Applegate',
//     'Lisa Bonet',
//   ].filter((item) => item.toLowerCase().startsWith(props.query.toLowerCase())),
// )

const data = computed(() => getUsersResponse.value ?? [])

const selectedIndex = ref(0)

const selectItem = (index: number) => {
  const item = data.value[index]

  if (item) {
    props.command({ id: item.id })
  }
}

const onKeyDown = ({ event }: SuggestionKeyDownProps) => {
  if (event.key === 'ArrowUp') {
    selectedIndex.value = (selectedIndex.value + data.value.length - 1) % data.value.length

    return true
  }

  if (event.key === 'ArrowDown') {
    selectedIndex.value = (selectedIndex.value + 1) % data.value.length

    return true
  }

  if (event.key === 'Enter') {
    selectItem(selectedIndex.value)

    return true
  }

  return false
}

defineExpose({
  onKeyDown,
})

watch(
  () => props.query,
  (value) => {
    console.log('Query: ', value)
  },
)

watch(
  data,
  (value) => {
    console.log(value)
    selectedIndex.value = 0
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div class="min-w-40 bg-gray-400">
    <template v-if="data?.length">
      <ul class="flex flex-col w-full max-h-50 overflow-auto">
        <template v-for="(item, index) in data" :key="index">
          <li
            @click="selectItem(index)"
            class="px-3 py-2 cursor-pointer"
            :class="{
              'bg-gray-500': index === selectedIndex,
            }"
          >
            {{ item.id }}
          </li>
        </template>
      </ul>
    </template>
    <template v-else>
      <div>沒有結果</div>
    </template>
  </div>
</template>
