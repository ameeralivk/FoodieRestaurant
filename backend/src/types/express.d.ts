// import { IPlan } from "../models/planModel";

// declare global {
//   namespace Express {
//     interface Request {
//       activePlan?: IPlan;
//     }
//   }
// }

// export {};

import { IPlan } from "../models/planModel";

declare global {
  namespace Express {
    interface Request {
      activePlan?: IPlan;
    }
  }
}

export {};

