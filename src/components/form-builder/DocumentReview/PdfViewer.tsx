import React, { useEffect, useRef } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import type { ActiveSource } from '../../../types';

const { Text } = Typography;

interface PdfViewerProps {
  activeSource: ActiveSource | null;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 800;
const PAGE_BG = '#fff';
const HIGHLIGHT_COLOR = 'rgba(250, 173, 20, 0.45)';
const HIGHLIGHT_BORDER = 'rgba(250, 173, 20, 0.9)';

const PdfViewer: React.FC<PdfViewerProps> = ({ activeSource }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw page background
    ctx.fillStyle = PAGE_BG;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw page border shadow line
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw simulated text lines when no highlight active
    if (!activeSource || activeSource.boxes.length === 0) {
      ctx.fillStyle = '#f0f0f0';
      for (let row = 0; row < 28; row++) {
        const y = 48 + row * 26;
        const w = row % 5 === 4 ? CANVAS_WIDTH * 0.55 : CANVAS_WIDTH * (0.75 + Math.random() * 0.18);
        ctx.fillRect(48, y, w, 10);
      }
      return;
    }

    // Draw simulated text lines as background content
    ctx.fillStyle = '#f0f0f0';
    for (let row = 0; row < 28; row++) {
      const y = 48 + row * 26;
      const lineW = row % 5 === 4 ? CANVAS_WIDTH * 0.55 : CANVAS_WIDTH * 0.82;
      ctx.fillRect(48, y, lineW, 10);
    }

    // Draw bounding box highlights
    activeSource.boxes.forEach(([x1, y1, x2, y2]) => {
      ctx.fillStyle = HIGHLIGHT_COLOR;
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.strokeStyle = HIGHLIGHT_BORDER;
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    });
  }, [activeSource]);

  const isEmpty = !activeSource;

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
        {isEmpty ? (
          <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
            <FileTextOutlined style={{ fontSize: 48, marginBottom: 12 }} />
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Click a source tag on the left to view the document
              </Text>
            </div>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            style={{
              boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
              borderRadius: 4,
              maxWidth: '100%',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
