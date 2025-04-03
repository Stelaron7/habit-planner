document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const imageUpload = document.getElementById('imageUpload');
    const dropZone = document.getElementById('dropZone');
    const originalCanvas = document.getElementById('originalCanvas');
    const processedCanvas = document.getElementById('processedCanvas');
    const shirtCanvas = document.getElementById('shirtCanvas');
    const applyEffectBtn = document.getElementById('applyEffect');
    const downloadBtn = document.getElementById('downloadBtn');
    const addToShirtBtn = document.getElementById('addToShirt');
    const styleIntensity = document.getElementById('styleIntensity');
    const colorVibrance = document.getElementById('colorVibrance');
    
    // Canvas contexts
    const originalCtx = originalCanvas.getContext('2d');
    const processedCtx = processedCanvas.getContext('2d');
    const shirtCtx = shirtCanvas.getContext('2d');
    
    let originalImage = null;
    let processedImage = null;
    
    // Initialize shirt canvas
    function initShirtCanvas() {
        const shirtTemplate = document.getElementById('shirtTemplate');
        shirtCanvas.width = shirtTemplate.width * 0.6;
        shirtCanvas.height = shirtTemplate.height * 0.5;
        shirtCtx.fillStyle = 'white';
        shirtCtx.fillRect(0, 0, shirtCanvas.width, shirtCanvas.height);
    }
    
    // Handle file upload
    function handleFile(file) {
        if (!file.type.match('image.*')) {
            alert('Please upload an image file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Set canvas dimensions
                const maxWidth = 500;
                const maxHeight = 500;
                let width = img.width;
                let height = img.height;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                originalCanvas.width = width;
                originalCanvas.height = height;
                processedCanvas.width = width;
                processedCanvas.height = height;
                
                // Draw original image
                originalCtx.drawImage(img, 0, 0, width, height);
                originalImage = img;
                
                // Enable apply effect button
                applyEffectBtn.disabled = false;
                downloadBtn.disabled = true;
                addToShirtBtn.disabled = true;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    // Drag and drop functionality
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    imageUpload.addEventListener('change', function() {
        if (this.files.length) {
            handleFile(this.files[0]);
        }
    });
    
    // Apply Ghibli-style effect
    applyEffectBtn.addEventListener('click', function() {
        if (!originalImage) return;
        
        // Copy original to processed canvas
        processedCtx.drawImage(originalImage, 0, 0, processedCanvas.width, processedCanvas.height);
        
        // Get image data
        const imageData = processedCtx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
        const data = imageData.data;
        
        // Get effect parameters
        const intensity = styleIntensity.value / 100;
        const vibrance = colorVibrance.value / 100;
        
        // Apply effects
        for (let i = 0; i < data.length; i += 4) {
            // Convert to Ghibli-style colors
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate brightness
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            
            // Apply Ghibli-style color palette
            if (brightness > 0.7) {
                // Light areas - pastel tones
                data[i] = r * (1 - intensity * 0.3) + 255 * intensity * 0.3;
                data[i + 1] = g * (1 - intensity * 0.3) + 255 * intensity * 0.3;
                data[i + 2] = b * (1 - intensity * 0.3) + 230 * intensity * 0.3;
            } else if (brightness > 0.3) {
                // Mid tones - slightly saturated
                data[i] = r * (1 - intensity * 0.1) + r * vibrance * 0.2;
                data[i + 1] = g * (1 - intensity * 0.1) + g * vibrance * 0.2;
                data[i + 2] = b * (1 - intensity * 0.1);
            } else {
                // Dark areas - more saturated
                data[i] = r * (1 - intensity * 0.2) + 50 * intensity * 0.2;
                data[i + 1] = g * (1 - intensity * 0.2) + 70 * intensity * 0.2;
                data[i + 2] = b * (1 - intensity * 0.2) + 100 * intensity * 0.2;
            }
            
            // Add slight glow effect to edges (simplified)
            if (i > 0 && Math.abs(brightness - ((data[i-4] * 0.299 + data[i-3] * 0.587 + data[i-2] * 0.114) / 255)) > 0.2) {
                data[i] = Math.min(255, data[i] * (1 + intensity * 0.3));
                data[i + 1] = Math.min(255, data[i + 1] * (1 + intensity * 0.3));
                data[i + 2] = Math.min(255, data[i + 2] * (1 + intensity * 0.3));
            }
        }
        
        // Apply the modified image data
        processedCtx.putImageData(imageData, 0, 0);
        
        // Add painterly effect (simplified)
        processedCtx.globalCompositeOperation = 'overlay';
        processedCtx.fillStyle = `rgba(255, 230, 200, ${intensity * 0.1})`;
        processedCtx.fillRect(0, 0, processedCanvas.width, processedCanvas.height);
        processedCtx.globalCompositeOperation = 'source-over';
        
        // Add slight texture
        addTexture(processedCtx, processedCanvas.width, processedCanvas.height, intensity);
        
        // Enable download and shirt buttons
        downloadBtn.disabled = false;
        addToShirtBtn.disabled = false;
        processedImage = processedCanvas.toDataURL('image/png');
    });
    
    // Add texture to image
    function addTexture(ctx, width, height, intensity) {
        ctx.save();
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = width;
        textureCanvas.height = height;
        const textureCtx = textureCanvas.getContext('2d');
        
        // Create a subtle noise texture
        const imageData = textureCtx.createImageData(width, height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 20 * intensity;
            data[i] = noise;
            data[i + 1] = noise;
            data[i + 2] = noise;
            data[i + 3] = 255;
        }
        
        textureCtx.putImageData(imageData, 0, 0);
        
        // Apply the texture
        ctx.globalAlpha = 0.1 * intensity;
        ctx.drawImage(textureCanvas, 0, 0);
        ctx.restore();
    }
    
    // Download processed image
    downloadBtn.addEventListener('click', function() {
        if (!processedImage) return;
        
        const link = document.createElement('a');
        link.download = 'ghibli-style-art.png';
        link.href = processedImage;
        link.click();
    });
    
    // Add to shirt preview
    addToShirtBtn.addEventListener('click', function() {
        if (!processedImage) return;
        
        const img = new Image();
        img.onload = function() {
            // Clear shirt canvas
            shirtCtx.fillStyle = 'white';
            shirtCtx.fillRect(0, 0, shirtCanvas.width, shirtCanvas.height);
            
            // Draw processed image on shirt
            const scale = Math.min(
                shirtCanvas.width / img.width,
                shirtCanvas.height / img.height
            );
            const width = img.width * scale * 0.9;
            const height = img.height * scale * 0.9;
            const x = (shirtCanvas.width - width) / 2;
            const y = (shirtCanvas.height - height) / 2;
            
            shirtCtx.drawImage(img, x, y, width, height);
        };
        img.src = processedImage;
    });
    
    // Initialize
    initShirtCanvas();
});
