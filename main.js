// 全局变量存储处理过程中的数据
let processedData = null;
let originalImageData = null; // 存原始 ImageData

// 导航栏滚动效果
window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 50) {
        navbar.classList.add(
            "bg-primary/95",
            "backdrop-blur-sm",
            "shadow-md"
        );
        navbar.classList.remove("bg-transparent");
    } else {
        navbar.classList.remove(
            "bg-primary/95",
            "backdrop-blur-sm",
            "shadow-md"
        );
        navbar.classList.add("bg-transparent");
    }
});

// 移动端菜单切换
document
    .getElementById("menu-toggle")
    .addEventListener("click", function () {
        const mobileMenu = document.getElementById("mobile-menu");
        mobileMenu.classList.toggle("hidden");
    });

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        // 关闭移动端菜单（如果打开）
        document.getElementById("mobile-menu").classList.add("hidden");

        const targetId = this.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: "smooth",
            });
        }
    });
});

// 导航栏跳转
document.getElementById('navbar-upload-btn').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('upload').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
document.getElementById('navbar-model-training-btn').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('model-training').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
document.getElementById('navbar-results-btn').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('results').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});
document.getElementById('navbar-report-btn').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('report').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// 开始分析 → 上传数据
document.getElementById('btn-start-analysis').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('upload').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// 查看实例结果 → 结果展示
document.getElementById('btn-end-analysis').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('results').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// CTA跳转
document.getElementById('cta-upload-btn').addEventListener('click', () => {
    // 关闭移动端菜单（如打开）
    document.getElementById('mobile-menu')?.classList.add('hidden');

    // 平滑滚动到上传区域
    document.getElementById('upload').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

// 数据权重滑块交互
const weightSliders = document.querySelectorAll(".data-weight-slider");
weightSliders.forEach((slider) => {
    slider.addEventListener("input", function () {
        const type = this.getAttribute("data-type");
        const value = this.value;
        document.getElementById(
            `${type}-weight-value`
        ).textContent = `${value}%`;

        // 同步到报告分析
        syncWeightsToReport();

        // 计算总权重
        let totalWeight = 0;
        weightSliders.forEach((s) => {
            totalWeight += parseInt(s.value);
        });
        document.getElementById(
            "total-weight"
        ).textContent = `${totalWeight}%`;

        // 超出100%时警告
        const totalWeightEl = document.getElementById("total-weight");
        if (totalWeight > 100) {
            totalWeightEl.classList.add("text-red-500");
        } else {
            totalWeightEl.classList.remove("text-red-500");
        }
    });
});

// 数据权重同步
function syncWeightsToReport() {
    const types = ['geochemical', 'geophysical', 'drilling', 'remote-sensing'];
    types.forEach(type => {
        const value = parseInt(document.getElementById(`${type}-weight-value`).textContent);
        document.getElementById(`report-${type}-weight`).textContent = value + '%';
        document.getElementById(`report-${type}-bar`).style.width = value + '%';
    });
}

document.addEventListener("DOMContentLoaded", () => {
    syncWeightsToReport();
});

// 文件上传拖放效果
const dropArea = document.getElementById("drop-area");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
    dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add("border-primary", "bg-blue-50");
}

function unhighlight() {
    dropArea.classList.remove("border-primary", "bg-blue-50");
}

dropArea.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

document
    .getElementById("file-input")
    .addEventListener("change", function () {
        handleFiles(this.files);
    });

// 存储已上传文件
const uploadedFiles = [];

function handleFiles(files) {
    if (files.length > 0) {
        // 清空空文件列表提示
        document.getElementById("empty-file-list").classList.add("hidden");

        // 添加文件到列表
        const fileList = document.getElementById("file-list");

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 检查文件是否已存在
            const isFileExists = uploadedFiles.some(
                (f) =>
                    f.name === file.name &&
                    f.size === file.size &&
                    f.type === file.type
            );

            if (!isFileExists) {
                // 添加到已上传文件数组
                uploadedFiles.push(file);

                // 创建文件项
                const fileItem = document.createElement("div");
                fileItem.className =
                    "bg-white p-3 rounded-lg shadow-sm flex items-center justify-between border border-gray-100";
                fileItem.setAttribute("data-file-name", file.name);

                // 获取文件类型图标
                let fileIcon = "fa-file";
                if (file.type.includes("image")) fileIcon = "fa-file-image-o";
                else if (file.type.includes("pdf")) fileIcon = "fa-file-pdf-o";
                else if (
                    file.type.includes("excel") ||
                    file.name.endsWith(".csv")
                )
                    fileIcon = "fa-file-excel-o";
                else if (file.type.includes("word")) fileIcon = "fa-file-word-o";

                // 设置文件大小显示
                let fileSize = "";
                if (file.size < 1024) {
                    fileSize = file.size + " B";
                } else if (file.size < 1048576) {
                    fileSize = (file.size / 1024).toFixed(1) + " KB";
                } else {
                    fileSize = (file.size / 1048576).toFixed(1) + " MB";
                }

                // 设置文件类型
                let fileType = file.type || "未知类型";
                if (fileType === "") {
                    const fileExtension = file.name.split(".").pop().toLowerCase();
                    fileType = fileExtension
                        ? `${fileExtension.toUpperCase()} 文件`
                        : "未知类型";
                }

                fileItem.innerHTML = `
                            <div class="flex items-center">
                                <i class="fa ${fileIcon} text-gray-400 mr-3 text-lg"></i>
                                <div>
                                    <div class="font-medium text-gray-800 truncate max-w-[200px]">${file.name}</div>
                                    <div class="text-xs text-gray-500">${fileSize} - ${fileType}</div>
                                </div>
                            </div>
                            <button class="text-gray-400 hover:text-red-500 transition-colors delete-file-btn" data-file-name="${file.name}">
                                <i class="fa fa-times"></i>
                            </button>
                        `;

                fileList.appendChild(fileItem);

                // 添加删除文件事件
                fileItem
                    .querySelector(".delete-file-btn")
                    .addEventListener("click", function () {
                        const fileName = this.getAttribute("data-file-name");
                        removeFile(fileName);
                    });
            }
        }
    }
}

