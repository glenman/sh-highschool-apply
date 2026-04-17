// 加载学校数据
export const loadSchoolData = async (): Promise<any[]> => {
  try {
    // 从public/data目录加载JSON文件
    const response = await fetch('/data/shanghai_high_schools.json');
    if (!response.ok) {
      throw new Error('Failed to load school data');
    }
    
    // 读取响应文本
    const text = await response.text();
    
    // 处理NaN值，将其替换为null
    const processedText = text.replace(/NaN/g, 'null');
    
    // 解析处理后的JSON
    const data = JSON.parse(processedText);
    return data;
  } catch (error) {
    console.error('Error loading school data:', error);
    // 返回空数组作为 fallback
    return [];
  }
};

// 加载政策规则数据
export const loadPolicyRules = async (): Promise<any> => {
  try {
    // 这里可以加载政策规则数据
    // 暂时返回模拟数据
    return {
      批次顺序: ['分配到区', '分配到校', '统一录取'],
      志愿数量: {
        '分配到区': 1,
        '分配到校': 2,
        '统一录取': 15
      },
      资格规则: {
        '分配到校': '公办初中且在籍满3年',
        '分配到区': '所有初中',
        '统一录取': '所有初中'
      }
    };
  } catch (error) {
    console.error('Error loading policy rules:', error);
    return {
      批次顺序: [],
      志愿数量: {},
      资格规则: {}
    };
  }
};

// 加载一模换算数据
export const loadMockData = async (): Promise<any> => {
  try {
    // 这里可以加载一模换算数据
    // 暂时返回模拟数据
    return {
      换算表: {
        '黄浦区': {
          '600': '前5%',
          '580': '前10%',
          '550': '前20%',
          '520': '前30%',
          '490': '前40%',
          '460': '前50%'
        },
        '徐汇区': {
          '610': '前5%',
          '590': '前10%',
          '560': '前20%',
          '530': '前30%',
          '500': '前40%',
          '470': '前50%'
        },
        '长宁区': {
          '605': '前5%',
          '585': '前10%',
          '555': '前20%',
          '525': '前30%',
          '495': '前40%',
          '465': '前50%'
        }
        // 其他区的换算数据可以继续添加
      }
    };
  } catch (error) {
    console.error('Error loading mock data:', error);
    return {
      换算表: {}
    };
  }
};
