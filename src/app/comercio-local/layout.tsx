export const metadata = {
  title: "Painel de Comércio Local - Rede Inova Social",
  description: "Acesso exclusivo para Produtores Familiares e Secretarias de Agricultura.",
};

export default function ComercioLocalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {children}
    </div>
  );
}
