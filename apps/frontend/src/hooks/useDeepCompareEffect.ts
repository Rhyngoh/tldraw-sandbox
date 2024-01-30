import { isEqual } from "lodash";
import { useEffect, useRef } from 'react';

export const deepCompareEquals = (a: any, b: any) => {
    return isEqual(a, b);
}

export const useDeepCompareMemoize = (value: any) => {
    const ref = useRef()
    if (!deepCompareEquals(value, ref.current)) {
        ref.current = value
    }
    return ref.current
}

const useDeepCompareEffect = (callback: any, dependencies: any, delay: number = 0) => {
    const lastCall = useRef(Date.now())
    const lastDependencies = useRef(dependencies)

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastCall.current >= delay && !deepCompareEquals(dependencies, lastDependencies.current)) {
                callback();
                lastCall.current = Date.now();
                lastDependencies.current = dependencies;
            }
        }, delay - (Date.now() - lastCall.current));
        return () => clearTimeout(handler);
     }, dependencies.map(useDeepCompareMemoize))
}

export default useDeepCompareEffect;