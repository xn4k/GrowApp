// utils/router.ts
import type { Router, RouteLocationRaw } from 'vue-router'
import { isNavigationFailure, NavigationFailureType } from 'vue-router'

export async function safePush(router: Router, to: RouteLocationRaw) {
  const target = router.resolve(to).fullPath
  const current = router.currentRoute.value.fullPath
  if (target === current) return
  try {
    await router.push(to)
  } catch (err) {
    if (!isNavigationFailure(err, NavigationFailureType.duplicated)) throw err
  }
}
