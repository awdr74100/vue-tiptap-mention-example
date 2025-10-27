<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useEventListener, onClickOutside } from '@vueuse/core'
import Document from '@tiptap/extension-document'
import Mention from '@tiptap/extension-mention'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import { useEditor, EditorContent, VueRenderer, posToDOMRect, mergeAttributes } from '@tiptap/vue-3'
import { computePosition, flip, shift, autoUpdate } from '@floating-ui/dom'
// import HardBreak from '@tiptap/extension-hard-break'
import type { Editor } from '@tiptap/core'
import MentionList from '@/components/MentionList.vue'

const updatePosition = (editor: Editor, element: any) => {
  const virtualElement = {
    getBoundingClientRect: () =>
      posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  // computePosition(virtualElement, element, {
  //   placement: 'bottom-start',
  //   strategy: 'absolute',
  //   middleware: [shift(), flip()],
  // }).then(({ x, y, strategy }) => {
  //   element.style.width = 'max-content'
  //   element.style.position = strategy
  //   element.style.left = `${x}px`
  //   element.style.top = `${y}px`
  // })

  // return () => {};

  return autoUpdate(virtualElement, element, () => {
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
  })
}

const editor = useEditor({
  parseOptions: {
    preserveWhitespace: 'full',
  },
  extensions: [
    Document,
    Paragraph,
    Text,
    // HardBreak,
    Mention.configure({
      HTMLAttributes: {
        class: 'text-red-500',
      },
      renderHTML({ node, options }) {
        // console.log(node)
        // console.log(options)
        return [
          'span',
          mergeAttributes({}, options.HTMLAttributes),
          `${options.HTMLAttributes['data-mention-suggestion-char']}${node.attrs.label}`,
        ]
      },
      // renderHTML({ options, node }) {
      //   console.log(options)
      //   return [
      //     'a',
      //     mergeAttributes({ href: '/post' }, options.HTMLAttributes),
      //     `${options.HTMLAttributes['data-mention-suggestion-char']}${node.attrs.label ?? node.attrs.id}`,
      //   ]
      // },
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
            let cleanup: () => void

            return {
              onStart(props) {
                console.log('onStart', props)

                console.log('@@@@@@@@@@')

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

                cleanup = updatePosition(props.editor, component.element)

                // --- 加入 resize / scroll 監聽 ---
                // const update = () => updatePosition(props.editor, component.element)

                // const cleanupResizeListener = useEventListener('resize', update)
                // const cleanupScrollListener = useEventListener('scroll', update, { capture: true })

                // const stop = onClickOutside(component.element as HTMLElement, () => {
                //   component?.element?.remove()
                //   component?.destroy()
                // })

                // cleanup = () => {
                //   cleanupResizeListener()
                //   cleanupScrollListener()
                //   stop()
                // }
              },

              onUpdate(props) {
                console.log('onUpdate', props)

                component.updateProps(props)
                if (!props.clientRect) return

                if (cleanup) {
                  console.log(123)
                  cleanup()
                }

                cleanup = updatePosition(props.editor, component.element)
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
        {
          char: '#',
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
            let cleanup: () => void

            return {
              onStart(props) {
                console.log('onStart', props)

                console.log('############')

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

                cleanup = updatePosition(props.editor, component.element)

                // --- 加入 resize / scroll 監聽 ---
                // const update = () => updatePosition(props.editor, component.element)

                // const cleanupResizeListener = useEventListener('resize', update)
                // const cleanupScrollListener = useEventListener('scroll', update, { capture: true })

                // const stop = onClickOutside(component.element as HTMLElement, () => {
                //   component?.element?.remove()
                //   component?.destroy()
                // })

                // cleanup = () => {
                //   cleanupResizeListener()
                //   cleanupScrollListener()
                //   stop()
                // }
              },

              onUpdate(props) {
                console.log('onUpdate', props)

                component.updateProps(props)
                if (!props.clientRect) return

                if (cleanup) {
                  console.log(123)
                  cleanup()
                }

                cleanup = updatePosition(props.editor, component.element)
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

interface MentionUser {
  id: string
  nickname: string
}

interface ParseOptions {
  taggerUsers: MentionUser[]
  hashtags: string[]
}

function parseTextToNodes(text: string, options: ParseOptions) {
  const { taggerUsers, hashtags } = options
  const paragraphs = text.split(/\n+/) // 按換行切割段落

  const doc: any = {
    type: 'doc',
    content: [],
  }

  paragraphs.forEach((line) => {
    const content: any[] = []

    let lastIndex = 0
    const mentionRegex = /(@\[([^\]]+)\])|(#(\S+))/g
    let match: RegExpExecArray | null

    while ((match = mentionRegex.exec(line))) {
      const index = match.index

      // 普通文字
      if (index > lastIndex) {
        content.push({
          type: 'text',
          text: line.slice(lastIndex, index),
        })
      }

      if (match[1]) {
        // @mention
        const id = match[2]
        const user = taggerUsers.find((u) => u.id === id)
        content.push({
          type: 'mention',
          attrs: {
            id: user?.id ?? id,
            label: user?.nickname ?? id,
            char: '@',
          },
        })
      } else if (match[3]) {
        // #hashtag
        const tag = match[4]
        if (tag && hashtags.includes(tag)) {
          content.push({
            type: 'mention',
            attrs: {
              id: tag,
              label: match[3],
              char: '#',
            },
          })
        } else if (tag) {
          content.push({
            type: 'text',
            text: match[0],
          })
        }
        // const tag = match[4]
        // if (hashtags.includes(tag)) {
        //   content.push({
        //     type: 'mention',
        //     attrs: {
        //       id: tag,
        //       label: match[3],
        //       char: '#',
        //     },
        //   })
        // } else {
        //   // 不在白名單當普通文字
        //   content.push({
        //     type: 'text',
        //     text: match[0],
        //   })
        // }
      }

      lastIndex = index + match[0].length
    }

    // 剩下的文字
    if (lastIndex < line.length) {
      content.push({
        type: 'text',
        text: line.slice(lastIndex),
      })
    }

    // 將段落加入 doc
    doc.content.push({
      type: 'paragraph',
      content,
    })
  })

  return doc
}

onMounted(() => {
  const taggerUsers = [{ id: 'whfwefwf', nickname: 'Eric' }]
  const hashtags = ['美食']
  const text = '你好啊 \n 123 \n 你好啊 @[whfwefwf]\n#美食 #ddd'

  const convertToHTML = (str: string) => {
    // 按換行分段
    const paragraphs = str.split(/\n/)

    return paragraphs
      .map((line) => {
        let htmlLine = line

        // 處理 mention: @[id] → <a class="text-red-500" ...>@nickname</a>
        htmlLine = htmlLine.replace(/@\[([^\]]+)\]/g, (_, id) => {
          const user = taggerUsers.find((u) => u.id === id)
          if (!user) return `@[${id}]`
          return `<span class="text-red-500" data-type="mention" data-id="${user.id}" data-label="${user.nickname}" data-mention-suggestion-char="@">@${user.nickname}</span>`
        })

        // 處理 hashtag: #tag → <span class="hashtag">#tag</span>
        htmlLine = htmlLine.replace(/#(\S+)/g, (_, tag) => {
          console.log(!hashtags.includes(tag))
          if (!hashtags.includes(tag)) return `#${tag}`
          return `<span class="text-red-500" data-type="mention" data-id="${tag}" data-label="${tag}" data-mention-suggestion-char="#">#${tag}</span>`
        })

        // 包成 p
        return `<p>${htmlLine}</p>`
      })
      .join('')
  }

  console.log(convertToHTML(text))

  editor.value?.commands.setContent(convertToHTML(text), { parseOptions: { preserveWhitespace: 'full' } })

  // 分段
  // const lines = text.split(/\n/)

  // const content = {
  //   type: 'doc',
  //   content: lines.map((line) => {
  //     // 每一段落
  //     const children = []

  //     let remaining = line

  //     // 處理 @mention
  //     taggerUsers.forEach((u) => {
  //       const idx = remaining.indexOf(`@[${u.id}]`)
  //       if (idx >= 0) {
  //         if (idx > 0) {
  //           children.push({ type: 'text', text: remaining.slice(0, idx) })
  //         }
  //         children.push({
  //           type: 'mention',
  //           attrs: { id: u.id, label: u.nickname },
  //         })
  //         remaining = remaining.slice(idx + `@[${u.id}]`.length)
  //       }
  //     })

  //     // 處理 hashtag
  //     hashtags.forEach((tag) => {
  //       const idx = remaining.indexOf(`#${tag}`)
  //       if (idx >= 0) {
  //         if (idx > 0) {
  //           children.push({ type: 'text', text: remaining.slice(0, idx) })
  //         }
  //         children.push({
  //           type: 'mention',
  //           attrs: { id: tag, label: `#${tag}` },
  //         })
  //         remaining = remaining.slice(idx + `#${tag}`.length)
  //       }
  //     })

  //     if (remaining.length) {
  //       children.push({ type: 'text', text: remaining })
  //     }

  //     return { type: 'paragraph', content: children }
  //   }),
  // }

  // editor.value?.commands.setContent(content)
})

// onMounted(() => {
//   const taggerUsers = [{ id: 'whfwefwf', nickname: 'Eric' }]
//   const hashtags = ['美食', '旅遊']
//   const text = '你好啊 \n 123 \n 你好啊 @[whfwefwf]\n#美食 #ddd'

//   const nodes = parseTextToNodes(text, { taggerUsers, hashtags })

//   editor.value?.commands.setContent(nodes)
// })

// onMounted(() => {
//   // const html = '你好啊 \n 123 \n 你好啊'
//   // editor.value?.commands.setContent(html, { parseOptions: { preserveWhitespace: 'full' } })

//   const taggerUsers = [{ id: 'whfwefwf', nickname: 'Eric' }]

//   const hashtags = ['美食']

//   const text = '你好啊 \n 123 \n 你好啊 @[whfwefwf]\n#美食'

//   // // 1️⃣ 先把文字用 \n 分割成段落陣列
//   // const paragraphs = text.split(/\n+/) // 按換行切割

//   // // 2️⃣ 組成標準 HTML 結構，保留原始空白
//   // const html = paragraphs.map((p) => `<p>${p}</p>`).join('')

//   // // 3️⃣ 設定進 tiptap 編輯器
//   // editor.value?.commands.setContent(html)
//    const convertToHTML = (str: string) => {
//     // 按換行分段
//     const paragraphs = str.split(/\n/)

//     return paragraphs
//       .map((line) => {
//         let htmlLine = line

//         // 處理 mention: @[id] → <a class="text-red-500" ...>@nickname</a>
//         htmlLine = htmlLine.replace(/@\[([^\]]+)\]/g, (_, id) => {
//           const user = taggerUsers.find((u) => u.id === id)
//           if (!user) return `@[${id}]`
//           return `<a href="/post" class="text-red-500" data-mention-suggestion-char="@" data-id="${user.id}" data-label="${user.nickname}">@${user.nickname}</a>`
//         })

//         // 處理 hashtag: #tag → <span class="hashtag">#tag</span>
//         htmlLine = htmlLine.replace(/#(\S+)/g, (_, tag) => {
//           if (!hashtags.includes(tag)) return `#${tag}`
//           return `<span class="hashtag">#${tag}</span>`
//         })

//         // 包成 p
//         return `<p>${htmlLine}</p>`
//       })
//       .join('')
//   }

//    const html = convertToHTML(text)

//   editor.value?.commands.setContent(html)

// })

onBeforeUnmount(() => {
  editor.value?.destroy()
})

const onSubmit = () => {
  // console.log(editor.value?.getJSON())
  // console.log(JSON.stringify(editor.value?.getHTML()))
  // console.log(JSON.stringify('Hello\nWorld'))
  // console.log(editor.value?.getText())
  // console.log(JSON.stringify(editor.value?.getHTML()))
  const htmlString = editor.value?.getHTML() ?? ''

  const container = document.createElement('div')
  container.innerHTML = htmlString

  // 收集 taggedUser 和 hashtags
  const taggedUser: { id: string; label: string }[] = []
  const hashtags: { id: string; label: string }[] = []

  container.querySelectorAll('span[data-type="mention"]').forEach((span) => {
    const char = span.getAttribute('data-mention-suggestion-char')
    const id = span.getAttribute('data-id')
    const label = span.getAttribute('data-label')

    // 只有 id 與 label 都存在才加入陣列
    if (id && label) {
      if (char === '@') {
        taggedUser.push({ id, label })
      } else if (char === '#') {
        hashtags.push({ id, label })
      }
    }
  })

  // 將 HTML 轉成文字，段落用 \n 分隔
  const text = Array.from(container.childNodes)
    .map((node) => node.textContent)
    .filter((line) => line?.length)
    .join('\n')

  console.log('text:', JSON.stringify(text))
  console.log('taggedUser:', taggedUser)
  console.log('hashtags:', hashtags)
}
</script>

<template>
  <EditorContent class="border border-gray-400 rounded-xl max-w-125 flex-1" :editor="editor" />

  <button @click="onSubmit" class="bg-gray-400 py-2 px-3 rounded-xl">送出</button>
</template>
