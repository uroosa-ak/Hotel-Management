import { Package } from 'lucide-react';

const EmptyState = ({ message = 'No items found', action = null }) => {
  return (
    <div className="text-center py-16">
      <Package className="mx-auto h-12 w-12 text-muted mb-4" />
      <h3 className="text-lg font-medium text-primary mb-2">{message}</h3>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;