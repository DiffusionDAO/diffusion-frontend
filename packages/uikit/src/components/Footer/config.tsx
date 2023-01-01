import { Language } from "../LangSelector/types";
import { FooterLinkType } from "./types";
import { TwitterIcon, TelegramIcon, RedditIcon, InstagramIcon, GithubIcon, DiscordIcon, MediumIcon } from "../Svg";

export const footerLinks: FooterLinkType[] = [
  {
    label: "About",
    items: [
      
    ],
  },

 
];

export const socials = [
  {
    label: "Twitter",
    icon: TwitterIcon,
    href: "https://twitter.com/DFSDIFFUSION",
  },
  {
    label: "Telegram",
    icon: TelegramIcon,
    items: [
      {
        label: "English",
        href: "https://t.me/DiffusionDAO",
      },
      {
        label: "中文",
        href: "https://t.me/DiffusionMetafi",
      },
    ],
  },
 
];
export const langs: Language[] = [...Array(20)].map((_, i) => ({
  code: `en${i}`,
  language: `English${i}`,
  locale: `Locale${i}`,
}));
