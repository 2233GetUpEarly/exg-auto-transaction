from flask import Flask, request, jsonify       # flask 3.1.3
from flask_cors import CORS                     # flask-cors 6.0.2
import ddddocr                                  # ddddocr 1.6.1
import base64                                   
import re
from urllib.parse import urlparse               # urllib3 2.6.3
import requests                                 # requests 2.32.5

app = Flask(__name__)
CORS(app)  # 允许跨域，让 JavaScript 能调用

# 初始化识别器（启动时加载一次，避免重复加载）
ocr = ddddocr.DdddOcr(show_ad=False)


@app.route('/health', methods=['GET'])
def health():
	"""健康检查接口"""
	return jsonify({'status': 'ok', 'message': 'API服务运行正常'})


@app.route('/ocr', methods=['POST'])
def recognize():
	"""
    识别验证码主接口
    支持三种输入方式：
    1. Base64 格式的图片数据
    2. 图片 URL
    3. 直接上传图片文件
    """
	try:
		data = request.get_json() if request.is_json else {}
		img_bytes = None
		
		# 方式1：Base64 格式
		if 'image' in data and data['image']:
			img_data = data['image']
			# 去掉 data:image/png;base64, 这样的前缀
			if ',' in img_data:
				img_data = img_data.split(',')[1]
			img_bytes = base64.b64decode(img_data)
			print("[INFO] 从 Base64 解析图片")
		
		# 方式2：图片 URL
		elif 'url' in data and data['url']:
			url = data['url']
			print(f"[INFO] 从 URL 下载图片: {url}")
			response = requests.get(url, timeout=10)
			response.raise_for_status()
			img_bytes = response.content
			print("[INFO] 图片下载成功")
		
		# 方式3：上传文件
		elif 'file' in request.files:
			file = request.files['file']
			img_bytes = file.read()
			print(f"[INFO] 从上传文件读取图片: {file.filename}")
		
		else:
			return jsonify({
				'code': 400,
				'error': '缺少图片数据，请在请求中提供 image(base64)、url 或上传 file'
			}), 400
		
		# 执行识别
		if img_bytes:
			result = ocr.classification(img_bytes)
			print(f"[INFO] 识别结果: {result}")
			return jsonify({
				'code': 0,
				'result': result,
				'message': '识别成功'
			})
		else:
			return jsonify({
				'code': 400,
				'error': '图片数据为空'
			}), 400
	
	except requests.RequestException as e:
		print(f"[ERROR] 下载图片失败: {e}")
		return jsonify({'code': 500, 'error': f'下载图片失败: {str(e)}'}), 500
	except Exception as e:
		print(f"[ERROR] 识别失败: {e}")
		return jsonify({'code': 500, 'error': f'识别失败: {str(e)}'}), 500


@app.route('/ocr/detection', methods=['POST'])
def detection():
	"""目标检测接口（用于点选验证码）"""
	try:
		data = request.get_json() if request.is_json else {}
		
		if 'image' not in data:
			return jsonify({'code': 400, 'error': '缺少 image 参数'}), 400
		
		img_data = data['image']
		if ',' in img_data:
			img_data = img_data.split(',')[1]
		img_bytes = base64.b64decode(img_data)
		
		# 使用 detection 方法获取坐标
		result = ocr.detection(img_bytes)
		print(f"[INFO] 检测结果: {result}")
		
		return jsonify({
			'code': 0,
			'result': result,  # 返回 [[x1,y1,x2,y2], ...] 格式的坐标
			'message': '检测成功'
		})
	except Exception as e:
		return jsonify({'code': 500, 'error': f'检测失败: {str(e)}'}), 500


if __name__ == '__main__':
	print("=" * 50)
	print("ddddocr API 服务启动")
	print("=" * 50)
	print(f"识别接口: http://127.0.0.1:5678/ocr")
	print(f"检测接口: http://127.0.0.1:5678/ocr/detection")
	print(f"健康检查: http://127.0.0.1:5678/health")
	print("=" * 50)
	app.run(host='0.0.0.0', port=5678, debug=True)