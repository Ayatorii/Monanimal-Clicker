// === CHARACTER EVOLUTIONS ===
import recruitImg from "@assets/recruit_1782554032182.png";
import builderImg from "@assets/builder_1782554013411.png";
import engineerImg from "@assets/engineer_1782554013412.png";
import validatorImg from "@assets/validator_1782656730870.png";
import explorerImg from "@assets/explorer_1782656525810.png";
import founderImg from "@assets/founder_1782656426732.png";

// === ENVIRONMENTS — PC ===
import envRecruitPC from "@assets/1-recruit-room-PC.png";
import envBuilderPC from "@assets/2-builder-room-PC.png";
import envEngineerPC from "@assets/3-engineer-room-PC.png";
import envValidatorPC from "@assets/4-validator-room-PC.png";
import envExplorerPC from "@assets/5-explorer-room-PC.png";
import envFounderPC from "@assets/6-founder-room-PC.png";

// === ENVIRONMENTS — Mobile ===
import envRecruitMobile from "@assets/1-recruit-room-mobile.png";
import envBuilderMobile from "@assets/2-builder-room-mobile.png";
import envEngineerMobile from "@assets/3-engineer-room-mobile.png";
import envValidatorMobile from "@assets/4-validator-room-mobile.png";
import envExplorerMobile from "@assets/5-explorer-room-mobile.png";
import envFounderMobile from "@assets/6-founder-room-mobile.png";

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

export const ENVIRONMENTS_PC = {
  whiteRoom: envRecruitPC,
  builderGarage: envBuilderPC,
  validatorTemple: envEngineerPC,
  monadCity: envValidatorPC,
  hyperlaneNexus: envExplorerPC,
  genesisCitadel: envFounderPC,
} as const;

export const ENVIRONMENTS_MOBILE = {
  whiteRoom: envRecruitMobile,
  builderGarage: envBuilderMobile,
  validatorTemple: envEngineerMobile,
  monadCity: envValidatorMobile,
  hyperlaneNexus: envExplorerMobile,
  genesisCitadel: envFounderMobile,
} as const;

export const ITEMS = {
  smartphone: itemSmartphone,
  laptop: itemLaptop,
  gpu: itemGpu,
  ai_agent: itemAiAgent,
  validator_node: itemValidatorNode,
  data_center: itemDataCenter,
} as const;
