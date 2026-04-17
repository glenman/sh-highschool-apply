import React from 'react';

interface RecommendationItem {
  name: string;
  score: number;
  rank: number;
  level: string;
}

type BatchType = '分配到区' | '分配到校' | '统一录取';

type RecommendationData = {
  [key in BatchType]: RecommendationItem[];
};

interface BatchConfig {
  title: string;
  description: string;
  color: string;
}

type BatchConfigMap = {
  [key in BatchType]: BatchConfig;
};

interface RecommendationResultProps {
  data: RecommendationData;
  estimatedScore: number;
}

const RecommendationResult: React.FC<RecommendationResultProps> = ({ data, estimatedScore }) => {
  // 批次配置
  const batchConfig: BatchConfigMap = {
    '分配到区': {
      title: '名额分配到区',
      description: '全区竞争录取，建议填报1所',
      color: 'bg-blue-100 border-blue-500'
    },
    '分配到校': {
      title: '名额分配到校',
      description: '校内竞争录取，建议填报2所',
      color: 'bg-green-100 border-green-500'
    },
    '统一录取': {
      title: '统一招生平行志愿',
      description: '全区竞争录取，建议填报15所',
      color: 'bg-purple-100 border-purple-500'
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(data).map(([batch, schools]) => {
        const batchType = batch as BatchType;
        return (
          <div key={batch} className={`border-l-4 ${batchConfig[batchType].color} p-4 rounded`}>
            <h3 className="text-xl font-bold mb-2">{batchConfig[batchType].title}</h3>
            <p className="text-sm text-gray-600 mb-4">{batchConfig[batchType].description}</p>
            
            <div className="space-y-2">
              {schools.map((school: RecommendationItem, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium">
                        {school.name}
                        {school.level && <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{school.level}</span>}
                      </div>
                      <div className="text-sm text-gray-500">
                        加权均分: {school.score} | 位次: {school.rank}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {school.score > estimatedScore + 20 ? '冲刺' : school.score >= estimatedScore - 5 && school.score <= estimatedScore + 5 ? '稳妥' : school.score < estimatedScore - 35 ? '保底' : '稳妥'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 推荐说明 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6">
        <h3 className="text-lg font-bold mb-2">推荐说明</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
          <li>推荐结果基于2025年学校录取数据和用户输入的中考总分</li>
          <li>冲刺志愿：历年录取位次比用户高5%~10%</li>
          <li>稳妥志愿：历年录取位次与用户持平±3%</li>
          <li>保底志愿：历年录取位次比用户低10%~15%</li>
          <li>请根据实际情况和个人偏好调整志愿顺序</li>
        </ul>
      </div>
    </div>
  );
};

export default RecommendationResult;
