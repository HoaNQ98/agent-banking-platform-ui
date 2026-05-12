/**
 * ThinkingPanel Component
 *
 * Displays the AI's thinking process in a collapsible panel
 * Similar to Google Gemini's "Thoughts" feature
 */

import React, { useState, useEffect, useRef } from 'react';
import { Collapse, Typography } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { ThinkingProcess } from '../../types';

const { Text } = Typography;
const { Panel } = Collapse;

interface ThinkingPanelProps {
  thinking?: ThinkingProcess;
}

/**
 * Format duration in a human-readable way
 */
const formatDuration = (startTime: Date, endTime?: Date): string => {
  const end = endTime || new Date();
  const duration = end.getTime() - startTime.getTime();

  if (duration < 1000) {
    return `${duration}ms`;
  } else if (duration < 60000) {
    return `${(duration / 1000).toFixed(1)}s`;
  } else {
    return `${(duration / 60000).toFixed(1)}m`;
  }
};

export const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ thinking }) => {
  const [activeKey, setActiveKey] = useState<string | string[]>(['1']); // Expanded by default
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-collapse when completed
  useEffect(() => {
    if (thinking?.status === 'completed') {
      setActiveKey([]);
    }
  }, [thinking?.status]);

  // Auto-scroll to bottom when new content arrives and panel is open
  useEffect(() => {
    if (activeKey.includes('1') && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [thinking?.content, activeKey]);

  if (!thinking) {
    return null;
  }

  const isInProgress = thinking.status === 'in_progress';
  const duration = formatDuration(thinking.startTime, thinking.endTime);

  return (
    <div className="my-2 w-full">
      <Collapse
        activeKey={activeKey}
        onChange={setActiveKey}
        bordered={false}
        className="bg-gray-50 rounded-lg"
        expandIconPosition="end"
      >
        <Panel
          key="1"
          header={
            <div className="flex items-center gap-2">
              {isInProgress ? (
                <LoadingOutlined spin className="text-blue-500 text-sm" />
              ) : (
                <CheckCircleOutlined className="text-gray-400 text-sm" />
              )}
              <Text className="text-sm text-gray-700">
                {isInProgress ? 'Thinking...' : `View thinking process (${duration})`}
              </Text>
              {isInProgress && (
                <Text type="secondary" className="text-xs ml-auto">
                  {duration}
                </Text>
              )}
            </div>
          }
          className="border-none"
        >
          {/* Thinking Content */}
          <div
            ref={contentRef}
            className="bg-white rounded border border-gray-200 p-3 max-h-80 overflow-y-auto"
            style={{
              fontFamily: 'Monaco, Menlo, "Courier New", monospace',
              fontSize: '13px',
              lineHeight: '1.6',
            }}
          >
            {thinking.content ? (
              <div className="whitespace-pre-wrap text-gray-800">
                {thinking.content}
                {isInProgress && (
                  <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
                )}
              </div>
            ) : (
              <Text type="secondary" className="text-sm italic">
                Processing...
              </Text>
            )}
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ThinkingPanel;
