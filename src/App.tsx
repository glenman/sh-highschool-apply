import { useState, useEffect } from 'react';
import './App.css';

// 导入组件
import UserInfoForm from './components/UserInfoForm';
import RecommendationResult from './components/RecommendationResult';

// 导入工具函数
import { loadSchoolData } from './utils/dataLoader';

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

interface UserInfo {
  district: string;
  schoolType: string;
  预估中考总分: string;
  preference: string;
}

interface RecommendationItem {
  name: string;
  score: number;
  rank: number;
  level: string;
}

interface Recommendation {
  分配到区: RecommendationItem[];
  分配到校: RecommendationItem[];
  统一录取: RecommendationItem[];
}

function App() {
  // 状态管理
  const [schoolData, setSchoolData] = useState<School[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    district: '',
    schoolType: '',
    预估中考总分: '',
    preference: ''
  });
  const [recommendation, setRecommendation] = useState<Recommendation>({
    分配到区: [],
    分配到校: [],
    统一录取: []
  });
  const [loading, setLoading] = useState(true);

  // 加载学校数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadSchoolData();
        setSchoolData(data);
        setLoading(false);
      } catch (error) {
        console.error('加载学校数据失败:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 处理用户信息提交
  const handleUserInfoSubmit = (info: any) => {
    setUserInfo(info);
    
    // 基于真实数据生成推荐结果
    const generateRecommendations = () => {
      console.log('用户信息:', info);
      console.log('学校数据数量:', schoolData.length);
      
      // 1. 获取预估中考总分作为L分
      const L = parseInt(info.预估中考总分) || 0;
      console.log('定位校分数L:', L);
      
      // 2. 过滤出用户所在区的学校和全市招生的学校
      const eligibleSchools = schoolData.filter(school => 
        school.所属区 === info.district || school.所属区 === '全市'
      );
      
      console.log('符合条件的学校数量:', eligibleSchools.length);
      
      // 2. 按25年三批次加权均分排序
      const sortedSchools = eligibleSchools
        .filter(school => school['25年三批次加权均分'] !== null && school['25年三批次加权均分'] !== undefined)
        .sort((a, b) => (b['25年三批次加权均分'] || 0) - (a['25年三批次加权均分'] || 0));
      
      console.log('排序后的学校数量:', sortedSchools.length);
      
      // 4. 生成统一录取推荐（15个平行志愿）
      const generateUnifiedAdmission = () => {
        // 筛选出有统一招生计划的学校
        const unifiedSchools = sortedSchools.filter(school => (school['25年统一'] || 0) > 0);
        
        console.log('有统一招生计划的学校数量:', unifiedSchools.length);
        console.log('志愿偏好:', info.preference);
        console.log('定位校分数L:', L);
        
        // 按照7+1+7结构生成平行志愿
        const parallelVolunteers: School[] = [];
        
        // 根据志愿偏好调整冲刺、稳妥、保底的比例
        let sprintCount = 7;
        let safetyCount = 7;
        
        if (info.preference === '冲刺') {
          sprintCount = 10; // 增加冲刺学校数量
          safetyCount = 4;  // 减少保底学校数量
        } else if (info.preference === '保底') {
          sprintCount = 4;  // 减少冲刺学校数量
          safetyCount = 10; // 增加保底学校数量
        }
        
        // 前N位（冲刺）：L+5 ~ L+20
        const sprintSchools = unifiedSchools.filter(school => {
          const score = school['25年三批次加权均分'] || 0;
          return score >= L + 5 && score <= L + 20;
        }).slice(0, sprintCount);
        
        console.log('冲刺学校数量:', sprintSchools.length);
        
        // 定位位（第N+1位）：找到最接近L分的学校
        let targetSchool = null;
        if (unifiedSchools.length > 0) {
          targetSchool = unifiedSchools.reduce((prev, curr) => {
            const prevDiff = Math.abs((prev['25年三批次加权均分'] || 0) - L);
            const currDiff = Math.abs((curr['25年三批次加权均分'] || 0) - L);
            return currDiff < prevDiff ? curr : prev;
          });
        }
        
        console.log('定位校:', targetSchool ? targetSchool.学校名称 : '无');
        
        // 后M位（保底）：L-5 ~ L-35
        const safetySchools = unifiedSchools.filter(school => {
          const score = school['25年三批次加权均分'] || 0;
          return score <= L - 5 && score >= L - 35;
        }).slice(0, safetyCount);
        
        console.log('保底学校数量:', safetySchools.length);
        
        // 组合成15个平行志愿
        parallelVolunteers.push(...sprintSchools);
        if (targetSchool) parallelVolunteers.push(targetSchool);
        parallelVolunteers.push(...safetySchools);
        
        // 确保有15个志愿，如果不够就从统一招生学校中补充
        if (parallelVolunteers.length < 15) {
          // 根据志愿偏好调整补充顺序
          let additionalSchools = [];
          
          if (info.preference === '冲刺') {
            // 优先补充冲刺学校
            additionalSchools = unifiedSchools.filter(school => 
              !parallelVolunteers.includes(school)
            ).sort((a, b) => (b['25年三批次加权均分'] || 0) - (a['25年三批次加权均分'] || 0));
          } else if (info.preference === '保底') {
            // 优先补充保底学校
            additionalSchools = unifiedSchools.filter(school => 
              !parallelVolunteers.includes(school)
            ).sort((a, b) => (a['25年三批次加权均分'] || 0) - (b['25年三批次加权均分'] || 0));
          } else {
            // 优先补充稳妥学校
            const mediumSchools = unifiedSchools.filter(school => {
              const score = school['25年三批次加权均分'] || 0;
              return score >= L - 5 && score <= L + 5 && !parallelVolunteers.includes(school);
            });
            
            const otherSchools = unifiedSchools.filter(school => 
              !parallelVolunteers.includes(school) && !mediumSchools.includes(school)
            ).sort((a, b) => (b['25年三批次加权均分'] || 0) - (a['25年三批次加权均分'] || 0));
            
            additionalSchools = [...mediumSchools, ...otherSchools];
          }
          
          parallelVolunteers.push(...additionalSchools.slice(0, 15 - parallelVolunteers.length));
        }
        
        // 确保分数从高到低排序
        parallelVolunteers.sort((a, b) => (b['25年三批次加权均分'] || 0) - (a['25年三批次加权均分'] || 0));
        
        console.log('最终平行志愿数量:', parallelVolunteers.length);
        
        return parallelVolunteers.slice(0, 15).map((school, index) => ({
          name: school.学校名称,
          score: school['25年三批次加权均分'] || 0,
          rank: index + 1,
          level: school.学校层次 || ''
        }));
      };
      
      // 5. 生成分配到区推荐（1个志愿）
      const generateDistrictQuota = () => {
        // 筛选出有分配到区计划的学校
        const districtSchools = sortedSchools.filter(school => (school['25年到区'] || 0) > 0);
        
        // 按照规则：不低于L分，A类：L+10~L+20
        const recommendedSchools = districtSchools.filter(school => {
          const score = school['25年三批次加权均分'] || 0;
          return score >= L && score <= L + 20;
        }).slice(0, 3);
        
        return recommendedSchools.map((school, index) => ({
          name: school.学校名称,
          score: school['25年三批次加权均分'] || 0,
          rank: index + 1,
          level: school.学校层次 || ''
        }));
      };
      
      // 6. 生成分配到校推荐（2个志愿）
      const generateSchoolQuota = () => {
        // 筛选出有分配到校计划的学校
        const schoolSchools = sortedSchools.filter(school => (school['25年到校'] || 0) > 0);
        
        console.log('有分配到校计划的学校数量:', schoolSchools.length);
        
        // 按照规则：D ≥ L + 5 → 必须填；L – 5 < D < L + 5 → 建议填；D ≤ L – 5 → 不填
        // 但需要避免推荐分数过高的学校，只推荐分数与L相近的学校
        const recommendedSchools = schoolSchools.filter(school => {
          const score = school['25年三批次加权均分'] || 0;
          // 只推荐分数在L-10到L+20之间的学校，避免推荐分数过高的学校
          return score >= L - 10 && score <= L + 20;
        }).slice(0, 2);
        
        console.log('分配到校推荐学校数量:', recommendedSchools.length);
        
        return recommendedSchools.map((school, index) => ({
          name: school.学校名称,
          score: school['25年三批次加权均分'] || 0,
          rank: index + 1,
          level: school.学校层次 || ''
        }));
      };
      
      const unifiedAdmissionSchools = generateUnifiedAdmission();
      const districtQuotaSchools = generateDistrictQuota();
      const schoolQuotaSchools = generateSchoolQuota();
      
      console.log('分配到区推荐:', districtQuotaSchools);
      console.log('分配到校推荐:', schoolQuotaSchools);
      console.log('统一录取推荐:', unifiedAdmissionSchools);
      
      return {
        分配到区: districtQuotaSchools,
        分配到校: schoolQuotaSchools,
        统一录取: unifiedAdmissionSchools
      };
    };
    
    const recommendations = generateRecommendations();
    setRecommendation(recommendations);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 头部 */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-center">上海中考志愿填报系统</h1>
          <p className="text-center mt-2">基于中考总分的智能志愿推荐</p>
        </div>
      </header>

      {/* 主内容 */}
      <main className="container mx-auto p-4">
        {/* 用户信息表单 */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">用户信息填写</h2>
          <UserInfoForm onSubmit={handleUserInfoSubmit} />
        </section>

        {/* 推荐结果 */}
        {(recommendation.分配到区.length > 0 || recommendation.分配到校.length > 0 || recommendation.统一录取.length > 0) && (
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">志愿推荐结果</h2>
            <RecommendationResult data={recommendation} estimatedScore={parseInt(userInfo.预估中考总分) || 0} />
          </section>
        )}
      </main>

      {/* 底部 */}
      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2026 上海中考志愿填报系统 | 数据来源：上海市教育考试院</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
