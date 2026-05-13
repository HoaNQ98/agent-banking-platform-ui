import React from 'react';
import { Skeleton } from 'antd';

const ConversationSkeletonItem: React.FC = () => (
  <div
    style={{
      padding: '12px 16px',
      borderLeft: '3px solid transparent',
    }}
  >
    <Skeleton
      active
      title={{ width: '80%', style: { marginBottom: 8 } }}
      paragraph={{ rows: 1, width: '50%' }}
      style={{ opacity: 0.5 }}
    />
  </div>
);

interface ConversationSkeletonProps {
  count?: number;
}

const ConversationSkeleton: React.FC<ConversationSkeletonProps> = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <ConversationSkeletonItem key={i} />
    ))}
  </>
);

export default ConversationSkeleton;
