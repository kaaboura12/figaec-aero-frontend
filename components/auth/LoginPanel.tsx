import Image from "next/image";

export default function LoginPanel() {
  return (
    <div className="relative hidden lg:flex w-[45%] flex-shrink-0 overflow-hidden rounded-2xl">
      <Image
        src="/leftsidelogin.png"
        alt="Figeac Aero Tunisie – Système de suivi des ordres de fabrication"
        fill
        className="object-cover"
        priority
        sizes="45vw"
      />
    </div>
  );
}
