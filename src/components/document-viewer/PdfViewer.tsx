import React, { useEffect, useRef, useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Typography, Spin } from 'antd';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

const { Text } = Typography;

const HIGHLIGHT_COLOR = 'rgba(250, 173, 20, 0.45)';
const HIGHLIGHT_BORDER = 'rgba(250, 173, 20, 0.9)';

export interface PdfViewerProps {
  src: string;
  pageIndex?: number;
  highlights?: number[][];
  label?: string;
}

type ViewerState = 'loading' | 'rendered' | 'error';

const PdfViewer: React.FC<PdfViewerProps> = ({ src, pageIndex = 0, highlights, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setViewerState('loading');
    setErrorMsg(null);

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(pageIndex + 1);
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const viewport = page.getViewport({ scale: 1 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        if (cancelled) return;

        highlights?.forEach(([x1, y1, x2, y2]) => {
          ctx.fillStyle = HIGHLIGHT_COLOR;
          ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
          ctx.strokeStyle = HIGHLIGHT_BORDER;
          ctx.lineWidth = 2;
          ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        });

        setViewerState('rendered');
      } catch (err) {
        if (cancelled) return;
        setViewerState('error');
        setErrorMsg(err instanceof Error ? err.message : 'Failed to load PDF');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src, pageIndex, highlights]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <FileTextOutlined style={{ color: '#1890ff' }} />
        <Text style={{ fontSize: 13, flex: 1 }} ellipsis>
          {label ?? src}
        </Text>
        <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
          Page {pageIndex + 1}
        </Text>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: viewerState === 'loading' ? 'center' : 'flex-start',
          padding: '16px',
          background: '#f5f5f5',
        }}
      >
        {viewerState === 'loading' && <Spin size="large" />}

        {viewerState === 'error' && (
          <div style={{ textAlign: 'center', color: '#ff4d4f' }}>
            <FileTextOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>
              <Text type="danger" style={{ fontSize: 13 }}>
                {errorMsg ?? 'Failed to load document'}
              </Text>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            display: viewerState === 'rendered' ? 'block' : 'none',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            borderRadius: 4,
            maxWidth: '100%',
          }}
        />
      </div>
    </div>
  );
};

export default PdfViewer;
