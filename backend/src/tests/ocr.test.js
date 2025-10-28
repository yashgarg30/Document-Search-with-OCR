const { performOCR, parseTSV, assessQuality } = require('../services/ocrService');
const { preprocessImage, getPreset } = require('../services/preprocess');
const fs = require('fs');
const path = require('path');

describe('OCR Service Tests', () => {
  
  describe('Preprocessing', () => {
    test('should apply document preset correctly', () => {
      const preset = getPreset('document');
      expect(preset).toHaveProperty('grayscale', true);
      expect(preset).toHaveProperty('contrast', true);
      expect(preset).toHaveProperty('dpi', 300);
    });

    test('should apply scan preset correctly', () => {
      const preset = getPreset('scan');
      expect(preset).toHaveProperty('binarize', true);
      expect(preset).toHaveProperty('denoise', true);
    });
  });

  describe('TSV Parsing', () => {
    test('should parse TSV correctly', () => {
      const mockTSV = `level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext
1\t1\t0\t0\t0\t0\t0\t0\t100\t100\t95\tHello
5\t1\t1\t1\t1\t1\t10\t10\t50\t20\t92\tHello
5\t1\t1\t1\t1\t2\t65\t10\t50\t20\t88\tWorld`;

      const result = parseTSV(mockTSV);
      
      expect(result.words).toHaveLength(2);
      expect(result.words[0].text).toBe('Hello');
      expect(result.words[1].text).toBe('World');
      expect(result.avgConf).toBeGreaterThan(0);
    });

    test('should handle empty TSV', () => {
      const result = parseTSV('');
      expect(result.words).toHaveLength(0);
      expect(result.avgConf).toBe(0);
    });
  });

  describe('Quality Assessment', () => {
    test('should rate excellent quality correctly', () => {
      const quality = assessQuality(90, 100);
      expect(quality.rating).toBe('excellent');
      expect(quality.recommendations).toHaveLength(0);
    });

    test('should rate poor quality and provide recommendations', () => {
      const quality = assessQuality(45, 50);
      expect(quality.rating).toBe('poor');
      expect(quality.recommendations.length).toBeGreaterThan(0);
      expect(quality.recommendations).toContain('Image quality may be too low');
    });

    test('should detect low word count', () => {
      const quality = assessQuality(85, 5);
      expect(quality.recommendations).toContain('Very few words detected - check if image contains text');
    });
  });

  describe('Language Detection', () => {
    const { detectLanguage } = require('../services/ocrService');

    test('should detect Arabic', () => {
      const result = detectLanguage('مرحبا بك');
      expect(result).toBe('ara');
    });

    test('should detect Chinese', () => {
      const result = detectLanguage('你好世界');
      expect(result).toBe('chi_sim');
    });

    test('should default to English', () => {
      const result = detectLanguage('Hello World');
      expect(result).toBe('eng');
    });
  });

  describe('Structured Data Extraction', () => {
    const { extractStructuredData } = require('../services/ocrService');

    test('should group words into lines', () => {
      const words = [
        { text: 'Hello', bbox: { x0: 10, y0: 10, x1: 50, y1: 30 }, conf: 95 },
        { text: 'World', bbox: { x0: 60, y0: 10, x1: 100, y1: 30 }, conf: 92 },
        { text: 'Second', bbox: { x0: 10, y0: 50, x1: 60, y1: 70 }, conf: 88 },
        { text: 'Line', bbox: { x0: 70, y0: 50, x1: 100, y1: 70 }, conf: 90 }
      ];

      const lines = extractStructuredData(words);
      
      expect(lines).toHaveLength(2);
      expect(lines[0].text).toBe('Hello World');
      expect(lines[1].text).toBe('Second Line');
    });
  });
});

describe('Integration Tests', () => {
  test('should handle end-to-end OCR flow', async () => {
    // This would require test fixtures
    // Placeholder for integration testing
    expect(true).toBe(true);
  });
});
