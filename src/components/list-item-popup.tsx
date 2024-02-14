"use client";
import { eActionType } from "@/constants/system-defined.enum";
import { commandParams, commands, mentions } from "@/data/data";
import { IProps } from "@/types/prop";
import { useMemo } from "react";

// component prop
interface ListItemPopupProps extends IProps {
  type: eActionType;
  search: string;
}

export default function ListItemPopup(props: ListItemPopupProps) {
  const { type, search } = props;

  /**
   * Memoized hook to filter items based on search criteria and action type.
   */
  const matchedItems = useMemo(() => {
    if (search) {
      if (type === eActionType.COMMAND) {
        return commands.filter((c) => c.match(new RegExp(`${search}`, "i")));
      } else if (type === eActionType.MENTION) {
        return mentions.filter((c) => c.match(new RegExp(`${search}`, "i")));
      }
    }
    return [];
  }, [search, type]);

  // will display popup if items matched
  if (matchedItems.length) {
    return (
      <div className="absolute top-1 bg-white border rounded-xl shadow-xl mt-2 w-full overflow-y-auto max-h-80 z-50">
        <ul id="popupList" className="text-gray-800 font-semibold">
          {matchedItems.map((name, idx) => (
            <li
              key={idx}
              className="px-3 py-2 cursor-pointer hover:bg-blue-50 flex flex-row items-center justify-between"
            >
              {type === eActionType.COMMAND ? "/" : "@"}
              {name}
              <span>
                {type === eActionType.COMMAND &&
                  commandParams[search]?.join?.(", ")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else {
    return <></>;
  }
}
