<template>
    <div class="tiptap-editor">
        <ClientOnly>
            <div v-if="editor" class="editor-menu">
                <button @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    :class="{ 'is-active': editor.isActive('bold') }" title="Bold">
                    <Icon name="mdi:format-bold" />
                </button>
                <button @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    :class="{ 'is-active': editor.isActive('italic') }" title="Italic">
                    <Icon name="mdi:format-italic" />
                </button>
                <button @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()"
                    :class="{ 'is-active': editor.isActive('strike') }" title="Strike">
                    <Icon name="mdi:format-strikethrough" />
                </button>
                <!-- ... other buttons ... -->
                <button @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'is-active': editor.isActive('bulletList') }" title="Bullet List">
                    <Icon name="mdi:format-list-bulleted" />
                </button>
                <button @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'is-active': editor.isActive('orderedList') }" title="Ordered List">
                    <Icon name="mdi:format-list-numbered" />
                </button>
                <!-- ... other buttons ... -->
                <button @click="addImage" :disabled="isUploadingImage" type="button" class="tiptap-image-button"
                    title="Add Image">
                    <Icon name="mdi:image-plus" class="mr-1" />
                    Add Image
                </button>
            </div>
            <editor-content :editor="editor" />
            <input type="file" ref="fileInput" @change="uploadImage" accept="image/*" style="display: none;" />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'

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
    // Implement your image upload logic here
    // This is a placeholder implementation
    console.log('Uploading file:', file.name)
    isUploadingImage.value = false
    return URL.createObjectURL(file)
}

onMounted(() => {
    editor.value = new Editor({
        content: props.modelValue,
        extensions: [
            StarterKit,
            Image,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm focus:outline-none',
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

.tiptap-editor .ProseMirror {
    @apply min-h-[150px] outline-none;
}

.editor-menu {
    @apply flex flex-wrap items-center gap-1 mb-2 pb-2 border-b border-gray-200;
}

.editor-menu button {
    @apply p-4 rounded-md transition-colors duration-200;
    @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.editor-menu button.is-active {
    @apply bg-blue-500 text-white hover:bg-blue-600;
}

.tiptap-image-button {
    @apply px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200;
    @apply font-medium flex items-center;
}

.editor-menu .icon {
    @apply w-5 h-5;
}
</style>