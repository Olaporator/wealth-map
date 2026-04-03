import { useMemo, useState } from 'react';
import { DEFAULT_ASSUMPTIONS, runSimulation } from '../lib/simulation';

export function useWealthData() {
  const [assumptions] = useState(DEFAULT_ASSUMPTIONS);
  const years = useMemo(() => runSimulation(assumptions, false), [assumptions]);
  const data = useMemo(() => ({ years }), [years]);
  return { data, assumptions };
}

export { DEFAULT_ASSUMPTIONS };
