import { MouseEvent, TouchEvent } from 'react';
import escapeStringRegexp from 'escape-string-regexp';
import { isEqual } from 'lodash';
export function preventClicks (e: MouseEvent | TouchEvent): void {
    e.preventDefault();
    e.stopPropagation();
}

export function getRegexpFromRoute(route: string, params: string[]): RegExp {
    const escapedRoute = escapeStringRegexp(route);
    const escapedParams = params.map(escapeStringRegexp);
    let regexpString = escapedRoute;

    for (const escapedParam of escapedParams) {
        regexpString = regexpString.replace(escapedParam, '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}');
    }

    return new RegExp(regexpString);
}

export function toCapitalCase(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

export const getObjectDiff = (obj1: any, obj2: any, compareRef = false) => {
    return Object.keys(obj1).reduce((result, key) => {
        if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
            result.push(key);
        } else if (isEqual(obj1[key], obj2[key])) {
            const resultKeyIndex = result.indexOf(key);
            if (compareRef && obj1[key] !== obj2[key]) {
                result[resultKeyIndex] = `${key} (ref)`;
            } else {
                result.splice(resultKeyIndex, 1);
            }
        }
        return result;
    }, Object.keys(obj2))
}

export const compact = (arr: any[]) => {
    return arr.filter((i) => i !== undefined && i !== null);
  };