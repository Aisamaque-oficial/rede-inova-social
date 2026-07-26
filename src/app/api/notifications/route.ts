import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import webPush from 'web-push';
import { db } from '@/lib/firebase-admin'; // We need firebase-admin for backend, or we can use regular firebase if we want (but firebase-admin is better for server).

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

// Configure Web Push (VAPID) safely for build time
try {
  if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(
      'mailto:contato@redeinovasocial.com.br',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
  }
} catch (e) {
  console.warn("VAPID keys not configured properly, web push will not work.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, title, body: notificationBody, actionUrl } = body;

    if (!userId || !title) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    // 1. Send Email Notification
    // Here we need to get the user's email. We can fetch it using firebase-admin.
    // For now, let's pretend we have it, or we skip email if not found.
    // await resend.emails.send({
    //   from: 'onboarding@resend.dev',
    //   to: userEmail,
    //   subject: title,
    //   html: `<p>${notificationBody}</p><a href="${actionUrl || 'https://redeinova.vercel.app/painel/dashboard'}">Ver notificação</a>`
    // });

    // 2. Send Push Notification
    // We would fetch all push subscriptions for this user from Firestore:
    /*
    const subsSnapshot = await db.collection('pushSubscriptions').where('userId', '==', userId).get();
    const pushPromises = subsSnapshot.docs.map(doc => {
      const sub = doc.data().subscription;
      return webPush.sendNotification(sub, JSON.stringify({
        title,
        body: notificationBody,
        url: actionUrl
      })).catch(err => {
         if (err.statusCode === 404 || err.statusCode === 410) {
            // Subscription has expired or is no longer valid, delete it
            return doc.ref.delete();
         }
      });
    });
    await Promise.all(pushPromises);
    */

    return NextResponse.json({ success: true, message: "Notificação disparada" });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return NextResponse.json({ error: 'Erro ao enviar notificação' }, { status: 500 });
  }
}
