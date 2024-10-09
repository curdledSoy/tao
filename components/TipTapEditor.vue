<template>
  <div class="tiptap-editor">
    <ClientOnly>
      <div v-if="editor" class="editor-menu">
        <div class="menu-grid">
          <!-- Clipboard section -->
          <div class="menu-section">
            <h3>Clipboard</h3>
            <button @click.prevent="pasteFromClipboard" title="Paste">
              <Icon name="mdi:content-paste" />
              <span>Paste</span>
            </button>
          </div>

          <!-- Font section -->
          <div class="menu-section">
            <h3>Font</h3>
            <div class="button-group">
              <button @click.prevent="editor.chain().focus().toggleBold().run()"
                :class="{ 'is-active': editor.isActive('bold') }" title="Bold">
                <Icon name="mdi:format-bold" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleItalic().run()"
                :class="{ 'is-active': editor.isActive('italic') }" title="Italic">
                <Icon name="mdi:format-italic" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleStrike().run()"
                :class="{ 'is-active': editor.isActive('strike') }" title="Strikethrough">
                <Icon name="mdi:format-strikethrough" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleSubscript().run()"
                :class="{ 'is-active': editor.isActive('subscript') }" title="Subscript">
                <Icon name="mdi:format-subscript" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleSuperscript().run()"
                :class="{ 'is-active': editor.isActive('superscript') }" title="Superscript">
                <Icon name="mdi:format-superscript" />
              </button>
            </div>
          </div>

          <!-- Paragraph section -->
          <div class="menu-section">
            <h3>Paragraph</h3>
            <div class="button-group">
              <button v-for="align in ['left', 'center', 'right', 'justify']" :key="align"
                @click.prevent="editor.chain().focus().setTextAlign(align).run()"
                :class="{ 'is-active': editor.isActive({ textAlign: align }) }"
                :title="`Align ${align}`">
                <Icon :name="`mdi:format-align-${align}`" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleBulletList().run()"
                :class="{ 'is-active': editor.isActive('bulletList') }" title="Bullet List">
                <Icon name="mdi:format-list-bulleted" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleOrderedList().run()"
                :class="{ 'is-active': editor.isActive('orderedList') }" title="Numbered List">
                <Icon name="mdi:format-list-numbered" />
              </button>
              <button @click.prevent="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'is-active': editor.isActive('blockquote') }" title="Quote">
                <Icon name="mdi:format-quote-close" />
              </button>
            </div>
          </div>

          <!-- Styles section -->
          <div class="menu-section">
            <h3>Styles</h3>
            <div class="button-group">
              <button v-for="level in [1, 2, 3]" :key="level"
                @click.prevent="editor.chain().focus().toggleHeading({ level }).run()"
                :class="{ 'is-active': editor.isActive('heading', { level }) }"
                :title="`Heading ${level}`">
                H{{ level }}
              </button>
            </div>
          </div>

          <!-- Insert section -->
          <div class="menu-section">
            <h3>Insert</h3>
            <button @click.prevent="addImage" :disabled="isUploadingImage" class="tiptap-image-button" title="Insert Image">
              <Icon name="mdi:image-plus" />
              <span>Image</span>
            </button>
          </div>

          <!-- Image Alignment section -->
          <div class="menu-section" v-if="editor?.isActive('image')">
            <h3>Image Options</h3>
            <div class="button-group">
              <button v-for="align in ['inline-left', 'inline-right', 'block-left', 'block-right', 'center']" :key="align"
                @click.prevent="setImageAlignment(align)"
                :class="{ 'is-active': editor.isActive('image', { align }) }"
                :title="`Align image ${align}`">
                <Icon :name="getAlignIcon(align)" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <editor-content :editor="editor" />
      <input type="file" ref="fileInput" @change="uploadImage" accept="image/*" style="display: none;" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent, mergeAttributes } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'

const props = defineProps<{
    modelValue: string
    placeholder?: string
}>()

const isUploadingImage = useState("isLoadingImage", () => false
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editor = ref<Editor | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const addImage = () => {
    fileInput.value?.click()
}

const uploadImage = async (event: Event) => {
    isUploadingImage.value = true
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    // Here you would typically upload the file to your server or a cloud storage service
    // For this example, we'll use a placeholder URL
    const imageUrl = await uploadImageToServer(file)

    editor.value?.chain().focus().setImage({ src: imageUrl }).run()
}

const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const { data } = await useAuthFetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })

    if (data.value && data.value.url) {
      return data.value.url
    } else {
      throw new Error('Failed to upload image')
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  } finally {
    isUploadingImage.value = false
  }
}

const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    editor.value?.commands.insertContent(text)
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err)
  }
}

