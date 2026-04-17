import React from 'react';

interface School {
  学校名称: string;
  所属区: string;
  学校层次: string;
  '25年三批次加权均分'?: number;
}

interface UserInfo {
  district: string;
  schoolType: string;
  一模Score: number;
  一模Rank: string;
  初中School: string;
  preference: string;
}

interface DataAnalysisProps {
  schools: School[];
  userInfo: UserInfo;
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ schools, userInfo }) => {
  // 分析学校层次分布
  const levelDistribution = schools.reduce((acc, school) => {
    acc[school.学校层次] = (acc[school.学校层次] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 分析行政区学校分布
  const districtDistribution = schools.reduce((acc, school) => {
    acc[school.所属区] = (acc[school.所属区] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 计算平均分
  const averageScores = schools.reduce((acc, school) => {
    if (school['25年三批次加权均分']) {
      acc.sum += school['25年三批次加权均分']!;
      acc.count++;
    }
    return acc;
  }, { sum: 0, count: 0 });
  const averageScore = averageScores.count > 0 ? averageScores.sum / averageScores.count : 0;

  return (
    <div className="space-y-6">
      {/* 学校层次分布 */}
      <div>
        <h3 className="text-lg font-bold mb-3">学校层次分布</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(levelDistribution).map(([level, count]) => (
            <div key={level} className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500">{level}</div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 行政区学校分布 */}
      <div>
        <h3 className="text-lg font-bold mb-3">行政区学校分布</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  行政区
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学校数量
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(districtDistribution)
                .sort((a, b) => b[1] - a[1])
                .map(([district, count]) => (
                  <tr key={district}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 平均分统计 */}
      <div>
        <h3 className="text-lg font-bold mb-3">平均分统计</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">2025年三批次加权平均分</div>
          <div className="text-3xl font-bold">{averageScore.toFixed(2)}</div>
        </div>
      </div>

      {/* 用户信息分析 */}
      {userInfo.district && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-3">用户信息分析</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">所在行政区:</span>
              <span className="font-medium">{userInfo.district}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">初中性质:</span>
              <span className="font-medium">{userInfo.schoolType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">一模总分:</span>
              <span className="font-medium">{userInfo.一模Score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">一模区排名:</span>
              <span className="font-medium">{userInfo.一模Rank || '未提供'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysis;
