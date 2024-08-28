import React, { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import debounce from "lodash/debounce";

interface TiptapProps {
  content: string;
  onChange: (html: string) => void;
  onUpdate: () => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 sticky top-0 bg-background z-10 p-2 border-b border-primary">
      <Button
        size="sm"
        variant={editor.isActive("bold") ? "secondary" : "outline"}
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Bold size={18} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("italic") ? "secondary" : "outline"}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Italic size={18} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("underline") ? "secondary" : "outline"}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <UnderlineIcon size={18} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("link") ? "secondary" : "outline"}
        onClick={() => {
          const url = window.prompt("Enter the URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <LinkIcon size={18} />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          const url = window.prompt("Enter the image URL");
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <ImageIcon size={18} />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive({ textAlign: "left" }) ? "secondary" : "outline"
        }
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <AlignLeft size={18} />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive({ textAlign: "center" }) ? "secondary" : "outline"
        }
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <AlignCenter size={18} />
      </Button>
      <Button
        size="sm"
        variant={
          editor.isActive({ textAlign: "right" }) ? "secondary" : "outline"
        }
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <AlignRight size={18} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("bulletList") ? "secondary" : "outline"}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <List size={18} />
      </Button>
      <Button
        size="sm"
        variant={editor.isActive("orderedList") ? "secondary" : "outline"}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className="text-primary hover:bg-primary hover:text-primary-foreground"
      >
        <ListOrdered size={18} />
      </Button>
    </div>
  );
};

const Tiptap: React.FC<TiptapProps> = ({ content, onChange, onUpdate }) => {
  const debouncedUpdate = useCallback(
    debounce(() => {
      onUpdate();
    }, 2000),
    [onUpdate],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-outside leading-3 pl-4",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-outside leading-3 pl-4",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "leading-normal mb-2",
          },
        },
      }),
      Underline,
      Link,
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    immediatelyRender: false,
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
      debouncedUpdate();
    },
  });

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  return (
    <div className="border border-primary rounded-md flex flex-col min-h-full bg-background">
      <MenuBar editor={editor} />
      <div className="flex-grow overflow-auto p-4">
        <EditorContent
          editor={editor}
          className="prose max-w-none min-h-full text-foreground"
        />
      </div>
    </div>
  );
};

export default Tiptap;
