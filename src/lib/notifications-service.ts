import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  limit
} from "firebase/firestore";

export interface NotificationItem {
  id?: string;
  userId: string; // The user who will receive the notification
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: any;
  actionUrl?: string;
}

export const notificationsService = {
  // Enviar uma nova notificação no sistema
  async createNotification(notification: Omit<NotificationItem, "id" | "createdAt" | "read">) {
    try {
      const docRef = await addDoc(collection(db, "notifications"), {
        ...notification,
        read: false,
        createdAt: serverTimestamp()
      });
      
      // Aqui faríamos a chamada para nossa API para disparar Email e Push Notification
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: notification.userId,
          title: notification.title,
          body: notification.body,
          actionUrl: notification.actionUrl
        })
      });

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      return null;
    }
  },

  // Ouvir notificações em tempo real para um usuário específico
  subscribeToNotifications(userId: string, callback: (notifications: NotificationItem[]) => void) {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifs: NotificationItem[] = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() } as NotificationItem);
      });
      callback(notifs);
    });
  },

  // Marcar como lida
  async markAsRead(notificationId: string) {
    try {
      const notifRef = doc(db, "notifications", notificationId);
      await updateDoc(notifRef, {
        read: true
      });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  },
  
  // Marcar todas como lidas
  async markAllAsRead(userId: string) {
     try {
       const q = query(
         collection(db, "notifications"),
         where("userId", "==", userId),
         where("read", "==", false)
       );
       const snapshot = await getDocs(q);
       const updatePromises = snapshot.docs.map(document => 
         updateDoc(doc(db, "notifications", document.id), { read: true })
       );
       await Promise.all(updatePromises);
     } catch(e) {
       console.error(e);
     }
  }
};
