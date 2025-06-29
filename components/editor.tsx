import { forwardRef, useEffect, useImperativeHandle } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Heading from "@tiptap/extension-heading"
// import Bold from "@tiptap/extension-bold"
// import Italic from "@tiptap/extension-italic"
// import Underline from "@tiptap/extension-underline"
// import BulletList from "@tiptap/extension-bullet-list"
// import OrderedList from "@tiptap/extension-ordered-list"
// import ListItem from "@tiptap/extension-list-item"

interface EditorProps {
  initialContent: string
  readOnly?: boolean
  onChange?: (html: string) => void
}

interface EditorHandle {
  getContent: () => string | undefined
  setContent: (content: string) => void
}

const Editor = forwardRef<EditorHandle, EditorProps>(({ initialContent, readOnly = false }, ref) => {
  const editor = useEditor({
    // extensions: [
    //   StarterKit,
    //   Heading,
    //   Bold,
    //   Italic,
    //   Underline,
    //   BulletList,
    //   OrderedList,
    //   ListItem,
    // ],
    content: initialContent,
    editable: !readOnly,
    // onUpdate: ({ editor }) => {
    //   onChange?.(editor.getHTML())
    // },
  })

  useImperativeHandle(ref, () => ({
    getContent: () => editor?.getHTML(),
    setContent: (content: string) => editor?.commands.setContent(content),
  }))

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  return (
    <div className={`prose max-w-none ${readOnly ? "pointer-events-none" : ""}`}>
      <EditorContent editor={editor} />
    </div>
  )
})

Editor.displayName = "Editor"

export default Editor 