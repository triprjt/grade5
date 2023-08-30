import { createModel } from "@rematch/core";

import { IRootModel } from ".";

const initialState: { index: number; answeredValues: number[] } = {
  index: 0,
  answeredValues: [],
};

const mcqModel = createModel<IRootModel>()({
  state: initialState, // initial state
  reducers: {
    handleIndex(state, index) {
      return {
        ...state,
        index: index,
      };
    },
    handleAnsweredValues(state, index) {
      return {
        ...state,
        answeredValues: [...state.answeredValues, index],
      };
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  effects: (dispatch) => ({}),
});
export default mcqModel;
