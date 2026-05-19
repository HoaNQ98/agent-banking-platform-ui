import React, { useEffect, useRef, useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Typography, Spin } from 'antd';
import * as pdfjsLib from 'pdfjs-dist';
import type { ActiveSource } from '../../../types';
import { getRegulationPath } from '../../../constants';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;

const { Text } = Typography;

const HIGHLIGHT_COLOR = 'rgba(250, 173, 20, 0.45)';
const HIGHLIGHT_BORDER = 'rgba(250, 173, 20, 0.9)';

interface PdfViewerProps {
  activeSource: ActiveSource | null;
}

type ViewerState = 'idle' | 'loading' | 'rendered' | 'unsupported' | 'error';

const PdfViewer: React.FC<PdfViewerProps> = ({ activeSource }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!activeSource) {
      setViewerState('idle');
      return;
    }

    if (activeSource.sourceType === 'document') {
      setViewerState('unsupported');
      return;
    }

    const path = getRegulationPath(activeSource.docName);
    if (!path) {
      setViewerState('error');
      setErrorMsg(`No registered path for "${activeSource.docName}"`);
      return;
    }

    let cancelled = false;
    setViewerState('loading');
    setErrorMsg(null);

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(path);
        const pdf = await loadingTask.promise;
        if (cancelled) return;

        const page = await pdf.getPage(activeSource.pageIndex + 1);
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

        // Bbox coordinates are in canvas pixel space at scale=1 (top-down, no flip needed).
        activeSource.boxes.forEach(([x1, y1, x2, y2]) => {
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
  }, [activeSource]);

  const isEmpty = viewerState === 'idle';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Viewer header */}
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
          {activeSource ? activeSource.docName : 'No document selected'}
        </Text>
        {activeSource && (
          <Text type="secondary" style={{ fontSize: 12, flexShrink: 0 }}>
            Page {activeSource.pageIndex + 1}
          </Text>
        )}
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: isEmpty ? 'center' : 'flex-start',
          padding: '16px',
          background: '#f5f5f5',
        }}
      >
        {isEmpty && (
          <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
            <FileTextOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Click a source tag on the left to view the document
              </Text>
            </div>
          </div>
        )}

        {viewerState === 'loading' && <Spin size="large" />}

        {viewerState === 'unsupported' && (
          <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
            <FileTextOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Uploaded document preview is not yet supported
              </Text>
            </div>
          </div>
        )}

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