function removeFile(fileName) {
    // 从DOM中移除
    const fileItem = document.querySelector(
        `[data-file-name="${fileName}"]`
    );
    if (fileItem) {
        fileItem.remove();
    }

    // 从数组中移除
    const index = uploadedFiles.findIndex((f) => f.name === fileName);
    if (index !== -1) {
        uploadedFiles.splice(index, 1);
    }

    // 如果没有文件了，显示空文件列表提示
    if (uploadedFiles.length === 0) {
        document.getElementById("empty-file-list").classList.remove("hidden");
    }
}

function processImageFile(file) {
    // 显示文件信息
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    uploadInfo.classList.remove("hidden");

    // 读取并显示图像
    const reader = new FileReader();
    reader.onload = function (e) {
        originalImage.src = e.target.result;
        originalImage.classList.remove("hidden");
        originalImageContainer.querySelector("label").classList.add("hidden");

        // 重置结果区域
        resetResultArea();

        // 图像加载完成后进行预处理
        originalImage.onload = function () {
            originalImage.classList.add("animate-fade-in");
            startPreprocessing(originalImage.src);
        };
    };
    reader.readAsDataURL(file);
}

// 上传按钮点击效果
document
    .getElementById("upload-btn")
    .addEventListener("click", function () {
        if (uploadedFiles.length === 0) {
            alert("请先选择要上传的文件");
            return;
        }

        const file = uploadedFiles[0]; // 取第一个文件
        if (!file.type.startsWith("image/")) {
            alert("请上传图片格式的文件（如 PNG、JPG）");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            document.getElementById("preprocessStatus").textContent =
                "处理中...";
            document.getElementById("preprocessProgress").style.width = "10%";

            try {
                const file = document.getElementById("file-input").files[0];
                const img = new Image();
                img.onload = async () => {
                    processedData = await processImage(img);

                    const tempCanvas = document.createElement("canvas");
                    const tempCtx = tempCanvas.getContext("2d");
                    tempCanvas.width = img.width;
                    tempCanvas.height = img.height;
                    tempCtx.drawImage(img, 0, 0);
                    originalImageData = tempCtx.getImageData(0, 0, img.width, img.height);

                    document.getElementById("preprocessStatus").textContent = "预处理完成";
                    document.getElementById("preprocessProgress").style.width = "100%";
                };
                img.src = URL.createObjectURL(file);
            } catch (err) {
                document.getElementById("preprocessStatus").textContent =
                    "预处理失败";
                console.error(err);
                alert("预处理失败：" + err.message);
            }
        };
        reader.readAsDataURL(file);
    });

