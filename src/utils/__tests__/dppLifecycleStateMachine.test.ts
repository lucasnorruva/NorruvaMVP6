import { DppLifecycleStateMachine, DppLifecycleState } from '../dppLifecycleStateMachine';

describe('DppLifecycleStateMachine', () => {
  it('allows valid transitions', () => {
    const sm = new DppLifecycleStateMachine(DppLifecycleState.DESIGN);
    sm.transition(DppLifecycleState.MANUFACTURING);
    expect(sm.getCurrentState()).toBe(DppLifecycleState.MANUFACTURING);
  });

  it('throws on invalid transitions', () => {
    const sm = new DppLifecycleStateMachine(DppLifecycleState.DESIGN);
    expect(() => sm.transition(DppLifecycleState.DISTRIBUTION)).toThrow();
  });

  it('handles full lifecycle', () => {
    const sm = new DppLifecycleStateMachine(DppLifecycleState.DESIGN);
    sm.transition(DppLifecycleState.MANUFACTURING);
    sm.transition(DppLifecycleState.QUALITY_ASSURANCE);
    sm.transition(DppLifecycleState.DISTRIBUTION);
    sm.transition(DppLifecycleState.IN_USE);
    sm.transition(DppLifecycleState.END_OF_LIFE);
    expect(sm.getCurrentState()).toBe(DppLifecycleState.END_OF_LIFE);
  });
});
