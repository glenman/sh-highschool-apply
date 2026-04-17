import pandas as pd
import json
import os

# 定义文件路径
excel_file = r"d:\Workspace\high-school-apply\dataref\2025上海高中学校排名名单.xlsx"
json_file = r"d:\Workspace\high-school-apply\public\data\shanghai_high_schools.json"

# 确保输出目录存在
os.makedirs(os.path.dirname(json_file), exist_ok=True)

# 读取Excel文件的所有工作表
xl = pd.ExcelFile(excel_file)
print(f"Excel文件包含以下工作表: {xl.sheet_names}")

# 遍历所有工作表，找到包含最多数据的工作表
max_rows = 0
best_sheet = None
for sheet_name in xl.sheet_names:
    df = pd.read_excel(excel_file, sheet_name=sheet_name)
    if len(df) > max_rows:
        max_rows = len(df)
        best_sheet = sheet_name

print(f"选择工作表: {best_sheet} (包含 {max_rows} 条记录)")

# 读取最佳工作表
df = pd.read_excel(excel_file, sheet_name=best_sheet)

# 清理数据，移除空行
df = df.dropna(how='all')

# 将DataFrame转换为字典列表
data = df.to_dict('records')

# 保存为JSON文件
with open(json_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Excel文件已成功转换为JSON文件: {json_file}")
print(f"转换了 {len(data)} 条记录")
