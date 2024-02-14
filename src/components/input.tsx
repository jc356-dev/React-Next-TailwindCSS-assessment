"use client";
import { IProps } from "@/types/prop";
import { useEffect, useRef, useState } from "react";
import ListItemPopup from "./list-item-popup";
import { eActionType } from "@/constants/system-defined.enum";

// Regular expression pattern to match commands and mentions based on user input.
const commandsRegex = /(?<=^|\s)\/(?:[^\s@\/]+)?(?=\s|$)/g;
const mentionsRegex = /(?<=^|\s)@(?:[^\s@\/]+)?(?=\s|$)/g;

interface InputBoxProps extends IProps {
  placeholder?: string;
}
interface InputContext {
  type: eActionType;
  search: string;
}

export default function InputBox(props: InputBoxProps) {
  const inputRef = useRef<HTMLDivElement | null>(null);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [inputContext, setInputContext] = useState<InputContext | null>();

  useEffect(() => {
    const element = inputRef.current;
    if (element !== null) {
      //Set placeholder for the first time
      element.textContent = props?.placeholder ?? "";
      setShowPlaceholder(true);

      // Add event listener for input in order to format the text and show placeholder conditionally
      element.addEventListener("input", () => {
        const text = element.innerText;
        const formattedText = formatText(text);
        element.innerHTML = formattedText;
        restoreCursorPos(element); // it will move the cursor to the end of input instead of starting of the input
        detectContext(element.innerText); //it will detetch the text and open the contextual popup with matched item list
      });
      element.addEventListener("focus", () => {
        if (element.textContent == props.placeholder) {
          element.textContent = "";
        }
        setShowPlaceholder(false);
      });
      element.addEventListener("blur", () => {
        if (element.textContent) {
          if (element.textContent === props.placeholder) {
            setShowPlaceholder(true);
          } else {
            setShowPlaceholder(false);
          }
        } else {
          element.textContent = props.placeholder ?? "";
          setShowPlaceholder(true);
        }
      });
    }
  }, [props.placeholder]);

  const formatText = (text: string) => {
    let formattedText = text;
    formattedText = formattedText.replace(
      commandsRegex,
      (match) => `<span class="command">${match}</span>`
    );
    formattedText = formattedText.replace(
      mentionsRegex,
      (match) => `<span class="mention">${match}</span>`
    );
    return formattedText;
  };

  const restoreCursorPos = (element: HTMLDivElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const detectContext = (search: string) => {
    const words = search.split(/\s+/);
    const curCursorWord = words[words.length - 1];
    let curContext: InputContext | null = null;
    if (curCursorWord) {
      if (commandsRegex.test(curCursorWord)) {
        curContext = {
          search: curCursorWord.substring(1),
          type: eActionType.COMMAND,
        };
      } else if (mentionsRegex.test(curCursorWord)) {
        curContext = {
          search: curCursorWord.substring(1),
          type: eActionType.MENTION,
        };
      }
    }
    setInputContext(curContext);
  };

  return (
    <div>
      <div
        {...props}
        ref={inputRef}
        contentEditable
        className={`w-full px-4 py-2 rounded-full shadow-2xl border-2 border-gray-400 bg-white focus:outline-none focus:border-blue-500 whitespace-nowrap  ${
          showPlaceholder ? "placeholder" : ""
        }`}
      />
      {inputContext && (
        <div className="relative">
          <ListItemPopup
            type={inputContext.type}
            search={inputContext.search}
          />
        </div>
      )}
    </div>
  );
}
