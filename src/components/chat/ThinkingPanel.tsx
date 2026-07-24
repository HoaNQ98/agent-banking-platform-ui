/**
 * ThinkingPanel Component
 *
 * Claude-style vertical timeline for multi-agent pipeline execution.
 * Each pipeline step/agent is one stateful row (active → done/failed),
 * connected by a vertical rail. Collapses to a summary when finished.
 */

import React, { useState } from 'react';
import { LoadingOutlined, CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import type { ThinkingProcess } from '../../types';

interface ThinkingPanelProps {
  thinking?: ThinkingProcess;
}

/** Human-readable elapsed time between two instants. */
const formatDuration = (startTime: Date, endTime?: Date): string => {
  const end = endTime || new Date();
  const ms = end.getTime() - startTime.getTime();
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

const COLORS = {
  rail: '#E4DFD5',
  railActive: '#DDBBA6',
  active: '#BC6E4E',
  done: '#8A8578',
  failed: '#C0492F',
  pending: '#B7B0A3',
  text: '#3A3733',
  muted: '#8A8578',
  headerBg: '#F5F3EE',
};

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ thinking }) => {
  const isDone = thinking?.status === 'completed';
  // null = follow default (open while running, auto-collapsed when done);
  // once the user clicks, their explicit choice takes over.
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null);
  const expanded = userExpanded ?? !isDone;

  if (!thinking) return null;

  const steps = thinking.steps;
  const duration = formatDuration(thinking.startTime, thinking.endTime);
  const activeStep = steps.find((s) => s.status === 'active');

  // Header label: live current agent while running, summary once done.
  const headerLabel = isDone
    ? `Worked through ${steps.length} step${steps.length === 1 ? '' : 's'}`
    : activeStep
      ? activeStep.label
      : 'Thinking';

  return (
    <div style={{ margin: '4px 0 12px', width: '100%' }}>
      {/* Header — click to expand/collapse */}
      <button
        onClick={() => setUserExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          padding: '8px 12px',
          background: COLORS.headerBg,
          border: '1px solid #E4DFD5',
          borderRadius: expanded ? '10px 10px 0 0' : '10px',
          cursor: 'pointer',
          textAlign: 'left',
          transition: 'border-radius 0.15s ease',
        }}
      >
        {!isDone ? (
          <LoadingOutlined spin style={{ color: COLORS.active, fontSize: '13px' }} />
        ) : (
          <CheckOutlined style={{ color: COLORS.done, fontSize: '13px' }} />
        )}
        <span
          style={{
            fontSize: '13px',
            fontWeight: 500,
            color: COLORS.text,
            flex: 1,
            ...(!isDone ? { animation: 'thinkingShimmer 1.6s ease-in-out infinite' } : {}),
          }}
        >
          {headerLabel}
          {!isDone && activeStep?.total ? ` · ${activeStep.index}/${activeStep.total}` : ''}
        </span>
        <span style={{ fontSize: '12px', color: COLORS.muted }}>{duration}</span>
        <DownOutlined
          style={{
            fontSize: '10px',
            color: COLORS.muted,
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Timeline body */}
      {expanded && steps.length > 0 && (
        <div
          style={{
            border: '1px solid #E4DFD5',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            background: '#FFFDFA',
            padding: '12px 14px 6px',
          }}
        >
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            const nodeColor =
              step.status === 'active'
                ? COLORS.active
                : step.status === 'failed'
                  ? COLORS.failed
                  : COLORS.done;

            return (
              <div key={step.key} style={{ display: 'flex', gap: '10px' }}>
                {/* Rail + node */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: step.status === 'active' ? 'transparent' : nodeColor,
                      border: step.status === 'active' ? `2px solid ${COLORS.active}` : 'none',
                      marginTop: '2px',
                    }}
                  >
                    {step.status === 'active' && (
                      <LoadingOutlined spin style={{ color: COLORS.active, fontSize: '10px' }} />
                    )}
                    {step.status === 'done' && (
                      <CheckOutlined style={{ color: '#fff', fontSize: '9px' }} />
                    )}
                    {step.status === 'failed' && (
                      <CloseOutlined style={{ color: '#fff', fontSize: '9px' }} />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: '2px',
                        flex: 1,
                        minHeight: '14px',
                        background: step.status === 'done' ? COLORS.railActive : COLORS.rail,
                      }}
                    />
                  )}
                </div>

                {/* Label + summary */}
                <div style={{ flex: 1, paddingBottom: isLast ? '4px' : '12px', minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: step.status === 'active' ? 600 : 500,
                      color: step.status === 'active' ? COLORS.text : COLORS.done,
                      lineHeight: '1.5',
                    }}
                  >
                    {step.label}
                    {step.status === 'failed' && (
                      <span style={{ color: COLORS.failed, fontWeight: 500 }}> — failed</span>
                    )}
                  </div>
                  {step.summary && (
                    <div
                      style={{
                        fontSize: '12px',
                        color: COLORS.muted,
                        lineHeight: '1.5',
                        marginTop: '2px',
                      }}
                    >
                      {step.summary}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes thinkingShimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
};

export default ThinkingPanel;
