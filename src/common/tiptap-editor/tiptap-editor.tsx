import "./styles.scss";

import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle, { TextStyleOptions } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Dropcursor from "@tiptap/extension-dropcursor";
import Image from "@tiptap/extension-image";
import {
  Editor,
  EditorProvider,
  isEmptyObject,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef, useState } from "react";

interface TextTypeOption {
  title: string;
  icon: string;
  action: (e: Editor) => void;
}

const TEXT_TYPES: TextTypeOption[] = [
  {
    title: "Paragraph",
    icon: "icon paragraph",
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: "Large Heading",
    icon: "icon large-heading",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: "Small Heading",
    icon: "icon small-heading",
    action: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: "Bullet List",
    icon: "icon bullet-list",
    action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    icon: "icon numbered-list",
    action: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    title: "Quote",
    icon: "icon quote",
    action: (editor: Editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    title: "Code Block",
    icon: "icon code",
    action: (editor: Editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
];

interface TextTypeOptionsProps {
  editor?: Editor | null;
  toolbarRef: any;
  setShowOptions: (state: boolean) => void;
  setSelectedOption: (opt: TextTypeOption) => void;
}

const TextTypeOptions = ({
  editor,
  setShowOptions,
  setSelectedOption,
}: TextTypeOptionsProps) => {
  const dropDownRef = useRef<any | null>(null);

  if (!editor) {
    return null;
  }

  const handleSelect = async (type: TextTypeOption) => {
    await type.action(editor);
    setSelectedOption(type);
    setShowOptions(false);
  };

  return (
    <div className="dropdown" ref={dropDownRef}>
      {TEXT_TYPES.map(
        (type: {
          title: string;
          icon: string;
          action: (e: Editor) => void;
        }) => (
          <button
            className="item"
            onClick={() => handleSelect(type)}
            key={type.title}
          >
            <span className={type.icon} />
            <span className="text">{type.title}</span>
          </button>
        )
      )}
    </div>
  );
};

const SelectTextType = (toolbarRef: any) => {
  const { editor } = useCurrentEditor();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedType, setSelectedType] = useState<TextTypeOption>({
    title: "Paragraph",
    icon: "icon paragraph",
    action: (editor: Editor) => editor.chain().focus().setParagraph().run(),
  });

  return (
    <div>
      <button
        className="toolbar-item block-controls"
        onClick={() => setShowOptions((prevState) => !prevState)}
        aria-label="Formatting Options"
      >
        <span className={"icon block-type " + selectedType?.icon} />
        <span className="text">{selectedType?.title}</span>
        <i className="chevron-down" />
      </button>
      {showOptions && (
        <TextTypeOptions
          editor={editor}
          toolbarRef={toolbarRef}
          setShowOptions={setShowOptions}
          setSelectedOption={setSelectedType}
        />
      )}
    </div>
  );
};

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  const toolbarRef = useRef(null);

  const setLink = useCallback(() => {
    const previousUrl = editor!.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor!
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  const toggleLink = () => {
    if (!editor!.isActive("link")) {
      setLink();
    } else {
      editor!.chain().focus().unsetLink().run();
    }
  };

  if (!editor) {
    return null;
  }

  const addImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      {!isEmptyObject(editor) && <SelectTextType toolbarRef={toolbarRef} />}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "is-active toolbar-item" : "toolbar-item"
        }
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "is-active toolbar-item" : "toolbar-item"
        }
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={
          editor.isActive("underline")
            ? "is-active toolbar-item"
            : "toolbar-item"
        }
        disabled={!editor.can().chain().focus().toggleStrike().run()}
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike") ? "is-active toolbar-item" : "toolbar-item"
        }
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={
          editor.isActive("code") ? "is-active toolbar-item" : "toolbar-item"
        }
        aria-label="Insert Code"
      >
        <i className="format code" />
      </button>

      <button
        onClick={toggleLink}
        className={
          editor.isActive("link") ? "is-active toolbar-item" : "toolbar-item"
        }
        aria-label="Insert Link"
      >
        <i className="format link" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={
          editor.isActive({ textAlign: "left" })
            ? "is-active toolbar-item"
            : "toolbar-item"
        }
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={
          editor.isActive({ textAlign: "center" })
            ? "is-active toolbar-item"
            : "toolbar-item"
        }
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={
          editor.isActive({ textAlign: "right" })
            ? "is-active toolbar-item"
            : "toolbar-item"
        }
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        className={
          editor.isActive({ textAlign: "justify" })
            ? "is-active toolbar-item"
            : "toolbar-item"
        }
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>
      <button
        onClick={() => addImage()}
        className="toolbar-item"
        aria-label="Add Image"
      >
        <i className="format image" />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="toolbar-item"
        aria-label="Add Horizontal Row"
      >
        <i className="format horizontal-row" />
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as Partial<TextStyleOptions>),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Link.configure({
    openOnClick: true,
  }),
  Image,
  // Dropcursor,
];

