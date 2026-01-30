import { useState, useCallback } from "react";
import { useModal } from "@/hooks/useModal";

type MessageType = "success" | "error";

type UseMessageModalReturn = {
  modal: ReturnType<typeof useModal>;
  messageText: string;
  messageType: MessageType;
  showMessage: (text: string, type?: MessageType) => void;
};

/**
 * メッセージモーダル管理のカスタムフック
 */
export function useMessageModal(): UseMessageModalReturn {
  const modal = useModal();
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("success");

  const showMessage = useCallback(
    (text: string, type: MessageType = "success") => {
      setMessageText(text);
      setMessageType(type);
      modal.open();
    },
    [modal]
  );

  return {
    modal,
    messageText,
    messageType,
    showMessage,
  };
}

