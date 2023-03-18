import type { InjectionKey } from 'vue'

import type { NotiManager } from '../components/views/Notifications.vue'

export const kNotiManager = Symbol('NotiManager') as InjectionKey<NotiManager>
