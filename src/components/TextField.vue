<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useEventListener, onClickOutside } from '@vueuse/core'
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent, VueRenderer, posToDOMRect, mergeAttributes } from '@tiptap/vue-3'
import { computePosition, flip, shift } from '@floating-ui/dom'
import type { Editor } from '@tiptap/core'
import MentionList from '@/components/MentionList.vue'

const updatePosition = (editor: Editor, element: any) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
  })
}

const editor = useEditor({
  extensions: [
    Document,
    Paragraph,
    Text,
    Mention.configure({
      HTMLAttributes: {
        class: 'text-red-500',
      },
      renderHTML({ options, node }) {
        console.log(options);
        return [
          'a',
          mergeAttributes({ href: '/post' }, options.HTMLAttributes),
          `${options.HTMLAttributes['data-mention-suggestion-char']}${node.attrs.label ?? node.attrs.id}`,
        ]
      },
      suggestions: [
        {
          char: '@',
          // items: ({ query }) => {
          //   console.log(query);
          //   return [
          //     'Lea Thompson',
          //     'Cyndi Lauper',
          //     'Tom Cruise',
          //     'Madonna',
          //     'Jerry Hall',
          //     'Joan Collins',
          //     'Winona Ryder',
          //     'Christina Applegate',
          //     'Lisa Bonet',
          //   ]
          //     .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
          //     // .slice(0, 5)
          // },
          render() {
            let component: VueRenderer
            let cleanup: () => void = () => {}

            return {
              onStart(props) {
                console.log('onStart', props)

                component = new VueRenderer(MentionList, {
                  // using vue 2:
                  // parent: this,
                  // propsData: props,
                  // using vue 3:
                  props,
                  editor: props.editor,
                })

                if (!props.clientRect) return

                component.element?.classList.add('absolute')

                if (!component.element) return

                document.body.appendChild(component.element)

                updatePosition(props.editor, component.element)

                // --- 加入 resize / scroll 監聽 ---
                const update = () => updatePosition(props.editor, component.element)

                const cleanupResizeListener = useEventListener('resize', update)
                const cleanupScrollListener = useEventListener('scroll', update, { capture: true })

                const stop = onClickOutside(component.element as HTMLElement, () => {
                  component?.element?.remove()
                  component?.destroy()
                })

                cleanup = () => {
                  cleanupResizeListener()
                  cleanupScrollListener()
                  stop()
                }
              },

              onUpdate(props) {
                console.log('onUpdate', props)

                component.updateProps(props)
                if (!props.clientRect) return
                updatePosition(props.editor, component.element)
              },
              onKeyDown(props) {
                console.log('onKeyDown', props)
                // console.log(component)
                if (props.event.key === 'Escape') {
                  component?.element?.remove()
                  component.destroy()
                  cleanup()

                  return true
                }

                return component?.ref?.onKeyDown(props)
              },
              onExit(props) {
                console.log('onExit', props)
                component?.element?.remove()
                component?.destroy()
                cleanup()
              },
            }
          },
        },
      ],
    }),
  ],
  editorProps: {
    attributes: {
      class: 'focus:outline-none py-2 px-3',
    },
  },
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const onSubmit = () => {
  console.log(editor.value?.getJSON())
  console.log(editor.value?.getHTML())
  console.log(editor.value?.getText())
}
</script>

<template>
  <EditorContent class="border border-gray-400 rounded-xl max-w-125 flex-1" :editor="editor" />

  <button @click="onSubmit" class="bg-gray-400 py-2 px-3 rounded-xl">送出</button>
</template>
