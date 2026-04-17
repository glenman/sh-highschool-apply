import React, { useState } from 'react';

interface UserInfoFormProps {
  onSubmit: (info: any) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    district: '',
    schoolType: '',
    预估中考总分: '',
    preference: ''
  });

  // 上海16个区
  const districts = [
    '黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区',
    '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区',
    '奉贤区', '崇明区'
  ];

  // 初中性质
  const schoolTypes = ['公办', '民办'];

  // 处理表单输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 对预估中考总分进行数字检查，要求在0-750分之间
    if (name === '预估中考总分') {
      // 只允许输入数字
      const numericValue = value.replace(/[^0-9]/g, '');
      // 确保分数在0-750之间
      if (numericValue) {
        const score = parseInt(numericValue);
        if (score > 750) {
          setFormData(prev => ({
            ...prev,
            [name]: '750'
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            [name]: numericValue
          }));
        }
      } else {
        // 允许清空输入
        setFormData(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 所在行政区 */}
        <div>
          <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
            所在行政区 *
          </label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">请选择</option>
            {districts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* 初中性质 */}
        <div>
          <label htmlFor="schoolType" className="block text-sm font-medium text-gray-700 mb-1">
            初中性质 *
          </label>
          <select
            id="schoolType"
            name="schoolType"
            value={formData.schoolType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">请选择</option>
            {schoolTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 预估中考总分 */}
        <div>
          <label htmlFor="预估中考总分" className="block text-sm font-medium text-gray-700 mb-1">
            预估中考总分 *
          </label>
          <input
            type="text"
            id="预估中考总分"
            name="预估中考总分"
            value={formData.预估中考总分}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入0-750之间的数字"
            required
          />
        </div>





        {/* 志愿偏好 */}
        <div>
          <label htmlFor="preference" className="block text-sm font-medium text-gray-700 mb-1">
            志愿偏好
          </label>
          <select
            id="preference"
            name="preference"
            value={formData.preference}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">请选择</option>
            <option value="冲刺">冲刺</option>
            <option value="稳妥">稳妥</option>
            <option value="保底">保底</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          生成志愿推荐
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;
