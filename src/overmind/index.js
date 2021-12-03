import { createOvermind } from 'overmind';
import { createStateHook, createActionsHook } from 'overmind-react';

import { state } from './state';
import * as actions from './actions';
import * as effects from './effects';

export const overmind = createOvermind({
  state,
  actions,
  effects
});

export const useAppState = createStateHook();
export const useActions = createActionsHook();
