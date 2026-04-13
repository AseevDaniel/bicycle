export interface BikeTypeConfig {
  name: string
  allowedWheels: string[]
  allowedBrakes: string[]
  allowedGroupsets: Record<string, string[]>
}

export const BIKE_FILTER_CONFIG: Record<string, BikeTypeConfig> = {
  road: {
    name: 'Road Bike',
    allowedWheels: ['700c', '650c'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic'],
    allowedGroupsets: {
      Shimano: ['Claris', 'Sora', 'Tiagra', '105', 'Ultegra', 'Dura-Ace', 'Di2'],
      SRAM: ['Apex', 'Rival', 'Force', 'Red', 'eTap AXS'],
      Campagnolo: ['Centaur', 'Chorus', 'Record', 'Super Record'],
    },
  },
  mountain: {
    name: 'Mountain Bike',
    allowedWheels: ['26"', '27.5"', '29"', 'Mullet (29/27.5)'],
    allowedBrakes: ['Disc Hydraulic', 'Disc Mechanical', 'Rim Brakes'],
    allowedGroupsets: {
      Shimano: ['Tourney', 'Altus', 'Acera', 'Alivio', 'Deore', 'SLX', 'XT', 'XTR'],
      SRAM: ['SX Eagle', 'NX Eagle', 'GX Eagle', 'X01 Eagle', 'XX1 Eagle', 'Transmission (T-Type)'],
    },
  },
  gravel: {
    name: 'Gravel',
    allowedWheels: ['700c', '650b'],
    allowedBrakes: ['Disc Hydraulic', 'Disc Mechanical'],
    allowedGroupsets: {
      Shimano: ['GRX 400', 'GRX 600', 'GRX 800', 'Sora', 'Tiagra', '105'],
      SRAM: ['Apex', 'Rival', 'Force', 'Red XPLR'],
    },
  },
  city_hybrid: {
    name: 'City / Hybrid',
    allowedWheels: ['700c', '26"', '28"'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic', 'Roller Brakes'],
    allowedGroupsets: {
      Shimano: ['Tourney', 'Altus', 'Acera', 'Alivio', 'Nexus (Internal Gear)', 'Alfine (Internal Gear)'],
      SRAM: ['X3', 'X4', 'X5'],
    },
  },
  bmx: {
    name: 'BMX',
    allowedWheels: ['20"', '22"', '24"'],
    allowedBrakes: ['U-Brakes', 'V-Brakes', 'Disc Mechanical', 'No Brakes (Brakeless)'],
    allowedGroupsets: {
      Drivetrain: ['Single Speed (Freecoaster)', 'Single Speed (Cassette)', 'Single Speed (Freewheel)'],
      Style: ['Street', 'Park', 'Dirt / Jump', 'Flatland', 'Racing'],
    },
  },
  kids: {
    name: 'Kids Bike',
    allowedWheels: ['12"', '14"', '16"', '18"', '20"', '24"'],
    allowedBrakes: ['Coaster Brake', 'Rim Caliper', 'V-Brakes', 'Disc Mechanical'],
    allowedGroupsets: {
      Speeds: ['Single Speed', '3-Speed', '6-Speed', '7-Speed', '8-Speed'],
      'Age Group': ['2–4 yrs (Balance)', '4–6 yrs', '6–9 yrs', '9–12 yrs'],
    },
  },
  folding: {
    name: 'Folding Bike',
    allowedWheels: ['16"', '20"', '24"'],
    allowedBrakes: ['Rim Caliper', 'V-Brakes', 'Disc Mechanical', 'Disc Hydraulic'],
    allowedGroupsets: {
      Shimano: ['Nexus 3', 'Nexus 7', 'Nexus 8', 'Alfine 8', 'Alfine 11', 'Tourney', 'Acera'],
      SRAM: ['Automatix', 'i-Motion 3'],
      Other: ['Single Speed', 'Derailleur 6-Speed', 'Derailleur 8-Speed'],
    },
  },
  cargo: {
    name: 'Cargo Bike',
    allowedWheels: ['20"', '24"', '26"', '700c', '29"'],
    allowedBrakes: ['Disc Hydraulic', 'Disc Mechanical', 'Drum Brake', 'V-Brakes'],
    allowedGroupsets: {
      'E-Assist': ['Bosch Cargo Line', 'Bosch Active Line', 'Shimano STEPS E6100', 'Yamaha PW-S2', 'Bafang M600'],
      Mechanical: ['Single Speed', 'Shimano Nexus 7', 'Shimano Nexus 8', 'Shimano Alfine 8', 'SRAM Automatix'],
    },
  },
}

// Maps bikeType values (as used in FilterState/URL) → config keys above
export const BIKE_TYPE_CONFIG_MAP: Record<string, string> = {
  road: 'road',
  mountain: 'mountain',
  gravel: 'gravel',
  city: 'city_hybrid',
  hybrid: 'city_hybrid',
  bmx: 'bmx',
  kids: 'kids',
  folding: 'folding',
  cargo: 'cargo',
}

/**
 * Returns the union of allowed wheel sizes for the given selected bike types.
 * Returns an empty array if no type maps to a config entry.
 */
export function getAllowedWheels(bikeTypes: string[]): string[] {
  const result = new Set<string>()
  for (const type of bikeTypes) {
    const key = BIKE_TYPE_CONFIG_MAP[type]
    if (key && BIKE_FILTER_CONFIG[key]) {
      BIKE_FILTER_CONFIG[key].allowedWheels.forEach((w) => result.add(w))
    }
  }
  return Array.from(result)
}

/**
 * Returns the union of allowed brake types for the given selected bike types.
 */
export function getAllowedBrakes(bikeTypes: string[]): string[] {
  const result = new Set<string>()
  for (const type of bikeTypes) {
    const key = BIKE_TYPE_CONFIG_MAP[type]
    if (key && BIKE_FILTER_CONFIG[key]) {
      BIKE_FILTER_CONFIG[key].allowedBrakes.forEach((b) => result.add(b))
    }
  }
  return Array.from(result)
}

/**
 * Returns grouped groupsets for selected bike types, merged by brand.
 * e.g. [{ brand: 'Shimano', models: ['105', 'Ultegra'] }, ...]
 */
export function getAllowedGroupsets(bikeTypes: string[]): { brand: string; models: string[] }[] {
  const brandMap = new Map<string, Set<string>>()
  for (const type of bikeTypes) {
    const key = BIKE_TYPE_CONFIG_MAP[type]
    if (key && BIKE_FILTER_CONFIG[key]) {
      for (const [brand, models] of Object.entries(BIKE_FILTER_CONFIG[key].allowedGroupsets)) {
        if (!brandMap.has(brand)) brandMap.set(brand, new Set())
        models.forEach((m) => brandMap.get(brand)!.add(m))
      }
    }
  }
  return Array.from(brandMap.entries()).map(([brand, models]) => ({
    brand,
    models: Array.from(models),
  }))
}

/**
 * Returns true if any selected bike type has a config entry with dependent filter options.
 */
export function hasDependentFilters(bikeTypes: string[]): boolean {
  return bikeTypes.some((t) => BIKE_TYPE_CONFIG_MAP[t] !== undefined)
}