const getAlignIcon = (align) => {
  const icons = {
    'inline-left': 'mdi:format-wrap-inline',
    'inline-right': 'mdi:format-wrap-inline',
    'block-left': 'mdi:format-float-left',
    'block-right': 'mdi:format-float-right',
    'center': 'mdi:format-align-center',
  }
  return icons[align] || 'mdi:format-align-center'
}

const setImageAlignment = (align) => {
  editor.value?.chain().focus().updateAttributes('image', { align }).run()
}

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: null,
        parseHTML: element => element.getAttribute('data-align'),
        renderHTML: attributes => {
          if (!attributes.align) {
            return {}
          }
          return { 'data-align': attributes.align }
        },
      },
    }
  },
  addNodeView() {
    return ({ node, HTMLAttributes, getPos }) => {
      const container = document.createElement('div')
      container.classList.add('tiptap-image-container')
      
      const img = document.createElement('img')
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        img.setAttribute(key, value)
      })
      
      container.appendChild(img)
      
      if (node.attrs.align) {
        container.style.cssText = getAlignmentStyle(node.attrs.align)
      }
      
      return {
        dom: container,
        contentDOM: container,
        update: (updatedNode) => {
          if (updatedNode.type !== this.name) return false
          
          if (updatedNode.attrs.align) {
            container.style.cssText = getAlignmentStyle(updatedNode.attrs.align)
          } else {
            container.style.cssText = ''
          }
          
          return true
        },
      }
    }
  },
})

const getAlignmentStyle = (align) => {
  switch (align) {
    case 'inline-left':
      return 'float: left; margin-right: 1em; margin-bottom: 1em;'
    case 'inline-right':
      return 'float: right; margin-left: 1em; margin-bottom: 1em;'
    case 'block-left':
      return 'float: left; margin-right: 1em; margin-bottom: 1em; clear: both;'
    case 'block-right':
      return 'float: right; margin-left: 1em; margin-bottom: 1em; clear: both;'
    case 'center':
      return 'display: block; margin-left: auto; margin-right: auto;'
    default:
      return ''
  }
}

onMounted(() => {
  editor.value = new Editor({
    content: props.modelValue,
    extensions: [
      StarterKit,
      CustomImage.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none',
      },
      handleClick(view, pos, event) {
        const { state } = view
        const selectionRange = state.selection.$from.pos
        const node = state.doc.nodeAt(selectionRange)
        if (node && node.type.name === 'image') {
          // Highlight the image
          view.dispatch(state.tr.setSelection(state.selection.from))
        }
      },
    },
    editable: true,
    onUpdate: ({ editor }) => {
      emit('update:modelValue', editor.getHTML())
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

watch(() => props.modelValue, (newValue) => {
  const isSame = newValue === editor.value?.getHTML()
  if (editor.value && !isSame) {
    editor.value.commands.setContent(newValue, false)
  }
})
</script>

<style>
.tiptap-editor {
  @apply border rounded-md p-2;
}

.editor-menu {
  @apply mb-4 border-b pb-2;
}

.menu-grid {
  @apply grid grid-cols-5 gap-4;
}

.menu-section {
  @apply flex flex-col items-center;
}

.menu-section h3 {
  @apply text-xs font-semibold text-gray-500 mb-2;
}

.button-group {
  @apply flex flex-wrap justify-center gap-1;
}

.menu-section button {
  @apply p-1 rounded-md transition-colors duration-200 flex flex-col items-center;
  @apply text-gray-700 hover:bg-gray-100;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.menu-section button.is-active {
  @apply bg-blue-100 text-blue-700;
}

.menu-section button span {
  @apply text-xs mt-1;
}

.tiptap-image-button {
  @apply px-2 py-1 text-white rounded-md hover:bg-blue-600 transition-colors duration-200;
  @apply font-medium flex flex-col items-center;
}

.ProseMirror {
  @apply min-h-[150px] outline-none mt-4;
}

.ProseMirror img {
  max-width: 100%;
  height: auto;
}

.ProseMirror img.tiptap-image {
  transition: box-shadow 0.3s ease;
}

.ProseMirror img.tiptap-image.ProseMirror-selectednode {
  outline: 2px solid #4299e1;
  box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.5);
}

.ProseMirror .tiptap-image-container {
  display: inline-block;
  position: relative;
}

.ProseMirror .tiptap-image-container.ProseMirror-selectednode::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  outline: 2px solid #4299e1;
  box-shadow: 0 0 0 4px rgba(66, 153, 225, 0.5);
  pointer-events: none;
}

.ProseMirror .tiptap-image-container img {
  max-width: 100%;
  height: auto;
}
</style>