import { useMemo, useState, useCallback } from 'react';
import { DEFAULT_ASSUMPTIONS, runSimulation } from '../lib/simulation';

export function useWealthData() {
  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS);
  const years = useMemo(() => runSimulation(assumptions), [assumptions]);
  const data = useMemo(() => ({ years }), [years]);

  const toggleNtBoost = useCallback(() => {
    setAssumptions((a) => ({ ...a, ntBoostEnabled: !a.ntBoostEnabled }));
  }, []);

  return { data, assumptions, setAssumptions, toggleNtBoost };
}

export { DEFAULT_ASSUMPTIONS };
