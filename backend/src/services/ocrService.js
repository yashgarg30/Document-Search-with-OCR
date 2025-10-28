const Tesseract = require('tesseract.js');
const { preprocessImage, getPreset } = require('./preprocess');

/**
 * OCR Service - Handles text extraction from images
 */

// Available language packs
const SUPPORTED_LANGUAGES = {
  eng: 'English',
  fra: 'French',
  deu: 'German',
  spa: 'Spanish',
  ita: 'Italian',
  por: 'Portuguese',
  rus: 'Russian',
  ara: 'Arabic',
  chi_sim: 'Chinese Simplified',
  chi_tra: 'Chinese Traditional',
  jpn: 'Japanese',
  kor: 'Korean',
  hin: 'Hindi'
};

/**
 * Perform OCR on an image buffer
 */
async function performOCR(imageBuffer, options = {}) {
  const {
    languages = 'eng',
    preprocess = true,
    preprocessOptions = {},
    logger = null
  } = options;

  try {
    // Preprocess image if enabled
    let processedBuffer = imageBuffer;
    if (preprocess) {
      const preset = preprocessOptions.preset 
        ? getPreset(preprocessOptions.preset) 
        : preprocessOptions;
      
      processedBuffer = await preprocessImage(imageBuffer, preset);
    }

    // Perform OCR
    const result = await Tesseract.recognize(processedBuffer, languages, {
      logger: logger || (m => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      })
    });

    return result;
  } catch (error) {
    console.error('OCR Error:', error);
    throw error;
  }
}

/**
 * Parse Tesseract TSV output to extract word-level data
 */
function parseTSV(tsv) {
  const lines = tsv.trim().split('\n');
  if (lines.length === 0) return { words: [], avgConf: 0, fullText: '' };

  const headers = lines[0].split('\t');
  const rows = lines.slice(1).map(line => {
    const parts = line.split('\t');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = parts[i] || '';
    });
    return obj;
  });

  // Extract word-level data (level 5 in Tesseract)
  const words = rows
    .filter(r => r.level === '5' && r.text && r.text.trim())
    .map(r => ({
      text: r.text.trim(),
      bbox: {
        x0: Number(r.left) || 0,
        y0: Number(r.top) || 0,
        x1: (Number(r.left) || 0) + (Number(r.width) || 0),
        y1: (Number(r.top) || 0) + (Number(r.height) || 0)
      },
      conf: Number(r.conf) || 0
    }));

  // Calculate average confidence
  const avgConf = words.length > 0
    ? words.reduce((sum, w) => sum + w.conf, 0) / words.length
    : 0;

  // Extract full text (page level, level 1)
  const pageRows = rows.filter(r => r.level === '1');
  const fullText = pageRows.length > 0 
    ? pageRows.map(r => r.text).join('\n').trim()
    : words.map(w => w.text).join(' ');

  return { words, avgConf, fullText };
}

/**
 * Detect text language from content
 */
function detectLanguage(text) {
  // Simple language detection based on character sets
  // In production, use a proper language detection library
  
  if (/[\u0600-\u06FF]/.test(text)) return 'ara';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'chi_sim';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'jpn';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'kor';
  if (/[\u0400-\u04FF]/.test(text)) return 'rus';
  if (/[\u0900-\u097F]/.test(text)) return 'hin';
  
  return 'eng'; // Default to English
}

/**
 * Assess OCR quality and provide recommendations
 */
function assessQuality(confidence, wordCount) {
  const quality = {
    score: confidence,
    rating: 'unknown',
    recommendations: []
  };

  if (confidence >= 85) {
    quality.rating = 'excellent';
  } else if (confidence >= 70) {
    quality.rating = 'good';
  } else if (confidence >= 50) {
    quality.rating = 'fair';
    quality.recommendations.push('Consider preprocessing with binarization');
    quality.recommendations.push('Check if correct language is selected');
  } else {
    quality.rating = 'poor';
    quality.recommendations.push('Image quality may be too low');
    quality.recommendations.push('Try different preprocessing options');
    quality.recommendations.push('Verify document orientation');
    quality.recommendations.push('Consider rescanning at higher resolution');
  }

  if (wordCount < 10) {
    quality.recommendations.push('Very few words detected - check if image contains text');
  }

  return quality;
}

/**
 * Extract structured data from OCR results
 */
function extractStructuredData(words) {
  // Group words into lines based on y-coordinate proximity
  const lines = [];
  const threshold = 10; // pixels
  
  words.forEach(word => {
    const matchingLine = lines.find(line => 
      Math.abs(line.y - word.bbox.y0) < threshold
    );
    
    if (matchingLine) {
      matchingLine.words.push(word);
    } else {
      lines.push({
        y: word.bbox.y0,
        words: [word]
      });
    }
  });

  // Sort lines by y-coordinate and words within lines by x-coordinate
  lines.sort((a, b) => a.y - b.y);
  lines.forEach(line => {
    line.words.sort((a, b) => a.bbox.x0 - b.bbox.x0);
    line.text = line.words.map(w => w.text).join(' ');
  });

  return lines;
}

module.exports = {
  performOCR,
  parseTSV,
  detectLanguage,
  assessQuality,
  extractStructuredData,
  SUPPORTED_LANGUAGES
};
