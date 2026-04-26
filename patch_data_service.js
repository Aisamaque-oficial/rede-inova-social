const fs = require('fs');
const path = 'c:/dev/REDEINOVA/src/lib/data-service.ts';
let content = fs.readFileSync(path, 'utf8');

// Add import
if (!content.includes('serverTimestamp')) {
    content = content.replace(/onSnapshot\s*}/, 'onSnapshot,\n  serverTimestamp\n}');
}

// Add methods
const methods = `
  // 🕒 MONITOR DE ATIVIDADE DE MEMBROS
  async registerUserPresence(userId: string): Promise<void> {
    const isBypass = this.isBypass();
    const isLocal = this.isAuthenticatedLocally();
    if (isBypass || isLocal) return;

    try {
      const firebaseUid = localStorage.getItem("firebase_uid");
      if (!firebaseUid) return;
      
      const userRef = doc(db, "users", firebaseUid);
      await updateDoc(userRef, {
        last_online: serverTimestamp()
      });
    } catch (e) {
      console.warn("Erro ao registrar presença:", e);
    }
  },

  async updateUserSessionDuration(userId: string, duration: number): Promise<void> {
    const isBypass = this.isBypass();
    const isLocal = this.isAuthenticatedLocally();
    if (isBypass || isLocal) return;

    try {
      const firebaseUid = localStorage.getItem("firebase_uid");
      if (!firebaseUid) return;
      
      const userRef = doc(db, "users", firebaseUid);
      await updateDoc(userRef, {
        session_duration: duration,
        last_online: serverTimestamp()
      });
    } catch (e) {
      console.warn("Erro ao atualizar duração da sessão:", e);
    }
  },

  async getUserActivityReport(): Promise<any[]> {
    try {
      const usersCol = collection(db, "users");
      const snapshot = await getDocs(query(usersCol, orderBy("last_online", "desc")));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
       console.error("Erro ao carregar relatório de acessos:", e);
       // Fallback para lista de usuários se as permissões falharem no modo público
       const users = await this.listarMembrosEquipe();
       return users;
    }
  }
};`;

if (!content.includes('registerUserPresence')) {
    content = content.replace(/};\s*$/, methods);
}

fs.writeFileSync(path, content);
console.log('File patched successfully');
