const fs = require('fs');
const path = require('path');

class TACDatabase {
  constructor() {
    this.tacData = new Map();
    this.isLoaded = false;
    this.loadDatabase();
  }

  loadDatabase() {
    try {
      const csvPath = path.join(__dirname, '..', '..', 'tac-new_cleanup.csv');
      const csvContent = fs.readFileSync(csvPath, 'utf8');
      
      const lines = csvContent.split('\n');
      const headers = lines[0].split(',');
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(',');
        const tac = values[0]?.trim();
        
        if (tac && tac.length === 8) {
          this.tacData.set(tac, {
            tac: tac,
            manufacturer: values[1]?.trim() || 'Unknown',
            model: values[2]?.trim() || 'Unknown',
            hwType: values[3]?.trim() || '',
            os: values[4]?.trim() || '',
            year: values[5]?.trim() || ''
          });
        }
      }
      
      this.isLoaded = true;
      console.log(`[TAC Database] Loaded ${this.tacData.size} TAC entries`);
    } catch (error) {
      console.error('[TAC Database] Error loading database:', error);
      this.isLoaded = false;
    }
  }

  getDeviceInfo(imei) {
    if (!this.isLoaded || !imei || imei.length < 8) {
      return {
        tac: null,
        manufacturer: 'Desconhecido',
        model: 'Modelo não identificado',
        hwType: '',
        os: '',
        year: '',
        deviceType: 'Smartphone'
      };
    }

    const tac = imei.substring(0, 8);

    const match = this.lookupWithFallback(tac);

    if (match) {
      return {
        ...match,
        deviceType: this.getDeviceType(match.hwType, match.model)
      };
    }

    // Se não encontrar no banco, retorna info básica com o TAC para exibir
    return {
      tac,
      manufacturer: 'Desconhecido',
      model: 'Modelo não identificado',
      hwType: '',
      os: '',
      year: '',
      deviceType: 'Smartphone'
    };
  }

  getDeviceType(hwType, model) {
    const hwTypeLower = (hwType || '').toLowerCase();
    const modelLower = (model || '').toLowerCase();
    
    if (hwTypeLower.includes('tablet') || modelLower.includes('tablet') || modelLower.includes('ipad')) {
      return 'Tablet';
    }
    if (hwTypeLower.includes('phone') || modelLower.includes('phone') || modelLower.includes('iphone')) {
      return 'Smartphone';
    }
    if (modelLower.includes('watch') || modelLower.includes('galaxy watch') || modelLower.includes('apple watch')) {
      return 'Smartwatch';
    }
    if (modelLower.includes('router') || modelLower.includes('modem') || modelLower.includes('hotspot')) {
      return 'Router/Modem';
    }
    
    return 'Smartphone'; // Default
  }

  /**
   * Procura TAC com fallback por prefixo (8 -> 7 -> 6 -> 5 -> 4 -> 3)
   * para lidar com TACs não encontrados no CSV completo.
   */
  lookupWithFallback(tac) {
    // Match completo
    const full = this.tacData.get(tac);
    if (full) return { ...full, tac };

    // Fallback por prefixo (7,6,5,4,3)
    const prefixes = [7, 6, 5, 4, 3];
    for (const len of prefixes) {
      const prefix = tac.substring(0, len);
      for (const [key, value] of this.tacData.entries()) {
        if (key.startsWith(prefix)) {
          return { ...value, tac: key };
        }
      }
    }
    return null;
  }

  searchByManufacturer(manufacturer) {
    const results = [];
    const searchTerm = manufacturer.toLowerCase();
    
    for (const [tac, info] of this.tacData.values()) {
      if (info.manufacturer.toLowerCase().includes(searchTerm)) {
        results.push({ tac, ...info });
      }
    }
    
    return results.slice(0, 50); // Limit results
  }

  searchByModel(model) {
    const results = [];
    const searchTerm = model.toLowerCase();
    
    for (const [tac, info] of this.tacData.values()) {
      if (info.model.toLowerCase().includes(searchTerm)) {
        results.push({ tac, ...info });
      }
    }
    
    return results.slice(0, 50); // Limit results
  }

  getStats() {
    const manufacturers = new Map();
    const years = new Map();
    
    for (const info of this.tacData.values()) {
      // Count manufacturers
      const mfg = info.manufacturer || 'Unknown';
      manufacturers.set(mfg, (manufacturers.get(mfg) || 0) + 1);
      
      // Count years
      const year = info.year || 'Unknown';
      years.set(year, (years.get(year) || 0) + 1);
    }
    
    return {
      totalTACs: this.tacData.size,
      manufacturers: Object.fromEntries(manufacturers),
      years: Object.fromEntries(years)
    };
  }
}

// Singleton instance
const tacDatabase = new TACDatabase();

module.exports = tacDatabase;
