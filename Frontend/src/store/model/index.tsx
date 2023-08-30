import { Models } from "@rematch/core";

import mcqModel from "./mcq.model";

export interface IRootModel extends Models<IRootModel> {
  mcqModel: typeof mcqModel;
}

export const models: IRootModel = { mcqModel };
