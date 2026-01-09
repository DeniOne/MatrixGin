import { useGetOrgChartQuery } from '../api/ofsApi';
import { Building2, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TreeNodeProps {
  node: any;
  level: number;
}

function TreeNode({ node, level }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="ml-4">
      <div className="flex items-start gap-2 py-2 group">
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}

        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-gray-900">{node.name}</h4>
                {node.description && (
                  <p className="text-sm text-gray-600">{node.description}</p>
                )}
              </div>
            </div>

            {node.employee_count > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{node.employee_count}</span>
              </div>
            )}
          </div>

          {node.functions && node.functions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {node.functions.map((func: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                >
                  {func}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-6 border-l-2 border-gray-200">
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChart() {
  const { data, isLoading } = useGetOrgChartQuery({ depth: 10 });

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Загрузка...</div>;
  }

  if (!data?.data) {
    return <div className="text-center py-8 text-gray-500">Нет данных</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Организационная структура
      </h2>
      {Array.isArray(data.data) ? (
        data.data.map((root: any) => (
          <TreeNode key={root.id} node={root} level={0} />
        ))
      ) : (
        <TreeNode node={data.data} level={0} />
      )}
    </div>
  );
}