const content = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus dui turpis, eget bibendum dui imperdiet nec. Phasellus lorem tellus, rutrum a arcu non, interdum elementum ligula. In dapibus turpis a lorem facilisis vulputate. Nam enim nisi, gravida in elementum sit amet, cursus sed urna. Cras fermentum vestibulum nisi, dictum feugiat justo mollis sit amet. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis ullamcorper convallis enim in tempor. Integer sodales varius libero, nec hendrerit diam congue ac. Curabitur semper nec quam a ornare. Fusce sit amet quam ultrices, tincidunt ante a, bibendum velit. Vestibulum posuere nunc eget nulla cursus, viverra porta metus aliquam. Etiam egestas leo nibh, at tincidunt sapien finibus nec. Sed in sapien id purus suscipit ultricies sit amet sit amet ipsum. Donec lacinia quis nunc quis sodales.

Nulla mollis orci id faucibus vestibulum. Aliquam quis viverra magna. Donec mollis ornare pulvinar. Nullam vel placerat orci. Curabitur felis eros, commodo ac placerat eu, auctor eget leo. Cras sit amet massa hendrerit, ullamcorper velit non, egestas nibh. Etiam libero elit, mattis id arcu vitae, rhoncus molestie nisl. Praesent at mattis enim. Aliquam ultrices, felis cursus viverra feugiat, dui lorem interdum est, elementum tincidunt turpis turpis a purus. Nulla ornare ante quis neque suscipit, sed laoreet enim auctor. Etiam placerat, nibh nec accumsan faucibus, diam purus rutrum dolor, a fermentum lorem lacus sed nunc.

Etiam sodales odio in tellus porttitor, vel tristique urna elementum. Fusce nunc nulla, lobortis eleifend scelerisque ac, viverra eget turpis. Fusce nec luctus ipsum. Nam sed tellus eget massa malesuada congue. Nulla condimentum nibh ut mi aliquam luctus. Nulla facilisi. Etiam pulvinar fermentum diam, lacinia convallis ipsum vulputate id. Donec posuere accumsan eleifend. Praesent at magna augue. Sed at luctus ipsum, at facilisis ligula. Cras posuere metus tellus, et imperdiet mauris mollis eu. Vestibulum pulvinar sapien ut leo vehicula accumsan. Ut rutrum felis sit amet arcu fermentum, eu dapibus risus facilisis. Proin et lorem nec leo fermentum tristique sed eu ipsum.

Nam molestie augue non eros consectetur, cursus tincidunt neque blandit. Nam auctor tellus a leo ullamcorper, eu sagittis nisi bibendum. Proin mattis nulla non ultricies finibus. Integer id tristique enim. Cras ut consectetur justo, ac ultrices dui. Vivamus hendrerit consectetur tempor. Aliquam erat volutpat. Sed in orci dui. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut venenatis dictum consequat. Donec vulputate, metus at sollicitudin tincidunt, ante erat finibus nulla, blandit ornare felis tellus vitae ipsum. Ut leo lacus, dapibus non mollis ultricies, accumsan nec velit. Nulla consectetur vestibulum libero maximus rutrum. Sed imperdiet consequat nulla vel euismod.

Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam sed nibh sed dui elementum vestibulum eget at eros. Vivamus turpis felis, ultrices in cursus eget, sollicitudin sed tortor. Vivamus eu aliquet lacus, a ornare ligula. In placerat tortor id ex lacinia, sit amet placerat mauris vulputate. Duis ac laoreet urna. Pellentesque suscipit, magna et egestas faucibus, arcu arcu dictum diam, et placerat orci sapien suscipit lectus. Fusce mattis malesuada tellus, vitae blandit sapien pellentesque quis.
`;

export const TiptapEditor = () => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      children={null}
    ></EditorProvider>
  );
};
