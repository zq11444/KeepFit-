import { createVNode, render } from 'vue'
import AlertBox from '@/components/AlertBox.vue'

let alertContainer: HTMLDivElement | null = null

export function showAlert(options: {
    message: string,
    type?: 'success' | 'warning' | 'error' | 'info',
    duration?: number
}) {
    if (!alertContainer) {
        alertContainer = document.createElement('div')
        document.body.appendChild(alertContainer)
    }

    const vnode = createVNode(AlertBox, {
        ...options,
        onDestroy: () => {
            render(null, alertContainer!)
        }
    })

    render(vnode, alertContainer)
}

// 快捷方法
export const alert = {
    success(message: string, duration = 3000) {
        showAlert({ message, type: 'success', duration })
    },
    warning(message: string, duration = 3000) {
        showAlert({ message, type: 'warning', duration })
    },
    error(message: string, duration = 3000) {
        showAlert({ message, type: 'error', duration })
    },
    info(message: string, duration = 3000) {
        showAlert({ message, type: 'info', duration })
    }
}
