// ddddocr-helper.js
// 本地 ddddocr API 封装工具库

const DDDDOCR_CONFIG = {
    apiUrl: '/api/ocr/ocr',
    detectionUrl: '/api/ocr/ocr/detection',
    timeout: 10000,  // 超时时间（毫秒）
    retryTimes: 1     // 重试次数
};

/**
 * 将图片元素转换为 Base64 字符串
 * @param {HTMLImageElement} imgElement - 图片 DOM 元素
 * @param {string} format - 输出格式，默认 'image/png'
 * @returns {string} Base64 格式的图片数据（带 data:image/xxx;base64, 前缀）
 */
function imgElementToBase64(imgElement, format = 'image/png') {
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.naturalWidth || imgElement.width;
    canvas.height = imgElement.naturalHeight || imgElement.height;
    
    // 如果图片还没加载完成，等待一下
    if (!imgElement.complete || imgElement.naturalWidth === 0) {
        console.warn('[ddddocr] 图片可能未完全加载，尝试使用当前显示尺寸');
        canvas.width = imgElement.clientWidth || imgElement.width;
        canvas.height = imgElement.clientHeight || imgElement.height;
    }
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(format);
}

/**
 * 将图片 URL 转换为 Base64 字符串
 * @param {string} url - 图片的 URL 地址
 * @param {boolean} withPrefix - 是否保留 data:image/xxx;base64, 前缀，默认 true
 * @returns {Promise<string>} Base64 格式的图片数据
 */
async function imageUrlToBase64(url, withPrefix = true) {
    const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit'
    });
    
    if (!response.ok) {
        throw new Error(`图片下载失败: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            if (withPrefix) {
                resolve(base64);
            } else {
                // 去掉前缀，只保留纯 base64 数据
                const pureBase64 = base64.split(',')[1];
                resolve(pureBase64);
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * 将 Blob/File 对象转换为 Base64
 * @param {Blob|File} blob - Blob 或 File 对象
 * @param {boolean} withPrefix - 是否保留前缀
 * @returns {Promise<string>}
 */
function blobToBase64(blob, withPrefix = true) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            resolve(withPrefix ? base64 : base64.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * 调用本地 ddddocr API 识别验证码
 * @param {string} imageBase64 - Base64 格式的图片（可以带 data:image/xxx;base64, 前缀）
 * @param {Object} options - 可选配置
 * @param {string} options.apiUrl - 自定义 API 地址
 * @param {number} options.timeout - 超时时间
 * @returns {Promise<Object>} 返回 { success, result, error }
 */
async function recognizeCaptchaByBase64(imageBase64, options = {}) {
    const apiUrl = options.apiUrl || DDDDOCR_CONFIG.apiUrl;
    const timeout = options.timeout || DDDDOCR_CONFIG.timeout;
    
    // 构建请求体（确保 base64 数据包含前缀，API 端会处理）
    const requestBody = {
        image: imageBase64
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0) {
            return {
                success: true,
                result: data.result,
                message: data.message || '识别成功'
            };
        } else {
            return {
                success: false,
                error: data.error || data.message || '识别失败',
                result: null
            };
        }
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            return {
                success: false,
                error: `请求超时（${timeout}ms）`,
                result: null
            };
        }
        return {
            success: false,
            error: error.message,
            result: null
        };
    }
}

/**
 * 通过图片 URL 直接识别验证码（自动下载并转换）
 * @param {string} imageUrl - 图片 URL
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} 返回 { success, result, error }
 */
async function recognizeCaptchaByUrl(imageUrl, options = {}) {
    try {
        const base64 = await imageUrlToBase64(imageUrl, true);
        return await recognizeCaptchaByBase64(base64, options);
    } catch (error) {
        return {
            success: false,
            error: `图片处理失败: ${error.message}`,
            result: null
        };
    }
}

/**
 * 通过图片 DOM 元素识别验证码（最常用）
 * @param {HTMLImageElement} imgElement - 验证码图片元素
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} 返回 { success, result, error }
 */
async function recognizeCaptchaByElement(imgElement, options = {}) {
    try {
        const base64 = imgElementToBase64(imgElement, 'image/png');
        return await recognizeCaptchaByBase64(base64, options);
    } catch (error) {
        return {
            success: false,
            error: `图片转换失败: ${error.message}`,
            result: null
        };
    }
}

/**
 * 目标检测（点选验证码）
 * @param {string} imageBase64 - Base64 格式的图片
 * @returns {Promise<Object>} 返回 { success, boxes, error }
 */
async function detectObjectsByBase64(imageBase64) {
    try {
        const response = await fetch(DDDDOCR_CONFIG.detectionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: imageBase64 })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code === 0) {
            return {
                success: true,
                boxes: data.result,  // [[x1,y1,x2,y2], ...]
                message: data.message
            };
        } else {
            return {
                success: false,
                error: data.error || '检测失败',
                boxes: null
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            boxes: null
        };
    }
}

// 导出（如果使用 ES6 模块）
// export {
//     imgElementToBase64,
//     imageUrlToBase64,
//     blobToBase64,
//     recognizeCaptchaByBase64,
//     recognizeCaptchaByUrl,
//     recognizeCaptchaByElement,
//     detectObjectsByBase64
// };

// 挂载到全局对象（油猴脚本可直接使用）
if (typeof window !== 'undefined') {
    window.ddddocr = {
        imgElementToBase64,
        imageUrlToBase64,
        blobToBase64,
        recognizeCaptchaByBase64,
        recognizeCaptchaByUrl,
        recognizeCaptchaByElement,
        detectObjectsByBase64,
        config: DDDDOCR_CONFIG
    };
    console.log('[ddddocr-helper] 已加载，可通过 window.ddddocr 调用');
}