import type { InjectionKey } from 'vue'

import type { NotiManager } from '@comp/views/Notifications.vue'

export const kNotiManager = Symbol('NotiManager') as InjectionKey<NotiManager>
