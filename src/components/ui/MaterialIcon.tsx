import React from 'react';
import * as Gi from 'react-icons/gi';

interface Props {
  materialId: string;
  size?: number;
  className?: string;
  color?: string;
}

export const MaterialIcon: React.FC<Props> = ({ materialId, size = 16, className = '', color }) => {
  const props = { size, className, color };
  
  const map: Record<string, React.ElementType> = {
    // Earth
    m_e1_1: Gi.GiCog,
    m_e1_2: Gi.GiScrew,
    m_e1_3: Gi.GiPaintBucket,
    m_e1_4: Gi.GiBrickWall,
    m_e2_1: Gi.GiStoneBlock,
    m_e2_2: Gi.GiCrystalGrowth,
    m_e2_3: Gi.GiPorcelainVase,
    m_e2_4: Gi.GiStoneTablet,
    m_e3_1: Gi.GiGoldBar,
    m_e3_2: Gi.GiHeartOrgan,
    m_e3_3: Gi.GiFossil,
    m_e3_4: Gi.GiRibcage,
    
    // Fire
    m_f1_1: Gi.GiGears,
    m_f1_2: Gi.GiWireCoil,
    m_f1_3: Gi.GiPaintBucket,
    m_f1_4: Gi.GiScrew,
    m_f2_1: Gi.GiTorch,
    m_f2_2: Gi.GiCarBattery,
    m_f2_3: Gi.GiBreastplate,
    m_f2_4: Gi.GiFlintSpark,
    m_f3_1: Gi.GiDragonHead,
    m_f3_2: Gi.GiSun,
    m_f3_3: Gi.GiFlame,
    m_f3_4: Gi.GiFeatheredWing,
    
    // Water
    m_w1_1: Gi.GiWaterDrop,
    m_w1_2: Gi.GiDrop,
    m_w1_3: Gi.GiPaintBucket,
    m_w1_4: Gi.GiValve,
    m_w2_1: Gi.GiPipes,
    m_w2_2: Gi.GiIceCube,
    m_w2_3: Gi.GiMetalBar,
    m_w2_4: Gi.GiBubbles,
    m_w3_1: Gi.GiSharkJaws,
    m_w3_2: Gi.GiOysterPearl,
    m_w3_3: Gi.GiOpenTreasureChest,
    m_w3_4: Gi.GiSnowflake1,
    
    // Wind
    m_a1_1: Gi.GiWindmill,
    m_a1_2: Gi.GiFeather,
    m_a1_3: Gi.GiPaintBucket,
    m_a1_4: Gi.GiGears,
    m_a2_1: Gi.GiComputerFan,
    m_a2_2: Gi.GiGlider,
    m_a2_3: Gi.GiTornado,
    m_a2_4: Gi.GiTornado,
    m_a3_1: Gi.GiFairy,
    m_a3_2: Gi.GiJetFighter,
    m_a3_3: Gi.GiBatWing,
    m_a3_4: Gi.GiRocketThruster,
    
    // Light
    m_l1_1: Gi.GiLightBulb,
    m_l1_2: Gi.GiUnplugged,
    m_l1_3: Gi.GiPaintBucket,
    m_l1_4: Gi.GiMagnifyingGlass,
    m_l2_1: Gi.GiLed,
    m_l2_2: Gi.GiSolarPower,
    m_l2_3: Gi.GiSunbeams,
    m_l2_4: Gi.GiNetworkBars,
    m_l3_1: Gi.GiAngelOutfit,
    m_l3_2: Gi.GiGlowingArtifact,
    m_l3_3: Gi.GiPrism,
    m_l3_4: Gi.GiFallingStar,
    
    // Dark
    m_d1_1: Gi.GiSlime,
    m_d1_2: Gi.GiCircuitry,
    m_d1_3: Gi.GiPaintBucket,
    m_d1_4: Gi.GiScrollUnfurled,
    m_d2_1: Gi.GiSpikedArmor,
    m_d2_2: Gi.GiPoisonBottle,
    m_d2_3: Gi.GiPortal,
    m_d2_4: Gi.GiOre,
    m_d3_1: Gi.GiAllSeeingEye,
    m_d3_2: Gi.GiPortal,
    m_d3_3: Gi.GiTentaclesSkull,
    m_d3_4: Gi.GiOre,
  };

  const IconComponent = map[materialId];
  if (IconComponent) return <IconComponent {...props} />;

  if (materialId.startsWith('m_e')) return <Gi.GiStoneBlock {...props} />;
  if (materialId.startsWith('m_f')) return <Gi.GiFlame {...props} />;
  if (materialId.startsWith('m_w')) return <Gi.GiWaterDrop {...props} />;
  if (materialId.startsWith('m_a')) return <Gi.GiTornado {...props} />;
  if (materialId.startsWith('m_l')) return <Gi.GiSunbeams {...props} />;
  if (materialId.startsWith('m_d')) return <Gi.GiEvilBat {...props} />;
  
  return <Gi.GiHelp {...props} />;
};
