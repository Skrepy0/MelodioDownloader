import sys
import json

def main():
    # 接收参数（从 sys.argv[1:] 开始）
    if len(sys.argv) < 3:
        # 返回错误信息（JSON格式方便解析）
        print(json.dumps({"error": "缺少参数，需要 indexTerm 和 count"}))
        sys.exit(1)
    
    indexTerm = sys.argv[1]
    count = int(sys.argv[2])
    
    # 构造返回结果
    result = []
    for _ in range(count):
        result.append({"name":indexTerm,
                       "coverImage":"coverImage",
                       "downloadLink":"link"})
        
    print(json.dumps(result))

if __name__ == "__main__":
    main()