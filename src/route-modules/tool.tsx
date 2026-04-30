import { useParams } from 'react-router';
import { renderTool } from '@/lib/render-tool';

export default function ToolRoute() {
  const { toolId } = useParams();
  return <>{renderTool(toolId ?? '')}</>;
}
