// --- File: src/utils/dppLifecycleStateMachine.ts ---
// Description: Simple finite state machine for DPP lifecycle stages.

export enum DppLifecycleState {
  DESIGN = "DESIGN",
  MANUFACTURING = "MANUFACTURING",
  QUALITY_ASSURANCE = "QUALITY_ASSURANCE",
  DISTRIBUTION = "DISTRIBUTION",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  END_OF_LIFE = "END_OF_LIFE",
}

export const ALLOWED_TRANSITIONS: Record<
  DppLifecycleState,
  DppLifecycleState[]
> = {
  [DppLifecycleState.DESIGN]: [DppLifecycleState.MANUFACTURING],
  [DppLifecycleState.MANUFACTURING]: [DppLifecycleState.QUALITY_ASSURANCE],
  [DppLifecycleState.QUALITY_ASSURANCE]: [DppLifecycleState.DISTRIBUTION],
  [DppLifecycleState.DISTRIBUTION]: [DppLifecycleState.IN_USE],
  [DppLifecycleState.IN_USE]: [
    DppLifecycleState.MAINTENANCE,
    DppLifecycleState.END_OF_LIFE,
  ],
  [DppLifecycleState.MAINTENANCE]: [DppLifecycleState.IN_USE], // After maintenance, it goes back to 'In Use'
  [DppLifecycleState.END_OF_LIFE]: [], // Terminal state
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
    const allowed = ALLOWED_TRANSITIONS[this.currentState];
    return allowed ? allowed.includes(next) : false;
  }

  transition(next: DppLifecycleState): void {
    if (!this.canTransition(next)) {
      throw new Error(
        `Invalid state transition from ${this.currentState} to ${next}`,
      );
    }
    this.currentState = next;
  }
}
