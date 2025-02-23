/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// There are no types available for `cldr`.
const cldr = require('cldr');

/**
 * Returns the plural function for a locale
 * TODO(ocombe): replace "cldr" extractPluralRuleFunction with our own extraction using "CldrJS"
 * because the 2 libs can become out of sync if they use different versions of the cldr database
 */
export function getPluralFunction(locale: string, withTypes = true) {
  let fn = cldr.extractPluralRuleFunction(locale).toString();

  const numberType = withTypes ? ': number' : '';
  fn =
      fn.replace(/function anonymous\(n[^}]+{/g, `function plural(n${numberType})${numberType} {`)
          // Since our generated plural functions only take numbers, we can eliminate some of
          // the logic generated by the `cldr` package (to reduce payload size).
          .replace(/var/g, /let/)
          .replace(/if\s+\(typeof\s+n\s+===\s+["']string["']\)\s+n\s+=\s+parseInt\(n,\s+10\);/, '');

  // The replacement values must match the `Plural` enum from common.
  // We do not use the enum directly to avoid depending on that package.
  return fn.replace(/["']zero["']/, '0')
      .replace(/["']one["']/, '1')
      .replace(/["']two["']/, '2')
      .replace(/["']few["']/, '3')
      .replace(/["']many["']/, '4')
      .replace(/["']other["']/, '5');
}
