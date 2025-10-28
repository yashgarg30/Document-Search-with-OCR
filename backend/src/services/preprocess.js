const sharp = require('sharp');

/**
 * Preprocessing service for images before OCR
 * Improves OCR accuracy through various image enhancement techniques
 */

async function preprocessImage(buffer, options = {}) {
  let image = sharp(buffer);

  // Get image metadata
  const metadata = await image.metadata();

  // 1. Resize if too large (improves processing speed)
  if (options.resize) {
    const { width, height } = options.resize;
    image = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  } else if (metadata.width > 3000 || metadata.height > 3000) {
    // Auto-resize very large images
    image = image.resize(3000, 3000, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // 2. Convert to grayscale (improves OCR accuracy)
  if (options.grayscale !== false) {
    image = image.grayscale();
  }

  // 3. Increase contrast
  if (options.contrast !== false) {
    image = image.normalise();
  }

  // 4. Sharpen image
  if (options.sharpen) {
    image = image.sharpen();
  }

  // 5. Binarization (convert to black and white)
  if (options.binarize) {
    const threshold = options.threshold || 128;
    image = image.threshold(threshold);
  }

  // 6. Remove noise with median filter
  if (options.denoise) {
    image = image.median(3);
  }

  // 7. Rotate if needed
  if (options.rotate) {
    image = image.rotate(options.rotate, {
      background: { r: 255, g: 255, b: 255 }
    });
  }

  // 8. Auto-rotate based on EXIF orientation
  if (options.autoRotate !== false) {
    image = image.rotate();
  }

  // 9. Increase DPI for better OCR
  image = image.withMetadata({
    density: options.dpi || 300
  });

  // Return processed buffer
  return await image.png().toBuffer();
}

/**
 * Auto-detect and correct image orientation
 */
async function autoCorrectOrientation(buffer) {
  const image = sharp(buffer);
  return await image.rotate().png().toBuffer();
}

/**
 * Deskew image (remove rotation/tilt)
 * Note: Sharp doesn't have built-in deskew, this is a placeholder
 * For production, consider using OpenCV or similar
 */
async function deskew(buffer) {
  // Placeholder - actual deskew requires more complex algorithms
  // Could use external libraries or services
  console.warn('Deskew not fully implemented - requires OpenCV or similar');
  return buffer;
}

/**
 * Adaptive binarization (better for uneven lighting)
 */
async function adaptiveBinarize(buffer) {
  const image = sharp(buffer);
  // Simple approach: normalize then threshold
  return await image
    .normalise()
    .threshold(128)
    .png()
    .toBuffer();
}

/**
 * Remove borders and margins
 */
async function removeBorders(buffer, margin = 10) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  return await image
    .extract({
      left: margin,
      top: margin,
      width: metadata.width - (margin * 2),
      height: metadata.height - (margin * 2)
    })
    .png()
    .toBuffer();
}

/**
 * Preset configurations for different document types
 */
const presets = {
  document: {
    grayscale: true,
    contrast: true,
    sharpen: true,
    binarize: false,
    denoise: false,
    dpi: 300
  },
  
  scan: {
    grayscale: true,
    contrast: true,
    sharpen: true,
    binarize: true,
    threshold: 140,
    denoise: true,
    dpi: 300
  },
  
  photo: {
    grayscale: false,
    contrast: true,
    sharpen: false,
    binarize: false,
    denoise: true,
    dpi: 300
  },
  
  lowQuality: {
    grayscale: true,
    contrast: true,
    sharpen: true,
    binarize: true,
    threshold: 120,
    denoise: true,
    dpi: 400
  }
};

function getPreset(type) {
  return presets[type] || presets.document;
}

module.exports = {
  preprocessImage,
  autoCorrectOrientation,
  deskew,
  adaptiveBinarize,
  removeBorders,
  getPreset,
  presets
};
