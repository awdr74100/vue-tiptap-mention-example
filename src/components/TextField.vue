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
import { nanoid } from 'nanoid'

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
      HTMLAttributes: {},
      renderHTML({ node, options }) {
        // console.log(node)
        // console.log(options)
        return [
          'span',
          mergeAttributes(options.HTMLAttributes, {
            class: 'text-blue-500',
          }),
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
  const text = '你好啊 \n@Eric 123\n 你好啊 @[whfwefwf]\n  #美食 \n1#ddd2'

  // const taggerUsers = [{ id: 'whfwefwf', nickname: 'eric' }];
  // const hashtags = ['美食', 'ddd2'];

  // const text=  '你好啊 \n@Eric 123\n 你好啊 @[whfwefwf]\n  #美食 \n1#ddd2'

  const convertToDoc = (str: string) => {
    const paragraphs = str.split(/\n/)
    const content: any[] = []

    for (const line of paragraphs) {
      const children: any[] = []

      // 將整行依序掃描 mention / hashtag
      const regex = /(@\[[^\]]+\]|#\S+)/g
      let lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = regex.exec(line)) !== null) {
        const matchText = match[0]
        const start = match.index

        // 先加前面的純文字
        if (start > lastIndex) {
          children.push({ type: 'text', text: line.slice(lastIndex, start) })
        }

        // 判斷是 mention 還是 hashtag
        if (matchText.startsWith('@[')) {
          const id = matchText.slice(2, -1)
          const user = taggerUsers.find((u) => u.id === id)
          if (user) {
            children.push({
              type: 'mention',
              attrs: { id: user.id, label: user.nickname, mentionSuggestionChar: '@' },
            })
          } else {
            // children.push({
            //   type: 'mention',

            //   attrs: { id: '', label: id, mentionSuggestionChar: '@' },
            // })
            // 不在名單內，維持純文字顯示
            children.push({ type: 'text', text: matchText })
          }
        } else if (matchText.startsWith('#')) {
          const tag = matchText.slice(1)
          if (hashtags.includes(tag)) {
            children.push({
              type: 'mention', // or custom hashtag node
              attrs: { id: tag, label: tag, mentionSuggestionChar: '#' },
            })
          } else {
            children.push({
              type: 'mention',
              attrs: { id: tag, label: tag, mentionSuggestionChar: '#' },
            })
            // children.push({
            //   type: 'mention',

            //   attrs: { id: '', label: tag, mentionSuggestionChar: '#' },
            // })
            // 不在名單內，維持純文字
            // children.push({ type: 'text', text: matchText })
          }
        }

        lastIndex = match.index + matchText.length
      }

      // 剩下的文字
      if (lastIndex < line.length) {
        children.push({ type: 'text', text: line.slice(lastIndex) })
      }

      // 加入段落
      content.push({
        type: 'paragraph',
        content: children.length ? children : [{ type: 'text', text: '' }],
      })
    }

    return {
      type: 'doc',
      content,
    }
  }

  const doc = convertToDoc(text)
  console.log(JSON.stringify(doc))

  editor.value?.commands.setContent(doc)
})

// onMounted(() => {
//   const taggerUsers = [{ id: 'whfwefwf', nickname: 'Eric' }]
//   const hashtags = ['美食']
//   const text = '你好啊 \n 123 \n 你好啊 @[whfwefwf]\n#美食 @dwdq #ddd'

//   const convertToHTML = (str: string) => {
//     // 按換行分段
//     const paragraphs = str.split(/\n/)

//     console.log(paragraphs);

//     return paragraphs
//       .map((line) => {
//         let htmlLine = line

//         // 處理 mention: @[id] → <a class="text-red-500" ...>@nickname</a>
//         htmlLine = htmlLine.replace(/@\[([^\]]+)\]/g, (_, id) => {
//           const user = taggerUsers.find((u) => u.id === id)
//           if (!user) return `@[${id}]`
//           return `<span class="text-red-500" data-type="mention" data-id="${user.id}" data-label="${user.nickname}" data-mention-suggestion-char="@">@${user.nickname}</span>`
//         })

//         // 處理 hashtag: #tag → <span class="hashtag">#tag</span>
//         htmlLine = htmlLine.replace(/#(\S+)/g, (_, tag) => {
//           console.log(!hashtags.includes(tag))
//           if (!hashtags.includes(tag)) return `#${tag}`
//           return `<span class="text-red-500" data-type="mention" data-id="${tag}" data-label="${tag}" data-mention-suggestion-char="#">#${tag}</span>`
//         })

