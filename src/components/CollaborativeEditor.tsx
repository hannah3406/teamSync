'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEffect, useState } from 'react';

export function CollaborativeEditor({ documentId }: { documentId: string }) {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [doc, setDoc] = useState<Y.Doc | null>(null);

  useEffect(() => {
    // Yjs 문서 및 WebSocket 공급자 초기화
    const yDoc = new Y.Doc();
    const wsProvider = new WebsocketProvider('wss://your-websocket-server.com', documentId, yDoc);

    setDoc(yDoc);
    setProvider(wsProvider);

    return () => {
      wsProvider.destroy();
      yDoc.destroy();
    };
  }, [documentId]);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          history: false, // Yjs가 처리하므로 내장 기록 비활성화
        }),
        // 협업 활성화
        Collaboration.configure({
          document: doc,
        }),
        // 다른 사용자의 커서 표시
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: '사용자 이름',
            color: '#ff0000',
          },
        }),
      ],
      content: '',
      editable: true,
    },
    [doc, provider]
  );

  return (
    <div className="editor-wrapper">
      <EditorContent editor={editor} />
    </div>
  );
}
