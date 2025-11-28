"use client"

import { Bell, X, Check, Trash2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useNotificationStore } from "@/lib/notification-store"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore()
  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return "🔔"
      case "transaction":
        return "💳"
      case "bill":
        return "📄"
      case "security":
        return "🔒"
      default:
        return "📨"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "border-l-4 border-destructive bg-destructive/5"
      case "transaction":
        return "border-l-4 border-accent bg-accent/5"
      case "bill":
        return "border-l-4 border-primary bg-primary/5"
      case "security":
        return "border-l-4 border-destructive bg-destructive/5"
      default:
        return "border-l-4 border-border"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end pt-20">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-lg m-4">
        <div className="p-4 border-b border-border flex items-center justify-between bg-card sticky top-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-bold text-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-destructive text-destructive-foreground text-xs rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 transition-colors hover:bg-muted/50 ${
                    !notification.read ? "bg-primary/5" : ""
                  } ${getTypeColor(notification.type)}`}
                >
                  <div className="flex gap-3">
                    <div className="text-xl flex-shrink-0 pt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">{notification.title}</h3>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-background rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-background rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