//         // 包成 p
//         return `<p>${htmlLine}</p>`
//       })
//       .join('')
//   }

//   console.log(convertToHTML(text))

//   editor.value?.commands.setContent(convertToHTML(text), { parseOptions: { preserveWhitespace: 'full' } })

//   // 分段
//   // const lines = text.split(/\n/)

//   // const content = {
//   //   type: 'doc',
//   //   content: lines.map((line) => {
//   //     // 每一段落
//   //     const children = []

//   //     let remaining = line

//   //     // 處理 @mention
//   //     taggerUsers.forEach((u) => {
//   //       const idx = remaining.indexOf(`@[${u.id}]`)
//   //       if (idx >= 0) {
//   //         if (idx > 0) {
//   //           children.push({ type: 'text', text: remaining.slice(0, idx) })
//   //         }
//   //         children.push({
//   //           type: 'mention',
//   //           attrs: { id: u.id, label: u.nickname },
//   //         })
//   //         remaining = remaining.slice(idx + `@[${u.id}]`.length)
//   //       }
//   //     })

//   //     // 處理 hashtag
//   //     hashtags.forEach((tag) => {
//   //       const idx = remaining.indexOf(`#${tag}`)
//   //       if (idx >= 0) {
//   //         if (idx > 0) {
//   //           children.push({ type: 'text', text: remaining.slice(0, idx) })
//   //         }
//   //         children.push({
//   //           type: 'mention',
//   //           attrs: { id: tag, label: `#${tag}` },
//   //         })
//   //         remaining = remaining.slice(idx + `#${tag}`.length)
//   //       }
//   //     })

//   //     if (remaining.length) {
//   //       children.push({ type: 'text', text: remaining })
//   //     }

//   //     return { type: 'paragraph', content: children }
//   //   }),
//   // }

//   // editor.value?.commands.setContent(content)
// })

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

function parseEditorContent(html: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const taggedUsers: { id: string; label: string }[] = [];
  const hashtags: string[] = [];

  // 遞迴處理每個節點
  function traverse(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      // 抓出所有 #xxx 並記錄
      const hashtagMatches = text.match(/#[\p{L}\p{N}_-]+/gu);
      if (hashtagMatches) {
        hashtagMatches.forEach(tag => {
          hashtags.push(tag);
        });
      }
      return text;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // 處理 mention span
      if (el.dataset.type === 'mention' && el.dataset.mentionSuggestionChar === '@') {
        const id = el.dataset.id ?? '';
        const label = el.dataset.label ?? '';
        if (id && label) {
          taggedUsers.push({ id, label });
          return `@[${id}]`;
        }
      }

      // 處理 hashtag mention，但保留原文字不替代
      if (el.dataset.type === 'mention' && el.dataset.mentionSuggestionChar === '#') {
        const label = el.dataset.label ?? '';
        if (label.startsWith('#')) {
          hashtags.push(label);
        } else {
          hashtags.push(`#${label}`);
        }
        return el.textContent || '';
      }

      // 處理段落、換行
      if (el.tagName === 'P' || el.tagName === 'DIV' || el.tagName === 'BR') {
        const inner = Array.from(el.childNodes).map(traverse).join('');
        // 換行
        return inner + (el.tagName === 'BR' ? '\n' : '\n');
      }

      // 遞迴處理其他節點
      return Array.from(el.childNodes).map(traverse).join('');
    }

    return '';
  }

  const plainText = traverse(doc.body).trim();

  return {
    text: plainText,
    taggedUsers,
    hashtags,
  };
}

const onSubmit = () => {
  const htmlString = editor.value?.getHTML() ?? '';

  /**
   * <p>你好啊 #123</p><p>@Eric 123</p><p> 你好啊 <span data-type="mention" data-id="whfwefwf" data-label="Eric" data-mention-suggestion-char="@" class="text-blue-500">@Eric</span></p><p>  <span data-type="mention" data-id="美食" data-label="美食" data-mention-suggestion-char="#" class="text-blue-500">#美食</span> </p><p>1<span data-type="mention" data-id="ddd2" data-label="ddd2" data-mention-suggestion-char="#" class="text-blue-500">#ddd2</span></p>
   */
  console.log(htmlString);

  console.log(parseEditorContent(htmlString))



  // const taggedUser: { id: string; label: string }[] = []
  // const hashtags: string[] = [];
}
</script>

<template>
  <EditorContent class="border border-gray-400 rounded-xl max-w-125 flex-1" :editor="editor" />

  <button @click="onSubmit" class="bg-gray-400 py-2 px-3 rounded-xl">送出</button>
</template>