// 训练模型按钮点击事件
document
    .getElementById("train-model-btn")
    .addEventListener("click", async () => {
        if (!processedData) {
            alert("请先上传并预处理图片");
            return;
        }

        const progressContainer = document.getElementById("prediction-progress-container");
        const progressBar = document.getElementById("prediction-progress-bar");
        const progressText = document.getElementById("prediction-progress-text");

        try {
            const modelPath = document.getElementById("model-type").value;
            const { predictions, labels } = await runInference(processedData, modelPath);

            const resultData = createVisualization(
                originalImageData,
                { predictions, labels },
                0.9
            );
            document.getElementById("result-image").src = resultData.resultUrl;

            document.querySelector('#results .text-2xl.text-accent').textContent = resultData.highPercent + '%';
            document.querySelector('#results .text-2xl.text-yellow-500').textContent = resultData.mediumPercent + '%';
            document.querySelector('#results .text-2xl.text-green-500').textContent = resultData.lowPercent + '%';
        } catch (err) {
            alert("推理失败：" + err.message);
        }
    });

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// 重置结果区域
function resetResultArea() {
    resultImage.classList.add("hidden");
    noResultImage.classList.remove("hidden");
    predictionInfo.classList.add("hidden");
    predictionLoading.classList.add("hidden");
}

// 处理图片：裁剪和增广
async function processImage(img) {
    const patchSize = 128;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const patches = [];
    patchCoordinates = []; // 重置坐标数组

    // 设置画布大小
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // 生成唯一区域名称
    const areaName = Date.now().toString(36);
    let patchId = 0;

    // 计算可以裁剪多少个128x128的块
    const numCols = Math.floor(img.width / patchSize);
    const numRows = Math.floor(img.height / patchSize);

    // 裁剪图像块
    for (let y = 0; y < numRows; y++) {
        for (let x = 0; x < numCols; x++) {
            if (y + patchSize > img.height || x + patchSize > img.width) {
                continue;
            }

            // 创建裁剪区域
            const patchCanvas = document.createElement('canvas');
            patchCanvas.width = patchSize;
            patchCanvas.height = patchSize;
            const patchCtx = patchCanvas.getContext('2d');

            // 裁剪128x128的块
            patchCtx.drawImage(
                img,
                x * patchSize, y * patchSize,
                patchSize, patchSize,
                0, 0,
                patchSize, patchSize
            );

            // 记录坐标信息
            const originalX = x * patchSize;
            const originalY = y * patchSize;

            // 基础文件名（这里简化处理，假设label为0）
            const baseFilename = `area_${areaName}_patch_${patchId}_x${originalX}_y${originalY}_label_0`;

            // 保存原始块
            const originalPatch = {
                name: `${baseFilename}.png`,
                canvas: patchCanvas,
                x: originalX,
                y: originalY
            };
            patches.push(originalPatch);
            patchCoordinates.push({ x: originalX, y: originalY });

            // 应用增广
            // 旋转90度
            const rot90Canvas = rotateImage(patchCanvas, 90);
            patches.push({
                name: `${baseFilename}_rot90.png`,
                canvas: rot90Canvas,
                x: originalX,
                y: originalY
            });
            patchCoordinates.push({ x: originalX, y: originalY });

            // 旋转270度
            const rot270Canvas = rotateImage(patchCanvas, 270);
            patches.push({
                name: `${baseFilename}_rot270.png`,
                canvas: rot270Canvas,
                x: originalX,
                y: originalY
            });
            patchCoordinates.push({ x: originalX, y: originalY });

            // 水平翻转
            const hflipCanvas = flipImage(patchCanvas, 'horizontal');
            patches.push({
                name: `${baseFilename}_hflip.png`,
                canvas: hflipCanvas,
                x: originalX,
                y: originalY
            });
            patchCoordinates.push({ x: originalX, y: originalY });

            // 垂直翻转
            const vflipCanvas = flipImage(patchCanvas, 'vertical');
            patches.push({
                name: `${baseFilename}_vflip.png`,
                canvas: vflipCanvas,
                x: originalX,
                y: originalY
            });
            patchCoordinates.push({ x: originalX, y: originalY });
            patchId++;
        }
    }
    return patches;
}

