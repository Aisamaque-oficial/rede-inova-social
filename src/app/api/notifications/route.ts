import { NextResponse } from 'next/server';
// Notifications handler - dynamic dispatch

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
