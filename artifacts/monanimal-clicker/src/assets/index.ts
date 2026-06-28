// === CHARACTER EVOLUTIONS ===
import recruitImg from "@assets/recruit_1782554032182.png";
import builderImg from "@assets/builder_1782554013411.png";
import engineerImg from "@assets/engineer_1782554013412.png";
import validatorImg from "@assets/validator_1782656730870.png";
import explorerImg from "@assets/explorer_1782656525810.png";
import founderImg from "@assets/founder_1782656426732.png";

// === ENVIRONMENTS ===
import envWhiteRoom from "@assets/white-room_1782394631156.png";
import envBuilderGarage from "@assets/builder-garage_1782394767078.png";
import envValidatorTemple from "@assets/validator-temple_1782394665646.png";
import envMonadCity from "@assets/monad-city_1782394698609.png";
import envHyperlaneNexus from "@assets/hyperlane-nexus_1782394698608.png";
import envGenesisCitadel from "@assets/genesis-citadel_1782394767086.png";

// === UPGRADE ITEMS ===
import itemSmartphone from "@assets/smartphone_1782653674000.png";
import itemLaptop from "@assets/laptop_1782653637552.png";
import itemGpu from "@assets/gpu_1782653785667.png";
import itemAiAgent from "@assets/ai_agent_1782653609352.png";
import itemValidatorNode from "@assets/validator-node_1782653755242.png";
import itemDataCenter from "@assets/data-center_1782653716782.png";

export const CHARACTERS = {
  recruit: recruitImg,
  builder: builderImg,
  engineer: engineerImg,
  validator: validatorImg,
  explorer: explorerImg,
  founder: founderImg,
} as const;

export const ENVIRONMENTS = {
  whiteRoom: envWhiteRoom,
  builderGarage: envBuilderGarage,
  validatorTemple: envValidatorTemple,
  monadCity: envMonadCity,
  hyperlaneNexus: envHyperlaneNexus,
  genesisCitadel: envGenesisCitadel,
} as const;

export const ITEMS = {
  smartphone: itemSmartphone,
  laptop: itemLaptop,
  gpu: itemGpu,
  ai_agent: itemAiAgent,
  validator_node: itemValidatorNode,
  data_center: itemDataCenter,
} as const;
