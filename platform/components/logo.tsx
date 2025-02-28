import Image from "next/image";
import Link from "next/link";

interface LogoProps {
   short?: boolean;
   height: number;
   width: number;
   title_classname?: string
   sub_title_classname?: string
   url: string;
}

export function Logo({ short = false, height, width, url, title_classname, sub_title_classname }: LogoProps) {
   if (short) {
      return (
         <Link href={url}>
            <Image src={"/logo.png"} alt="Logo" height={height} width={width} />
         </Link>
      );
   } else {
      return (
         <Link href={url} className="flex items-center gap-x-4">
            <Image src={"/logo.png"} alt="Logo full" height={height} width={width} className="mt-0.5" />
            <div>
               <p style={{ fontFamily: "Times New Roman, Times, serif" }} className={title_classname}>
                  PT. GARUDA SAKTI
               </p>
               <p
                  style={{ fontFamily: "Times New Roman, Times, serif", letterSpacing: "0.14em" }} className={sub_title_classname}
               >
                  NUSANTARA INDONESA
               </p>
            </div>
         </Link>
      );
   }
}
