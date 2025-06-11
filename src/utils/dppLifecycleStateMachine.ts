// --- File: src/utils/dppLifecycleStateMachine.ts ---
// Description: Simple finite state machine for DPP lifecycle stages.

export enum DppLifecycleState {
  DESIGN = 'DESIGN',
  MANUFACTURING = 'MANUFACTURING',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
  DISTRIBUTION = 'DISTRIBUTION',
  IN_USE = 'IN_USE',
  END_OF_LIFE = 'END_OF_LIFE',
}

export const ALLOWED_TRANSITIONS: Record<DppLifecycleState, DppLifecycleState[]> = {
  [DppLifecycleState.DESIGN]: [DppLifecycleState.MANUFACTURING],
  [DppLifecycleState.MANUFACTURING]: [DppLifecycleState.QUALITY_ASSURANCE],
  [DppLifecycleState.QUALITY_ASSURANCE]: [DppLifecycleState.DISTRIBUTION],
  [DppLifecycleState.DISTRIBUTION]: [DppLifecycleState.IN_USE],
  [DppLifecycleState.IN_USE]: [DppLifecycleState.END_OF_LIFE],
  [DppLifecycleState.END_OF_LIFE]: [],
};

export class DppLifecycleStateMachine {
  private currentState: DppLifecycleState;

  constructor(initialState: DppLifecycleState) {
    this.currentState = initialState;
  }

  getCurrentState(): DppLifecycleState {
    return this.currentState;
  }

  canTransition(next: DppLifecycleState): boolean {
    return ALLOWED_TRANSITIONS[this.currentState].includes(next);
  }

  transition(next: DppLifecycleState): void {
    if (!this.canTransition(next)) {
      throw new Error(`Invalid state transition from ${this.currentState} to ${next}`);
    }
    this.currentState = next;
  }
}
