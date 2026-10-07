/** Joins truthy class names: classNames('a', cond && 'b') → 'a b'. */
export function classNames(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ')
}