// 旋转图像
function rotateImage(canvas, degrees) {
    const newCanvas = document.createElement('canvas');
    const ctx = newCanvas.getContext('2d');

    if (degrees === 90 || degrees === 270) {
        newCanvas.width = canvas.height;
        newCanvas.height = canvas.width;
    } else {
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
    }

    ctx.save();

    if (degrees === 90) {
        ctx.translate(newCanvas.width, 0);
        ctx.rotate(Math.PI / 2);
    } else if (degrees === 270) {
        ctx.translate(0, newCanvas.height);
        ctx.rotate(3 * Math.PI / 2);
    }

    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    return newCanvas;
}

// 翻转图像
function flipImage(canvas, direction) {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const ctx = newCanvas.getContext('2d');

    ctx.save();

    if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    } else if (direction === 'vertical') {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
    }

    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    return newCanvas;
}

// 创建边索引 - 构建相邻patch之间的连接
function createEdgeIndex(numNodes) {
    // 示例：4-邻域（上下左右）（可根据实际改）
    const edges = [[], []];
    const W = Math.floor(Math.sqrt(numNodes / 5)); // 原始横向块数
    const H = Math.floor(numNodes / 5 / W);
    for (let h = 0; h < H; h++) {
        for (let w = 0; w < W; w++) {
            const idx = (h * W + w) * 5;                 // 每个原始块占 5 个节点
            // 右
            if (w < W - 1) { edges[0].push(idx); edges[1].push(idx + 5); }
            // 下
            if (h < H - 1) { edges[0].push(idx); edges[1].push(idx + W * 5); }
            // 对称反向边
            if (w < W - 1) { edges[0].push(idx + 5); edges[1].push(idx); }
            if (h < H - 1) { edges[0].push(idx + W * 5); edges[1].push(idx); }
        }
    }
    return new ort.Tensor('int32', new Int32Array(edges.flat()), [2, edges[0].length]);
}

// 模型推理函数
async function runInference(processedData, modelPath) {
    console.log("--- 开始模型推理 ---");

    try {
        // 检查模型路径是否为空
        if (!modelPath || modelPath.trim() === "") {
            throw new Error("模型路径不能为空，请输入有效的模型文件路径");
        }
        if (!processedData || processedData.length === 0) {
            throw new Error("未裁剪出任何图像块，请上传更大图像或减小 patchSize");
        }

        // 尝试加载ONNX模型前先验证文件是否存在
        try {
            const response = await fetch(modelPath, { method: "HEAD" });
            if (!response.ok) {
                throw new Error(
                    `模型文件不存在或无法访问 (HTTP状态: ${response.status})`
                );
            }
        } catch (fetchError) {
            throw new Error(`模型文件加载失败: ${fetchError.message}`);
        }

        const session = await ort.InferenceSession.create(modelPath, {
            // executionProviders: ["cpu"],
            executionProviders: ['wasm'],
            graphOptimizationLevel: "all",
        });

        // 4. 创建输入张量（类型和名称严格匹配）
        const numNodes = processedData.length;
        const edgeIndex = createEdgeIndex(numNodes);
        // 对所有图像块提取特征并组合成一个输入张量
        const allFeatures = [];
        for (let i = 0; i < processedData.length; i++) {
            const patch = processedData[i];
            const featureTensor = await preprocessImage(patch.canvas);
            allFeatures.push(...featureTensor.data);
        }
        const inputFeatures = new ort.Tensor('float32', allFeatures, [numNodes, 768]);

        // 执行推理
        const feeds = {
            'input_features': inputFeatures,
            'edge_index': edgeIndex
        };

        // console.log("输入名称:", session.inputNames);
        // console.log("输入元数据:", session.inputMetadata);
        // console.log("实际输入:", feeds);
        const results = await session.run(feeds);

        // 处理输出
        const output = results.logits.data;
        const labels = [];
        const predictions = [];

        // 解析预测结果（假设是二分类）
        for (let i = 0; i < numNodes; i++) {
            // const prob = output[i * 2 + 1]; // 概率分支
            // labels.push(prob > 0.5 ? 1 : 0);

            const z0 = output[i * 2];
            const z1 = output[i * 2 + 1];
            const maxZ = Math.max(z0, z1);
            const exp0 = Math.exp(z0 - maxZ);
            const exp1 = Math.exp(z1 - maxZ);
            const p1 = exp1 / (exp0 + exp1); // 正类概率
            predictions.push(p1);
            labels.push(z1 >= 0.5 ? 1 : 0);
        }
        // console.log(
        //     `节点数: ${processedData.numNodes}, 边数: ${processedData.numEdges}`
        // );
        console.log("模型推理完成");
        return { predictions, labels };
    } catch (e) {
        console.error("推理过程出错:", e);
        let errorMsg = e.message;

        // 针对ConstantOfShape算子的特定提示
        if (errorMsg.includes("execution provider")) {
            errorMsg += "\n已使用CPU模式运行，确保浏览器支持基本JavaScript功能";
        }

        throw new Error(errorMsg);
    }
}

