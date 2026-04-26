
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment, getDoc, Firestore } from 'firebase/firestore';
import { Eye } from 'lucide-react';

async function getVisitorCount(firestore: Firestore): Promise<number> {
    const counterRef = doc(firestore, 'visits', 'counter');
    try {
        const docSnap = await getDoc(counterRef);
        return docSnap.exists() ? docSnap.data().count : 0;
    } catch (error: any) {
        // Silently fail if permissions are missing
        if (error?.code === 'permission-denied') {
            console.warn("Visitor count: Permission denied, showing fallback.");
        } else {
            console.error("Error fetching visitor count:", error);
        }
        return 0;
    }
}

async function incrementVisitorCount(firestore: Firestore) {
    const counterRef = doc(firestore, 'visits', 'counter');
    try {
        await setDoc(counterRef, { count: increment(1) }, { merge: true });
    } catch (error: any) {
        if (error?.code === 'permission-denied') {
             console.warn("Visitor count: Increment permission denied.");
             return;
        }
        console.error("Error incrementing visitor count:", error);
        // This might be the first visit ever, so the doc doesn't exist.
        // Try to create it.
        try {
            await setDoc(counterRef, { count: 1 });
        } catch (creationError) {
             console.error("Error creating visitor counter doc:", creationError);
        }
    }
}


export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const firestore = db;
    
    const runCounter = async () => {
        const key = 'hasIncrementedVisitCount';
        const hasIncremented = sessionStorage.getItem(key);

        if (!hasIncremented) {
            await incrementVisitorCount(firestore);
            sessionStorage.setItem(key, 'true');
        }
        
        const latestCount = await getVisitorCount(firestore);
        setCount(latestCount);
    };

    runCounter();
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>
        {count !== null ? `${count.toLocaleString('pt-BR')} acessos` : '...'}
      </span>
    </div>
  );
}
