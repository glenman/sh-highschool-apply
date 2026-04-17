import React, { useState } from 'react';

interface School {
  学校名称: string;
  所属区: string;
  学校层次: string;
  '25年到区'?: number;
  '25年到区加权均分'?: number;
  '25年到校'?: number;
  '25年到校加权均分'?: number;
  '25年统一'?: number;
  '25年统一加权均分'?: number;
  '25年三批次加权均分'?: number;
  '25VS24加权均分'?: number;
  '25生源质量位次'?: number;
  '24生源质量位次'?: number | string;
}

interface SchoolListProps {
  schools: School[];
}

const SchoolList: React.FC<SchoolListProps> = ({ schools }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // 获取所有行政区
  const districts = Array.from(new Set(schools.map(school => school.所属区)));
  // 获取所有学校层次
  const levels = Array.from(new Set(schools.map(school => school.学校层次)));

  // 过滤学校
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.学校名称.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter ? school.所属区 === districtFilter : true;
    const matchesLevel = levelFilter ? school.学校层次 === levelFilter : true;
    return matchesSearch && matchesDistrict && matchesLevel;
  });

  return (
    <div>
      {/* 过滤控件 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            搜索学校
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入学校名称"
          />
        </div>
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
            行政区
          </label>
          <select
            id="district"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            {districts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
            学校层次
          </label>
          <select
            id="level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部</option>
            {levels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 学校列表 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                学校名称
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                所属区
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                学校层次
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                25年三批次加权均分
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                25生源质量位次
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSchools.map((school, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {school.学校名称}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school.所属区}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school.学校层次}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school['25年三批次加权均分'] || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {school['25生源质量位次'] || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="mt-4 flex justify-center">
        <div className="inline-flex rounded-md shadow">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            上一页
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50"
          >
            1
          </button>
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchoolList;