// 预处理图像为模型输入格式
async function preprocessImage(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 转换为RGB并归一化
    const float32Data = new Float32Array(canvas.width * canvas.height * 3);
    for (let i = 0; i < data.length; i += 4) {
        const index = (i / 4) * 3;
        float32Data[index] = data[i] / 255.0;     // R
        float32Data[index + 1] = data[i + 1] / 255.0; // G
        float32Data[index + 2] = data[i + 2] / 255.0; // B
    }

    // 创建输入张量 (1, 3, 128, 128)
    const tensor = new ort.Tensor('float32', float32Data, [1, 3, 128, 128]);

    // 注意：这里应该有DINOv2特征提取步骤
    // 由于浏览器中无法直接运行DINOv2，这里使用随机特征作为替代
    // 实际应用中需要通过API获取特征或使用简化版特征提取
    const dummyFeatures = new Float32Array(768);
    for (let i = 0; i < 768; i++) {
        dummyFeatures[i] = Math.random() * 2 - 1; // 生成[-1, 1)之间的随机数
    }

    return new ort.Tensor('float32', dummyFeatures, [1, 768]);
}

function createVisualization(originalImage, { predictions, labels }, confidenceThreshold = 0.6) {
    console.log("--- 开始结果可视化 ---");

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // 先把原图画上去（RGB）
    ctx.putImageData(originalImage, 0, 0);

    // 创建半透明红色覆盖层
    const overlay = document.createElement("canvas");
    overlay.width = canvas.width;
    overlay.height = canvas.height;
    const overlayCtx = overlay.getContext("2d");
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

    const patchSize = 128;
    const cols = Math.floor(canvas.width / patchSize);
    const rows = Math.floor(canvas.height / patchSize);

    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let totalPatches = rows * cols; // 计算总区域数

    // 只画 prediction==1 且 confidence>=threshold 的块
    for (let i = 0; i < labels.length; i++) {
        if (labels[i] == 1 && predictions[i] >= confidenceThreshold) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * patchSize;
            const y = row * patchSize;

            overlayCtx.fillStyle = "rgba(255,0,0,0.5)"; // 半透明红
            overlayCtx.fillRect(x, y, patchSize, patchSize);
            highCount++;
        }
        if (labels[i] == 1 && predictions[i] >= confidenceThreshold - 0.1 && predictions[i] < confidenceThreshold) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * patchSize;
            const y = row * patchSize;

            overlayCtx.fillStyle = "rgba(255, 255, 0, 0.5)"; // 半透明黄
            overlayCtx.fillRect(x, y, patchSize, patchSize);
            mediumCount++;
        }
        if (labels[i] == 1 && predictions[i] >= confidenceThreshold - 0.2 && predictions[i] < confidenceThreshold - 0.1) {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const x = col * patchSize;
            const y = row * patchSize;

            overlayCtx.fillStyle = "rgba(0, 255, 0, 0.5)"; // 半透明绿
            overlayCtx.fillRect(x, y, patchSize, patchSize);
            lowCount++;
        }
    }

    // 把覆盖层画到主画布
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(overlay, 0, 0);

    // 计算百分比
    const highPercent = ((highCount / totalPatches) * 100).toFixed(1);
    const mediumPercent = ((mediumCount / totalPatches) * 100).toFixed(1);
    const lowPercent = ((lowCount / totalPatches) * 100).toFixed(1);

    // 返回结果URL和区域数量信息
    return {
        resultUrl: canvas.toDataURL("image/png"),
        highPercent,
        mediumPercent,
        lowPercent
    };
}