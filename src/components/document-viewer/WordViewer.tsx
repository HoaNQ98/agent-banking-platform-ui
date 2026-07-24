import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FileWordOutlined } from '@ant-design/icons';
import { Typography, Spin } from 'antd';
import * as docx from 'docx-preview';

const { Text } = Typography;

export interface WordViewerProps {
  src: string;
  label?: string;
}

type ViewerState = 'loading' | 'rendered' | 'error';

interface ScaleInfo {
  scale: number;
  naturalW: number;
  naturalH: number;
}

const WordViewer: React.FC<WordViewerProps> = ({ src, label }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [viewerState, setViewerState] = useState<ViewerState>('loading');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scaleInfo, setScaleInfo] = useState<ScaleInfo | null>(null);

  const computeScale = useCallback(() => {
    const scroll = scrollRef.current;
    const inner = innerRef.current;
    if (!scroll || !inner) return;

    // Temporarily remove transform to measure true natural size
    inner.style.transform = 'none';

    const naturalW = inner.scrollWidth;
    const naturalH = inner.scrollHeight;
    const available = scroll.clientWidth - 32; // 16px padding each side

    if (naturalW > 0 && available > 0) {
      const scale = Math.min(1, available / naturalW);
      setScaleInfo({ scale, naturalW, naturalH });
    }
  }, []);

  // Apply scale as DOM side-effect after React paint
  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || !scaleInfo) return;
    inner.style.transform = `scale(${scaleInfo.scale})`;
    inner.style.transformOrigin = 'top left';
  }, [scaleInfo]);

  useEffect(() => {
    if (!innerRef.current) return;

    let cancelled = false;
    setViewerState('loading');
    setScaleInfo(null);
    setErrorMsg(null);
    innerRef.current.innerHTML = '';
    innerRef.current.style.transform = 'none';

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(`Failed to fetch document (${res.status})`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        // inWrapper:false, ignoreWidth:false → render at the document's true page width
        // so margins, tables, columns are all faithful to the original file
        await docx.renderAsync(buffer, innerRef.current!, undefined, {
          inWrapper: false,
          ignoreWidth: false,
          ignoreHeight: false,
        });
        if (cancelled) return;

        setViewerState('rendered');
      } catch (err) {
        if (cancelled) return;
        setViewerState('error');
        setErrorMsg(err instanceof Error ? err.message : 'Failed to load document');
      }
    })();

    return () => { cancelled = true; };
  }, [src]);

  useEffect(() => {
    if (viewerState !== 'rendered') return;

    // rAF: wait for browser to paint before measuring
    const raf = requestAnimationFrame(computeScale);

    const observer = new ResizeObserver(computeScale);
    if (scrollRef.current) observer.observe(scrollRef.current);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [viewerState, computeScale]);

  const scaledW = scaleInfo ? scaleInfo.naturalW * scaleInfo.scale : undefined;
  const scaledH = scaleInfo ? scaleInfo.naturalH * scaleInfo.scale : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #EDE9E1',
          background: '#F5F3EE',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        <FileWordOutlined style={{ color: '#2b579a' }} />
        <Text style={{ fontSize: 13, flex: 1 }} ellipsis>
          {label ?? src}
        </Text>
      </div>

      {/* Scroll area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          background: '#EDE9E1',
          padding: '16px',
          display: viewerState === 'loading' ? 'flex' : 'block',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {viewerState === 'loading' && <Spin size="large" />}

        {viewerState === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}>
            <FileWordOutlined style={{ fontSize: 48, marginBottom: 12, color: '#ff4d4f' }} />
            <Text type="danger" style={{ fontSize: 13 }}>
              {errorMsg ?? 'Failed to load document'}
            </Text>
          </div>
        )}

        {/*
          Page shell: sized to the POST-scale dimensions so the scroll container
          allocates the right amount of space. overflow:hidden clips the inner div
          (which is still at natural size before transform shrinks it visually).
        */}
        <div
          style={{
            display: viewerState === 'rendered' ? 'block' : 'none',
            width: scaledW ?? '100%',
            height: scaledH ?? 'auto',
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.18)',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            margin: '0 auto',
          }}
        >
          {/* Rendered at natural doc size; CSS transform scales it down visually */}
          {/* all:revert isolates docx-preview's injected styles from host-page CSS */}
          <div ref={innerRef} style={{ all: 'revert' } as React.CSSProperties} />
        </div>
      </div>
    </div>
  );
};

export default WordViewer;
