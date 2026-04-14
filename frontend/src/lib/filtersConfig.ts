export interface BikeTypeConfig {
  name: string
  allowedWheels: string[]
  allowedBrakes: string[]
  allowedGroupsets: Record<string, string[]>
}

export const BIKE_FILTERS_CONFIG: Record<string, BikeTypeConfig> = {
  road: {
    name: 'Road',
    allowedWheels: ['700c', '650c'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic'],
    allowedGroupsets: {
      Shimano: ['Claris', 'Sora', 'Tiagra', '105', 'Ultegra', 'Dura-Ace', 'Di2'],
      SRAM: ['Apex', 'Rival', 'Force', 'Red', 'eTap AXS'],
      Campagnolo: ['Centaur', 'Chorus', 'Record', 'Super Record'],
    },
  },
  mountain: {
    name: 'Mountain',
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
  city: {
    name: 'City',
    allowedWheels: ['700c', '26"', '28"'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic', 'Roller Brakes'],
    allowedGroupsets: {
      Shimano: ['Tourney', 'Altus', 'Acera', 'Alivio', 'Nexus (Internal)', 'Alfine (Internal)'],
      SRAM: ['X3', 'X4', 'X5'],
    },
  },
  hybrid: {
    name: 'Hybrid',
    allowedWheels: ['700c', '26"', '28"'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic', 'Roller Brakes'],
    allowedGroupsets: {
      Shimano: ['Tourney', 'Altus', 'Acera', 'Alivio', 'Deore', 'Nexus (Internal)'],
      SRAM: ['X3', 'X4', 'X5', 'X7'],
    },
  },
  electric: {
    name: 'Electric',
    allowedWheels: ['700c', '27.5"', '29"', '26"', '20"'],
    allowedBrakes: ['Disc Hydraulic', 'Disc Mechanical', 'Rim Brakes'],
    allowedGroupsets: {
      'Motor Type': ['Hub Drive', 'Mid Drive'],
      'Motor Brand': ['Bosch', 'Shimano Steps', 'Brose', 'Yamaha', 'Fazua', 'TQ'],
      'Battery Range': ['< 400Wh', '400-500Wh', '500-625Wh', '625Wh+'],
    },
  },
  bmx: {
    name: 'BMX',
    allowedWheels: ['20"', '18"', '24"', '26"'],
    allowedBrakes: ['U-Brake', 'V-Brake', 'Caliper', 'Brakeless'],
    allowedGroupsets: {
      Style: ['Street', 'Park', 'Race', 'Flatland', 'Dirt Jump', 'Trails'],
      Material: ['Hi-Ten Steel', 'Chromoly (CrMo)', 'Aluminum'],
    },
  },
  kids: {
    name: 'Kids',
    allowedWheels: ['12"', '16"', '20"', '24"'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Coaster (Back-pedal)'],
    allowedGroupsets: {
      Speeds: ['1 Speed', '3 Speed', '6 Speed', '7 Speed', '8 Speed'],
      'Age Range': ['2-4 yrs (12")', '4-6 yrs (16")', '6-9 yrs (20")', '9-12 yrs (24")'],
    },
  },
  folding: {
    name: 'Folding',
    allowedWheels: ['16"', '20"', '24"'],
    allowedBrakes: ['Rim Brakes', 'Disc Mechanical', 'Disc Hydraulic', 'Roller Brakes'],
    allowedGroupsets: {
      Gearing: ['Single Speed', '3 Speed', '6 Speed', '8 Speed', '11 Speed'],
      Ecosystem: ['Brompton', 'Tern', 'Dahon', 'Other'],
    },
  },
  cargo: {
    name: 'Cargo',
    allowedWheels: ['20"', '24"', '26"', '700c / 28"'],
    allowedBrakes: ['Disc Hydraulic', 'Disc Mechanical', 'Rim Brakes', 'Roller Brakes'],
    allowedGroupsets: {
      'Cargo Type': ['Longtail', 'Front Loader (Bakfiets)', 'Box Bike', 'Trike'],
      'Electric Assist': ['No (Acoustic)', 'Hub Motor', 'Mid-Drive Motor'],
      Payload: ['Up to 50 kg', '50-100 kg', '100 kg+'],
    },
  },
}

export function getAllowedWheels(types: string[]): string[] {
  if (types.length === 0) {
    return [...new Set(Object.values(BIKE_FILTERS_CONFIG).flatMap((c) => c.allowedWheels))]
  }
  return [...new Set(types.flatMap((t) => BIKE_FILTERS_CONFIG[t]?.allowedWheels ?? []))]
}

export function getAllowedBrakes(types: string[]): string[] {
  if (types.length === 0) {
    return [...new Set(Object.values(BIKE_FILTERS_CONFIG).flatMap((c) => c.allowedBrakes))]
  }
  return [...new Set(types.flatMap((t) => BIKE_FILTERS_CONFIG[t]?.allowedBrakes ?? []))]
}

export function getAllowedGroupsets(types: string[]): Record<string, string[]> {
  const configs =
    types.length === 0
      ? Object.values(BIKE_FILTERS_CONFIG)
      : types.map((t) => BIKE_FILTERS_CONFIG[t]).filter(Boolean)

  const merged: Record<string, string[]> = {}
  for (const config of configs) {
    for (const [brand, groupsets] of Object.entries(config.allowedGroupsets)) {
      merged[brand] = [...new Set([...(merged[brand] ?? []), ...groupsets])]
    }
  }
  return merged
}

export function getAllowedGroupsetsFlat(types: string[]): string[] {
  return Object.values(getAllowedGroupsets(types)).flat()
}
