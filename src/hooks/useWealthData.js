import { useMemo, useState } from 'react';
import { DEFAULT_ASSUMPTIONS, runSimulation } from '../lib/simulation';

export function useWealthData() {
  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS);
  const years = useMemo(() => runSimulation(assumptions), [assumptions]);
  const data = useMemo(() => ({ years }), [years]);

  return { data, assumptions, setAssumptions };
}

export { DEFAULT_ASSUMPTIONS };
